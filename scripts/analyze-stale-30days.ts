#!/usr/bin/env bun
/**
 * Analyze Stale Entities Script - 30 Day Threshold
 */

import { APP_CONFIG } from "../src/config/app.config.js";

interface HassState {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

const STALE_THRESHOLD_DAYS = 30;

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

async function main() {
  console.log(`Analyzing stale entities (>${STALE_THRESHOLD_DAYS} days)...\n`);

  try {
    const states = await fetchStates();
    const now = new Date();
    const staleThreshold = new Date(now.getTime() - STALE_THRESHOLD_DAYS * 24 * 60 * 60 * 1000);

    const stale: Array<{ entity_id: string; domain: string; days_stale: number; friendly_name: string }> = [];
    const byDomain: Record<string, number> = {};
    const byIssue: Record<string, number> = {};

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
        const domain = state.entity_id.split(".")[0];
        const friendly_name = state.attributes?.friendly_name || state.entity_id;
        
        stale.push({ entity_id: state.entity_id, domain, days_stale: daysStale, friendly_name });

        byDomain[domain] = (byDomain[domain] || 0) + 1;

        // Categorize potential issues
        let issue = "Device not updating - investigate connectivity";
        if (domain === "update") {
          issue = "Update entity - may be waiting for manual update";
        } else if (domain === "input_" || state.entity_id.startsWith("input_")) {
          issue = "Input helper - manually controlled, may be intentional";
        } else if (domain === "scene") {
          issue = "Scene - only updates when activated";
        } else if (domain === "conversation" || domain === "stt" || domain === "tts") {
          issue = "AI/Conversation entity - only updates on use";
        } else if (domain === "group") {
          issue = "Group entity - aggregates other entities";
        } else if (state.state === "unknown") {
          issue = "State unknown - device may be disconnected";
        } else if (daysStale > 90) {
          issue = "Very stale (>90 days) - likely disconnected or removed";
        } else if (domain === "sensor" || domain === "binary_sensor") {
          issue = "Sensor not updating - check battery/connectivity";
        }

        byIssue[issue] = (byIssue[issue] || 0) + 1;
      }
    }

    stale.sort((a, b) => a.days_stale - b.days_stale);

    console.log(`=== STALE ENTITIES ANALYSIS (${STALE_THRESHOLD_DAYS} days threshold) ===\n`);
    console.log(`Total Stale: ${stale.length}\n`);
    console.log(`Top domains with stale entities:`);
    
    const topDomains = Object.entries(byDomain)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15);
    
    for (const [domain, count] of topDomains) {
      console.log(`  ${domain}: ${count}`);
    }

    console.log(`\nIssue breakdown:`);
    const sortedIssues = Object.entries(byIssue)
      .sort(([, a], [, b]) => b - a);
    
    for (const [issue, count] of sortedIssues) {
      console.log(`  ${issue}: ${count}`);
    }

    if (stale.length > 0) {
      const oldest = stale[0];
      console.log(`\nOldest stale entity: ${oldest.friendly_name} (${oldest.days_stale} days, ${oldest.entity_id})`);
    }

    // Save summary to file
    const summary = {
      threshold_days: STALE_THRESHOLD_DAYS,
      total_stale: stale.length,
      by_domain: byDomain,
      by_issue: byIssue,
      oldest: stale[0] || null,
      sample_stale: stale.slice(0, 50).map(e => ({
        entity_id: e.entity_id,
        friendly_name: e.friendly_name,
        domain: e.domain,
        days_stale: e.days_stale
      }))
    };

    await Bun.write("stale_entities_30days_summary.json", JSON.stringify(summary, null, 2));
    console.log(`\n✅ Summary saved to: stale_entities_30days_summary.json`);

  } catch (error) {
    console.error("Error during analysis:", error);
    process.exit(1);
  }
}

main();


