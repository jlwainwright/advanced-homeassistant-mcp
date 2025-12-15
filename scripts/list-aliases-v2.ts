#!/usr/bin/env bun
/**
 * List Home Assistant Aliases - Version 2
 * Uses different API endpoints to find aliases
 */

import { APP_CONFIG } from "../src/config/app.config.js";

interface HassState {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
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

async function fetchEntityRegistry(): Promise<any[]> {
  // Try multiple possible endpoints
  const endpoints = [
    '/api/config/entity_registry/list',
    '/api/config/entity_registry',
    '/api/entity_registry/list',
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${APP_CONFIG.HASS_HOST}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${APP_CONFIG.HASS_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Handle different response formats
        if (Array.isArray(data)) {
          return data;
        } else if (data && Array.isArray(data.entities)) {
          return data.entities;
        } else if (data && typeof data === 'object') {
          return Object.values(data);
        }
        return data;
      }
    } catch (error) {
      // Try next endpoint
      continue;
    }
  }
  
  return [];
}

async function main() {
  console.log("Fetching Home Assistant aliases (v2)...\n");

  try {
    console.log("Fetching entity states...");
    const states = await fetchStates();
    console.log(`✓ Found ${states.length} entities\n`);

    console.log("Fetching entity registry...");
    const entityRegistry = await fetchEntityRegistry();
    console.log(`✓ Found ${entityRegistry.length} registry entries\n`);

    // Look for entities with aliases
    const entitiesWithAliases: Array<{
      entity_id: string;
      friendly_name: string;
      aliases: string[];
      domain: string;
      registry_data?: any;
    }> = [];

    // Check entity registry entries
    for (const entry of entityRegistry) {
      if (entry.aliases && Array.isArray(entry.aliases) && entry.aliases.length > 0) {
        const [domain] = (entry.entity_id || '').split('.');
        entitiesWithAliases.push({
          entity_id: entry.entity_id,
          friendly_name: entry.name || entry.entity_id,
          aliases: entry.aliases,
          domain,
          registry_data: entry,
        });
      }
    }

    // Also check states for alias attributes
    for (const state of states) {
      const aliases: string[] = [];
      
      if (state.attributes?.aliases && Array.isArray(state.attributes.aliases)) {
        aliases.push(...state.attributes.aliases);
      }
      
      if (state.attributes?.alias && typeof state.attributes.alias === 'string') {
        aliases.push(state.attributes.alias);
      }

      if (aliases.length > 0) {
        const [domain] = state.entity_id.split('.');
        // Check if we already have this entity
        const existing = entitiesWithAliases.find(e => e.entity_id === state.entity_id);
        if (existing) {
          // Merge aliases
          existing.aliases = [...new Set([...existing.aliases, ...aliases])];
        } else {
          entitiesWithAliases.push({
            entity_id: state.entity_id,
            friendly_name: state.attributes?.friendly_name || state.entity_id,
            aliases,
            domain,
          });
        }
      }
    }

    console.log(`\n=== ALIASES ANALYSIS ===\n`);
    console.log(`Entities with explicit aliases: ${entitiesWithAliases.length}\n`);

    if (entitiesWithAliases.length > 0) {
      console.log("Entities with aliases:\n");
      for (const entity of entitiesWithAliases) {
        console.log(`  ${entity.friendly_name} (${entity.entity_id})`);
        console.log(`    Aliases: ${entity.aliases.join(', ')}`);
        console.log(`    Domain: ${entity.domain}\n`);
      }

      // Group by domain
      const byDomain: Record<string, typeof entitiesWithAliases> = {};
      for (const entity of entitiesWithAliases) {
        if (!byDomain[entity.domain]) {
          byDomain[entity.domain] = [];
        }
        byDomain[entity.domain].push(entity);
      }

      console.log("By domain:");
      for (const [domain, entities] of Object.entries(byDomain)) {
        console.log(`  ${domain}: ${entities.length} entities`);
      }

      // Save detailed report
      let report = `# Home Assistant Aliases Report\n\n`;
      report += `**Generated:** ${new Date().toISOString()}\n\n`;
      report += `## Summary\n\n`;
      report += `- **Total Entities with Aliases:** ${entitiesWithAliases.length}\n\n`;
      report += `## Detailed List\n\n`;
      report += `| Entity ID | Friendly Name | Aliases | Domain |\n`;
      report += `|-----------|---------------|---------|--------|\n`;

      for (const entity of entitiesWithAliases) {
        const aliasesStr = entity.aliases.map(a => `\`${a}\``).join(', ');
        report += `| \`${entity.entity_id}\` | ${entity.friendly_name} | ${aliasesStr} | ${entity.domain} |\n`;
      }

      await Bun.write("home_assistant_aliases_detailed.md", report);
      console.log(`\n✅ Detailed report saved to: home_assistant_aliases_detailed.md`);
    } else {
      console.log("No entities with explicit aliases found.");
      console.log("\nNote: Home Assistant aliases are typically stored in the entity registry.");
      console.log("If you're using a newer version of Home Assistant, aliases might be configured");
      console.log("through the UI or in YAML configuration files.");
    }

    // Show sample of entity registry structure
    if (entityRegistry.length > 0) {
      console.log(`\nSample entity registry entry structure:`);
      console.log(JSON.stringify(entityRegistry[0], null, 2));
    }

  } catch (error) {
    console.error("Error during analysis:", error);
    process.exit(1);
  }
}

main();

