#!/usr/bin/env bun
/**
 * Analyze Stale Entities Script
 * Identifies and categorizes stale entities by type, domain, and potential issues
 */

import { APP_CONFIG } from "../src/config/app.config.js";

interface HassState {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

interface StaleEntity {
  entity_id: string;
  friendly_name: string;
  domain: string;
  state: string;
  last_updated: Date;
  days_stale: number;
  area_id?: string;
  device_class?: string;
  potential_issue?: string;
}

const STALE_THRESHOLD_DAYS = 7;

async function fetchStates(): Promise<HassState[]> {
  const response = await fetch(`${APP_CONFIG.HASS_HOST}/api/states`, {
    headers: {
      Authorization: `Bearer ${APP_CONFIG.HASS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch states: ${response.statusText}`);
  }

  return response.json();
}

function analyzeStaleEntities(states: HassState[]): {
  stale: StaleEntity[];
  byDomain: Record<string, StaleEntity[]>;
  byIssue: Record<string, StaleEntity[]>;
  summary: {
    total: number;
    oldest: StaleEntity | null;
    domains: Record<string, number>;
  };
} {
  const now = new Date();
  const staleThreshold = new Date(now.getTime() - STALE_THRESHOLD_DAYS * 24 * 60 * 60 * 1000);

  const stale: StaleEntity[] = [];
  const byDomain: Record<string, StaleEntity[]> = {};
  const byIssue: Record<string, StaleEntity[]> = {};

  for (const state of states) {
    // Skip system entities that don't update frequently
    if (state.entity_id.startsWith("sun.") || 
        state.entity_id.startsWith("zone.") ||
        state.entity_id.startsWith("persistent_notification.")) {
      continue;
    }

    const lastUpdated = new Date(state.last_updated);
    
    if (lastUpdated < staleThreshold && state.state !== "unavailable") {
      const daysStale = Math.floor((now.getTime() - lastUpdated.getTime()) / (24 * 60 * 60 * 1000));
      
      const entity: StaleEntity = {
        entity_id: state.entity_id,
        friendly_name: state.attributes?.friendly_name || state.entity_id,
        domain: state.entity_id.split(".")[0],
        state: state.state,
        last_updated: lastUpdated,
        days_stale: daysStale,
        area_id: state.attributes?.area_id,
        device_class: state.attributes?.device_class,
      };

      // Categorize potential issues
      if (entity.domain === "update") {
        entity.potential_issue = "Update entity - may be waiting for manual update";
      } else if (entity.domain === "input_" || entity.entity_id.startsWith("input_")) {
        entity.potential_issue = "Input helper - manually controlled, may be intentional";
      } else if (entity.domain === "scene") {
        entity.potential_issue = "Scene - only updates when activated";
      } else if (entity.domain === "conversation" || entity.domain === "stt" || entity.domain === "tts") {
        entity.potential_issue = "AI/Conversation entity - only updates on use";
      } else if (entity.domain === "group") {
        entity.potential_issue = "Group entity - aggregates other entities";
      } else if (entity.state === "unknown") {
        entity.potential_issue = "State unknown - device may be disconnected";
      } else if (daysStale > 30) {
        entity.potential_issue = "Very stale (>30 days) - likely disconnected or removed";
      } else if (entity.domain === "sensor" || entity.domain === "binary_sensor") {
        entity.potential_issue = "Sensor not updating - check battery/connectivity";
      } else {
        entity.potential_issue = "Device not updating - investigate connectivity";
      }

      stale.push(entity);

      // Group by domain
      if (!byDomain[entity.domain]) {
        byDomain[entity.domain] = [];
      }
      byDomain[entity.domain].push(entity);

      // Group by issue type
      const issueKey = entity.potential_issue || "Unknown";
      if (!byIssue[issueKey]) {
        byIssue[issueKey] = [];
      }
      byIssue[issueKey].push(entity);
    }
  }

  // Sort by oldest first
  stale.sort((a, b) => a.last_updated.getTime() - b.last_updated.getTime());

  // Count by domain
  const domainCounts: Record<string, number> = {};
  for (const entity of stale) {
    domainCounts[entity.domain] = (domainCounts[entity.domain] || 0) + 1;
  }

  return {
    stale,
    byDomain,
    byIssue,
    summary: {
      total: stale.length,
      oldest: stale[0] || null,
      domains: domainCounts,
    },
  };
}

function formatReport(analysis: ReturnType<typeof analyzeStaleEntities>): string {
  let report = `# Stale Entities Analysis\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n`;
  report += `**Stale Threshold:** ${STALE_THRESHOLD_DAYS} days\n\n`;

  report += `## Summary\n\n`;
  report += `- **Total Stale Entities:** ${analysis.summary.total}\n`;
  
  if (analysis.summary.oldest) {
    const oldest = analysis.summary.oldest;
    report += `- **Oldest Stale Entity:** ${oldest.friendly_name} (${oldest.days_stale} days old, last updated: ${oldest.last_updated.toISOString().split('T')[0]})\n`;
  }

  report += `\n### Stale Entities by Domain\n\n`;
  report += `| Domain | Count |\n`;
  report += `|--------|-------|\n`;
  
  const sortedDomains = Object.entries(analysis.summary.domains)
    .sort(([, a], [, b]) => b - a);
  
  for (const [domain, count] of sortedDomains) {
    report += `| ${domain} | ${count} |\n`;
  }

  report += `\n---\n\n`;

  report += `## Stale Entities by Issue Type\n\n`;
  
  const sortedIssues = Object.entries(analysis.byIssue)
    .sort(([, a], [, b]) => b.length - a.length);

  for (const [issue, entities] of sortedIssues) {
    report += `### ${issue}\n\n`;
    report += `**Count:** ${entities.length}\n\n`;
    
    if (entities.length <= 20) {
      report += `| Entity ID | Friendly Name | Domain | Days Stale | State |\n`;
      report += `|-----------|---------------|--------|------------|-------|\n`;
      
      for (const entity of entities.slice(0, 20)) {
        report += `| \`${entity.entity_id}\` | ${entity.friendly_name} | ${entity.domain} | ${entity.days_stale} | ${entity.state} |\n`;
      }
    } else {
      report += `| Entity ID | Friendly Name | Domain | Days Stale | State |\n`;
      report += `|-----------|---------------|--------|------------|-------|\n`;
      
      for (const entity of entities.slice(0, 20)) {
        report += `| \`${entity.entity_id}\` | ${entity.friendly_name} | ${entity.domain} | ${entity.days_stale} | ${entity.state} |\n`;
      }
      
      report += `\n*... and ${entities.length - 20} more entities in this category*\n`;
    }
    
    report += `\n`;
  }

  report += `\n---\n\n`;

  report += `## Detailed Stale Entities List\n\n`;
  report += `### Top 50 Oldest Stale Entities\n\n`;
  report += `| Entity ID | Friendly Name | Domain | Days Stale | Last Updated | State | Issue |\n`;
  report += `|-----------|---------------|--------|------------|--------------|-------|------|\n`;

  for (const entity of analysis.stale.slice(0, 50)) {
    report += `| \`${entity.entity_id}\` | ${entity.friendly_name} | ${entity.domain} | ${entity.days_stale} | ${entity.last_updated.toISOString().split('T')[0]} | ${entity.state} | ${entity.potential_issue} |\n`;
  }

  if (analysis.stale.length > 50) {
    report += `\n*... and ${analysis.stale.length - 50} more stale entities*\n`;
  }

  return report;
}

async function main() {
  console.log("Analyzing stale entities...\n");

  try {
    const states = await fetchStates();
    console.log(`✓ Fetched ${states.length} entities\n`);

    const analysis = analyzeStaleEntities(states);
    console.log(`✓ Found ${analysis.summary.total} stale entities\n`);

    const report = formatReport(analysis);
    
    const reportPath = "stale_entities_analysis.md";
    await Bun.write(reportPath, report);
    console.log(`\n✅ Analysis complete! Report saved to: ${reportPath}\n`);

    // Print summary to console
    console.log("=== STALE ENTITIES SUMMARY ===");
    console.log(`Total Stale: ${analysis.summary.total}`);
    console.log(`\nTop domains with stale entities:`);
    
    const topDomains = Object.entries(analysis.summary.domains)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
    
    for (const [domain, count] of topDomains) {
      console.log(`  ${domain}: ${count}`);
    }

    console.log(`\nIssue breakdown:`);
    const sortedIssues = Object.entries(analysis.byIssue)
      .sort(([, a], [, b]) => b.length - a.length);
    
    for (const [issue, entities] of sortedIssues.slice(0, 10)) {
      console.log(`  ${issue}: ${entities.length}`);
    }

    if (analysis.summary.oldest) {
      const oldest = analysis.summary.oldest;
      console.log(`\nOldest stale entity: ${oldest.friendly_name} (${oldest.days_stale} days)`);
    }

  } catch (error) {
    console.error("Error during analysis:", error);
    process.exit(1);
  }
}

main();


