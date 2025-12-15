#!/usr/bin/env bun
/**
 * List All Home Assistant Components
 * Identifies all Styles, Entities, Integrations, and related components
 */

import { APP_CONFIG } from "../src/config/app.config.js";

interface HassState {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

interface Integration {
  entry_id: string;
  domain: string;
  title: string;
  source: string;
  state: string;
  supports_options: boolean;
  supports_remove_device: boolean;
  supports_unload: boolean;
}

interface Component {
  entity_id: string;
  friendly_name: string;
  domain: string;
  state: string;
  area_id?: string;
  device_id?: string;
  device_class?: string;
  integration?: string;
}

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

async function fetchIntegrations(): Promise<Integration[]> {
  try {
    const response = await fetch(`${APP_CONFIG.HASS_HOST}/api/config/config_entries/entry`, {
      headers: {
        Authorization: `Bearer ${APP_CONFIG.HASS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.warn("Could not fetch integrations:", error);
    return [];
  }
}

async function fetchDevices(): Promise<any[]> {
  try {
    const response = await fetch(`${APP_CONFIG.HASS_HOST}/api/devices`, {
      headers: {
        Authorization: `Bearer ${APP_CONFIG.HASS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.warn("Could not fetch devices:", error);
    return [];
  }
}

async function fetchAreas(): Promise<any[]> {
  try {
    const response = await fetch(`${APP_CONFIG.HASS_HOST}/api/areas`, {
      headers: {
        Authorization: `Bearer ${APP_CONFIG.HASS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.warn("Could not fetch areas:", error);
    return [];
  }
}

function categorizeEntities(states: HassState[]): {
  styles: Component[];
  entities: Component[];
  byDomain: Record<string, Component[]>;
  byIntegration: Record<string, Component[]>;
} {
  const styles: Component[] = [];
  const entities: Component[] = [];
  const byDomain: Record<string, Component[]> = {};
  const byIntegration: Record<string, Component[]> = {};

  for (const state of states) {
    const [domain] = state.entity_id.split(".");
    
    const component: Component = {
      entity_id: state.entity_id,
      friendly_name: state.attributes?.friendly_name || state.entity_id,
      domain,
      state: state.state,
      area_id: state.attributes?.area_id,
      device_id: state.attributes?.device_id,
      device_class: state.attributes?.device_class,
      integration: state.attributes?.integration || domain,
    };

    // Identify styles (themes, UI customizations)
    if (domain === "theme" || 
        state.entity_id.includes("theme") ||
        state.entity_id.includes("style") ||
        state.attributes?.theme ||
        state.attributes?.style) {
      styles.push(component);
    }

    entities.push(component);

    // Group by domain
    if (!byDomain[domain]) {
      byDomain[domain] = [];
    }
    byDomain[domain].push(component);

    // Group by integration (inferred from domain or attributes)
    const integration = component.integration || domain;
    if (!byIntegration[integration]) {
      byIntegration[integration] = [];
    }
    byIntegration[integration].push(component);
  }

  return { styles, entities, byDomain, byIntegration };
}

function formatReport(
  entities: Component[],
  styles: Component[],
  integrations: Integration[],
  byDomain: Record<string, Component[]>,
  byIntegration: Record<string, Component[]>,
  devices: any[],
  areas: any[]
): string {
  let report = `# Home Assistant Components Inventory\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n\n`;

  report += `## Summary\n\n`;
  report += `- **Total Entities:** ${entities.length}\n`;
  report += `- **Styles/Themes:** ${styles.length}\n`;
  report += `- **Integrations:** ${integrations.length}\n`;
  report += `- **Devices:** ${devices.length}\n`;
  report += `- **Areas:** ${areas.length}\n`;
  report += `- **Unique Domains:** ${Object.keys(byDomain).length}\n`;
  report += `- **Unique Integrations:** ${Object.keys(byIntegration).length}\n\n`;

  report += `---\n\n`;

  // Styles Section
  report += `## Styles and Themes\n\n`;
  if (styles.length === 0) {
    report += `No style/theme entities found.\n\n`;
  } else {
    report += `| Entity ID | Friendly Name | State | Domain |\n`;
    report += `|-----------|---------------|-------|--------|\n`;
    for (const style of styles.slice(0, 50)) {
      report += `| \`${style.entity_id}\` | ${style.friendly_name} | ${style.state} | ${style.domain} |\n`;
    }
    if (styles.length > 50) {
      report += `\n*... and ${styles.length - 50} more style entities*\n`;
    }
  }

  report += `\n---\n\n`;

  // Integrations Section
  report += `## Integrations\n\n`;
  if (integrations.length === 0) {
    report += `Unable to fetch integration list. This may require Home Assistant Supervisor or specific API permissions.\n\n`;
  } else {
    report += `| Entry ID | Domain | Title | Source | State |\n`;
    report += `|----------|--------|-------|--------|-------|\n`;
    
    const sortedIntegrations = integrations.sort((a, b) => a.domain.localeCompare(b.domain));
    
    for (const integration of sortedIntegrations) {
      report += `| \`${integration.entry_id}\` | ${integration.domain} | ${integration.title} | ${integration.source} | ${integration.state} |\n`;
    }

    // Integration statistics
    report += `\n### Integration Statistics\n\n`;
    const bySource: Record<string, number> = {};
    const byState: Record<string, number> = {};
    
    for (const integration of integrations) {
      bySource[integration.source] = (bySource[integration.source] || 0) + 1;
      byState[integration.state] = (byState[integration.state] || 0) + 1;
    }

    report += `**By Source:**\n`;
    for (const [source, count] of Object.entries(bySource).sort(([, a], [, b]) => b - a)) {
      report += `- ${source}: ${count}\n`;
    }

    report += `\n**By State:**\n`;
    for (const [state, count] of Object.entries(byState).sort(([, a], [, b]) => b - a)) {
      report += `- ${state}: ${count}\n`;
    }
  }

  report += `\n---\n\n`;

  // Entities by Domain
  report += `## Entities by Domain\n\n`;
  report += `| Domain | Count | Sample Entities |\n`;
  report += `|-------|-------|-----------------|\n`;

  const sortedDomains = Object.entries(byDomain)
    .sort(([, a], [, b]) => b.length - a.length);

  for (const [domain, domainEntities] of sortedDomains) {
    const sample = domainEntities.slice(0, 3).map(e => e.friendly_name).join(", ");
    report += `| ${domain} | ${domainEntities.length} | ${sample || "N/A"} |\n`;
  }

  report += `\n---\n\n`;

  // Entities by Integration (inferred)
  report += `## Entities by Integration (Inferred)\n\n`;
  report += `| Integration | Count | Sample Entities |\n`;
  report += `|-------------|-------|-----------------|\n`;

  const sortedIntegrationsByCount = Object.entries(byIntegration)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 30); // Top 30 integrations

  for (const [integration, integrationEntities] of sortedIntegrationsByCount) {
    const sample = integrationEntities.slice(0, 3).map(e => e.friendly_name).join(", ");
    report += `| ${integration} | ${integrationEntities.length} | ${sample || "N/A"} |\n`;
  }

  report += `\n---\n\n`;

  // Areas
  if (areas.length > 0) {
    report += `## Areas\n\n`;
    report += `| Area ID | Name |\n`;
    report += `|---------|------|\n`;
    
    for (const area of areas) {
      report += `| ${area.area_id} | ${area.name} |\n`;
    }
    report += `\n`;
  }

  // Devices Summary
  if (devices.length > 0) {
    report += `## Devices Summary\n\n`;
    report += `Total Devices: ${devices.length}\n\n`;
    
    // Group devices by manufacturer or integration
    const byManufacturer: Record<string, number> = {};
    for (const device of devices) {
      const manufacturer = device.manufacturer || "Unknown";
      byManufacturer[manufacturer] = (byManufacturer[manufacturer] || 0) + 1;
    }

    report += `**Top Manufacturers:**\n`;
    const topManufacturers = Object.entries(byManufacturer)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
    
    for (const [manufacturer, count] of topManufacturers) {
      report += `- ${manufacturer}: ${count}\n`;
    }
  }

  return report;
}

async function main() {
  console.log("Fetching Home Assistant components...\n");

  try {
    console.log("Fetching entities...");
    const states = await fetchStates();
    console.log(`✓ Found ${states.length} entities\n`);

    console.log("Fetching integrations...");
    const integrations = await fetchIntegrations();
    console.log(`✓ Found ${integrations.length} integrations\n`);

    console.log("Fetching devices...");
    const devices = await fetchDevices();
    console.log(`✓ Found ${devices.length} devices\n`);

    console.log("Fetching areas...");
    const areas = await fetchAreas();
    console.log(`✓ Found ${areas.length} areas\n`);

    console.log("Categorizing entities...");
    const { styles, entities, byDomain, byIntegration } = categorizeEntities(states);
    console.log(`✓ Categorized ${entities.length} entities\n`);
    console.log(`✓ Found ${styles.length} style/theme entities\n`);

    const report = formatReport(
      entities,
      styles,
      integrations,
      byDomain,
      byIntegration,
      devices,
      areas
    );

    const reportPath = "home_assistant_components_inventory.md";
    await Bun.write(reportPath, report);
    console.log(`\n✅ Inventory complete! Report saved to: ${reportPath}\n`);

    // Print summary to console
    console.log("=== COMPONENTS SUMMARY ===");
    console.log(`Total Entities: ${entities.length}`);
    console.log(`Styles/Themes: ${styles.length}`);
    console.log(`Integrations: ${integrations.length}`);
    console.log(`Devices: ${devices.length}`);
    console.log(`Areas: ${areas.length}`);
    console.log(`Unique Domains: ${Object.keys(byDomain).length}`);
    console.log(`\nTop 10 Domains:`);
    
    const topDomains = Object.entries(byDomain)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 10);
    
    for (const [domain, domainEntities] of topDomains) {
      console.log(`  ${domain}: ${domainEntities.length}`);
    }

    if (styles.length > 0) {
      console.log(`\nStyles/Themes found:`);
      for (const style of styles.slice(0, 10)) {
        console.log(`  - ${style.friendly_name} (${style.entity_id})`);
      }
    }

    if (integrations.length > 0) {
      console.log(`\nTop 10 Integrations:`);
      const topIntegrations = Object.entries(byIntegration)
        .sort(([, a], [, b]) => b.length - a.length)
        .slice(0, 10);
      
      for (const [integration, integrationEntities] of topIntegrations) {
        console.log(`  ${integration}: ${integrationEntities.length} entities`);
      }
    }

  } catch (error) {
    console.error("Error during inventory:", error);
    process.exit(1);
  }
}

main();


