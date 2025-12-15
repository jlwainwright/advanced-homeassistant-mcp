#!/usr/bin/env bun
/**
 * Home Assistant Audit Script
 * Performs a comprehensive audit of your Home Assistant instance
 */

import { APP_CONFIG } from "../src/config/app.config.js";

interface HassState {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

interface DeviceInfo {
  entity_id: string;
  friendly_name: string;
  state: string;
  last_updated: Date;
  domain: string;
  area_id?: string;
  device_class?: string;
}

interface AuditReport {
  generated: string;
  audit_period: {
    start: string;
    end: string;
  };
  summary: {
    total_devices: number;
    active_devices: number;
    stale_devices: number;
    total_automations: number;
    active_automations: number;
    total_integrations: number;
  };
  stale_devices: DeviceInfo[];
  active_devices: DeviceInfo[];
  device_by_domain: Record<string, number>;
  automations: {
    entity_id: string;
    name: string;
    state: string;
    last_triggered?: string;
  }[];
  recommendations: string[];
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

async function fetchAutomations(): Promise<HassState[]> {
  const states = await fetchStates();
  return states.filter((state) => state.entity_id.startsWith("automation."));
}

async function fetchIntegrations(): Promise<any> {
  try {
    const response = await fetch(`${APP_CONFIG.HASS_HOST}/api/config/config_entries/entry`, {
      headers: {
        Authorization: `Bearer ${APP_CONFIG.HASS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // This endpoint might not be available in all HA versions
      return [];
    }

    return response.json();
  } catch (error) {
    console.warn("Could not fetch integrations:", error);
    return [];
  }
}

async function fetchAddons(): Promise<any[]> {
  try {
    const response = await fetch(`${APP_CONFIG.HASS_HOST}/api/hassio/addons`, {
      headers: {
        Authorization: `Bearer ${APP_CONFIG.HASS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data?.addons || [];
  } catch (error) {
    console.warn("Could not fetch add-ons:", error);
    return [];
  }
}

function analyzeDevices(states: HassState[]): {
  stale: DeviceInfo[];
  active: DeviceInfo[];
  byDomain: Record<string, number>;
} {
  const now = new Date();
  const staleThreshold = new Date(now.getTime() - STALE_THRESHOLD_DAYS * 24 * 60 * 60 * 1000);

  const stale: DeviceInfo[] = [];
  const active: DeviceInfo[] = [];
  const byDomain: Record<string, number> = {};

  for (const state of states) {
    // Skip system entities
    if (state.entity_id.startsWith("sun.") || 
        state.entity_id.startsWith("zone.") ||
        state.entity_id.startsWith("persistent_notification.")) {
      continue;
    }

    const [domain] = state.entity_id.split(".");
    byDomain[domain] = (byDomain[domain] || 0) + 1;

    const lastUpdated = new Date(state.last_updated);
    const deviceInfo: DeviceInfo = {
      entity_id: state.entity_id,
      friendly_name: state.attributes?.friendly_name || state.entity_id,
      state: state.state,
      last_updated: lastUpdated,
      domain,
      area_id: state.attributes?.area_id,
      device_class: state.attributes?.device_class,
    };

    if (lastUpdated < staleThreshold && state.state !== "unavailable") {
      stale.push(deviceInfo);
    } else if (state.state !== "unavailable") {
      active.push(deviceInfo);
    }
  }

  // Sort stale devices by last updated (oldest first)
  stale.sort((a, b) => a.last_updated.getTime() - b.last_updated.getTime());

  // Sort active devices by last updated (newest first)
  active.sort((a, b) => b.last_updated.getTime() - a.last_updated.getTime());

  return { stale, active, byDomain };
}

function generateRecommendations(
  report: AuditReport,
  addons: any[]
): string[] {
  const recommendations: string[] = [];

  // Stale device recommendations
  if (report.stale_devices.length > 0) {
    recommendations.push(
      `Review ${report.stale_devices.length} stale devices that haven't updated in ${STALE_THRESHOLD_DAYS} days`
    );
    recommendations.push(
      "Check battery levels and connectivity for stale battery-powered devices"
    );
  }

  // Automation recommendations
  if (report.automations.length === 0) {
    recommendations.push("Consider creating automations to improve your smart home experience");
  } else {
    const inactiveAutomations = report.automations.filter(
      (a) => a.state === "off"
    );
    if (inactiveAutomations.length > 0) {
      recommendations.push(
        `Review ${inactiveAutomations.length} inactive automations - consider enabling or removing them`
      );
    }
  }

  // Device organization recommendations
  const domainsWithManyDevices = Object.entries(report.device_by_domain)
    .filter(([_, count]) => count > 10)
    .map(([domain]) => domain);
  if (domainsWithManyDevices.length > 0) {
    recommendations.push(
      `Consider organizing ${domainsWithManyDevices.join(", ")} devices into areas for better management`
    );
  }

  // Integration recommendations
  if (report.summary.total_integrations === 0) {
    recommendations.push("Unable to fetch integration data - ensure Home Assistant API is accessible");
  }

  // Add-on recommendations
  if (addons.length > 0) {
    const outdatedAddons = addons.filter(
      (addon) => addon.update_available === true
    );
    if (outdatedAddons.length > 0) {
      recommendations.push(
        `Update ${outdatedAddons.length} add-on(s) with available updates`
      );
    }
  }

  return recommendations;
}

function formatMarkdownReport(report: AuditReport, addons: any[]): string {
  const now = new Date();
  const startDate = new Date(now.getTime() - STALE_THRESHOLD_DAYS * 24 * 60 * 60 * 1000);

  let markdown = `# Home Assistant Device and Integration Audit Report\n\n`;
  markdown += `**Generated:** ${report.generated}\n`;
  markdown += `**Audit Period:** Last ${STALE_THRESHOLD_DAYS} days (${startDate.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]})\n\n`;

  // Executive Summary
  markdown += `## Executive Summary\n\n`;
  markdown += `- **Total Devices:** ${report.summary.total_devices}\n`;
  markdown += `- **Active Devices:** ${report.summary.active_devices}\n`;
  markdown += `- **Stale/Inactive Devices:** ${report.summary.stale_devices}\n`;
  markdown += `- **Total Automations:** ${report.summary.total_automations}\n`;
  markdown += `- **Active Automations:** ${report.summary.active_automations}\n`;
  markdown += `- **Total Integrations:** ${report.summary.total_integrations}\n\n`;
  markdown += `---\n\n`;

  // Stale Devices
  markdown += `## 1. Stale/Inactive Devices\n\n`;
  markdown += `*Devices that have not been updated in more than ${STALE_THRESHOLD_DAYS} days*\n\n`;
  
  if (report.stale_devices.length === 0) {
    markdown += `✅ **No stale devices found!** All devices are active.\n\n`;
  } else {
    markdown += `| Entity ID | Friendly Name | Last Updated | Current State | Domain |\n`;
    markdown += `|-----------|---------------|---------------|---------------|--------|\n`;
    
    for (const device of report.stale_devices.slice(0, 50)) { // Limit to top 50
      const lastUpdated = device.last_updated.toISOString().split('T')[0];
      markdown += `| \`${device.entity_id}\` | ${device.friendly_name} | ${lastUpdated} | ${device.state} | ${device.domain} |\n`;
    }
    
    if (report.stale_devices.length > 50) {
      markdown += `\n*... and ${report.stale_devices.length - 50} more stale devices*\n`;
    }
    
    markdown += `\n**Analysis:**\n`;
    markdown += `- Number of stale devices: ${report.stale_devices.length}\n`;
    
    const staleByDomain = report.stale_devices.reduce((acc, d) => {
      acc[d.domain] = (acc[d.domain] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostCommonStale = Object.entries(staleByDomain)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([domain]) => domain)
      .join(", ");
    markdown += `- Most common stale device types: ${mostCommonStale || "N/A"}\n`;
    
    const oldestStale = report.stale_devices[0];
    if (oldestStale) {
      markdown += `- Oldest stale device: ${oldestStale.friendly_name} (last updated: ${oldestStale.last_updated.toISOString().split('T')[0]})\n`;
    }
  }
  
  markdown += `\n---\n\n`;

  // Active Devices Summary
  markdown += `## 2. Active Devices\n\n`;
  markdown += `### 2.1 Active Device Summary\n`;
  markdown += `- **Total Active Devices:** ${report.summary.active_devices}\n`;
  
  if (report.active_devices.length > 0) {
    const mostRecent = report.active_devices[0];
    markdown += `- **Most Recently Updated:** ${mostRecent.friendly_name} (${mostRecent.last_updated.toISOString()})\n`;
  }
  
  markdown += `\n### 2.2 Top 10 Most Recently Updated Devices\n\n`;
  markdown += `| Entity ID | Friendly Name | Last Updated |\n`;
  markdown += `|-----------|---------------|--------------|\n`;
  
  for (const device of report.active_devices.slice(0, 10)) {
    markdown += `| \`${device.entity_id}\` | ${device.friendly_name} | ${device.last_updated.toISOString()} |\n`;
  }
  
  markdown += `\n---\n\n`;

  // Device Distribution
  markdown += `## 3. Device Distribution by Domain\n\n`;
  markdown += `| Domain | Count |\n`;
  markdown += `|--------|-------|\n`;
  
  const sortedDomains = Object.entries(report.device_by_domain)
    .sort(([, a], [, b]) => b - a);
  
  for (const [domain, count] of sortedDomains) {
    markdown += `| ${domain} | ${count} |\n`;
  }
  
  markdown += `\n---\n\n`;

  // Automations
  markdown += `## 4. Automation Analysis\n\n`;
  markdown += `### 4.1 Automation Summary\n`;
  markdown += `- **Total Automations:** ${report.summary.total_automations}\n`;
  markdown += `- **Active Automations:** ${report.summary.active_automations}\n`;
  markdown += `- **Inactive Automations:** ${report.summary.total_automations - report.summary.active_automations}\n\n`;
  
  if (report.automations.length > 0) {
    markdown += `### 4.2 Automation List\n\n`;
    markdown += `| Entity ID | Name | State | Last Triggered |\n`;
    markdown += `|-----------|------|-------|----------------|\n`;
    
    for (const automation of report.automations.slice(0, 20)) {
      const lastTriggered = automation.last_triggered 
        ? new Date(automation.last_triggered).toISOString().split('T')[0]
        : "Never";
      markdown += `| \`${automation.entity_id}\` | ${automation.name} | ${automation.state} | ${lastTriggered} |\n`;
    }
    
    if (report.automations.length > 20) {
      markdown += `\n*... and ${report.automations.length - 20} more automations*\n`;
    }
  }
  
  markdown += `\n---\n\n`;

  // Add-ons
  if (addons.length > 0) {
    markdown += `## 5. Add-ons\n\n`;
    markdown += `| Name | Slug | Version | State | Update Available |\n`;
    markdown += `|------|------|---------|-------|-------------------|\n`;
    
    for (const addon of addons.slice(0, 20)) {
      markdown += `| ${addon.name} | \`${addon.slug}\` | ${addon.version} | ${addon.state} | ${addon.update_available ? "Yes" : "No"} |\n`;
    }
    
    markdown += `\n---\n\n`;
  }

  // Recommendations
  markdown += `## 6. Recommendations\n\n`;
  
  if (report.recommendations.length === 0) {
    markdown += `✅ **No specific recommendations at this time.** Your Home Assistant setup looks good!\n\n`;
  } else {
    for (const rec of report.recommendations) {
      markdown += `- ${rec}\n`;
    }
  }
  
  markdown += `\n---\n\n`;

  // Technical Notes
  markdown += `## 7. Technical Notes\n\n`;
  markdown += `### Data Collection Method\n`;
  markdown += `- Data source: Home Assistant REST API\n`;
  markdown += `- Collection timestamp: ${report.generated}\n`;
  markdown += `- Stale threshold: ${STALE_THRESHOLD_DAYS} days without updates\n\n`;
  
  markdown += `### Definitions\n`;
  markdown += `- **Stale Device**: Device/entity with last updated timestamp > ${STALE_THRESHOLD_DAYS} days ago\n`;
  markdown += `- **Active Device**: Device that is available and has been updated within the last ${STALE_THRESHOLD_DAYS} days\n`;
  markdown += `- **Inactive Automation**: Automation with state "off"\n\n`;

  return markdown;
}

async function main() {
  console.log("Starting Home Assistant audit...\n");

  try {
    // Fetch data
    console.log("Fetching device states...");
    const states = await fetchStates();
    console.log(`✓ Found ${states.length} entities\n`);

    console.log("Analyzing devices...");
    const deviceAnalysis = analyzeDevices(states);
    console.log(`✓ Analyzed ${deviceAnalysis.stale.length} stale and ${deviceAnalysis.active.length} active devices\n`);

    console.log("Fetching automations...");
    const automations = await fetchAutomations();
    console.log(`✓ Found ${automations.length} automations\n`);

    console.log("Fetching integrations...");
    const integrations = await fetchIntegrations();
    console.log(`✓ Found ${integrations.length} integrations\n`);

    console.log("Fetching add-ons...");
    const addons = await fetchAddons();
    console.log(`✓ Found ${addons.length} add-ons\n`);

    // Build report
    const now = new Date();
    const report: AuditReport = {
      generated: now.toISOString(),
      audit_period: {
        start: new Date(now.getTime() - STALE_THRESHOLD_DAYS * 24 * 60 * 60 * 1000).toISOString(),
        end: now.toISOString(),
      },
      summary: {
        total_devices: states.length,
        active_devices: deviceAnalysis.active.length,
        stale_devices: deviceAnalysis.stale.length,
        total_automations: automations.length,
        active_automations: automations.filter((a) => a.state === "on").length,
        total_integrations: Array.isArray(integrations) ? integrations.length : 0,
      },
      stale_devices: deviceAnalysis.stale,
      active_devices: deviceAnalysis.active,
      device_by_domain: deviceAnalysis.byDomain,
      automations: automations.map((auto) => ({
        entity_id: auto.entity_id,
        name: auto.attributes?.friendly_name || auto.entity_id.split(".")[1],
        state: auto.state,
        last_triggered: auto.attributes?.last_triggered,
      })),
      recommendations: [],
    };

    report.recommendations = generateRecommendations(report, addons);

    // Generate markdown report
    const markdown = formatMarkdownReport(report, addons);

    // Write report to file
    const reportPath = "home_assistant_audit_report.md";
    await Bun.write(reportPath, markdown);
    console.log(`\n✅ Audit complete! Report saved to: ${reportPath}\n`);

    // Print summary to console
    console.log("=== AUDIT SUMMARY ===");
    console.log(`Total Devices: ${report.summary.total_devices}`);
    console.log(`Active Devices: ${report.summary.active_devices}`);
    console.log(`Stale Devices: ${report.summary.stale_devices}`);
    console.log(`Automations: ${report.summary.total_automations} (${report.summary.active_automations} active)`);
    console.log(`Integrations: ${report.summary.total_integrations}`);
    console.log(`Add-ons: ${addons.length}`);
    console.log(`\nTop domains: ${Object.entries(report.device_by_domain).sort(([, a], [, b]) => b - a).slice(0, 5).map(([d]) => d).join(", ")}`);

  } catch (error) {
    console.error("Error during audit:", error);
    process.exit(1);
  }
}

main();

