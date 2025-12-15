#!/usr/bin/env bun
/**
 * List Home Assistant Aliases
 * Queries all entities to find aliases and their mappings
 */

import { APP_CONFIG } from "../src/config/app.config.js";

interface HassState {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

interface AliasInfo {
  entity_id: string;
  friendly_name: string;
  aliases: string[];
  domain: string;
  device_id?: string;
  area_id?: string;
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
  try {
    const response = await fetch(`${APP_CONFIG.HASS_HOST}/api/config/entity_registry/list`, {
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
    console.warn("Could not fetch entity registry:", error);
    return [];
  }
}

function extractAliases(states: HassState[], entityRegistry: any[]): {
  entitiesWithAliases: AliasInfo[];
  aliasCount: number;
  byDomain: Record<string, AliasInfo[]>;
} {
  const entitiesWithAliases: AliasInfo[] = [];
  const byDomain: Record<string, AliasInfo[]> = {};
  let totalAliasCount = 0;

  // Create a map of entity_id to registry entry for quick lookup
  const registryMap = new Map<string, any>();
  for (const entry of entityRegistry) {
    registryMap.set(entry.entity_id, entry);
  }

  for (const state of states) {
    const registryEntry = registryMap.get(state.entity_id);
    
    // Check for aliases in attributes
    const aliases: string[] = [];
    
    // Check entity_registry entry for aliases (newer HA versions)
    if (registryEntry?.aliases && Array.isArray(registryEntry.aliases)) {
      aliases.push(...registryEntry.aliases);
    }
    
    // Check attributes for aliases (older HA versions or custom)
    if (state.attributes?.aliases && Array.isArray(state.attributes.aliases)) {
      aliases.push(...state.attributes.aliases);
    }
    
    // Check for alias attribute (singular)
    if (state.attributes?.alias && typeof state.attributes.alias === 'string') {
      aliases.push(state.attributes.alias);
    }

    // Also check if friendly_name differs significantly from entity_id (informational)
    const friendlyName = state.attributes?.friendly_name || state.entity_id;
    const entityIdBase = state.entity_id.split('.').pop() || '';
    const nameWords = friendlyName.toLowerCase().split(/\s+/);
    const idWords = entityIdBase.toLowerCase().split(/_/);
    
    // If we have aliases or the name is significantly different, include it
    if (aliases.length > 0 || (friendlyName !== state.entity_id && friendlyName !== entityIdBase)) {
      const [domain] = state.entity_id.split('.');
      
      const aliasInfo: AliasInfo = {
        entity_id: state.entity_id,
        friendly_name: friendlyName,
        aliases: aliases,
        domain,
        device_id: registryEntry?.device_id || state.attributes?.device_id,
        area_id: registryEntry?.area_id || state.attributes?.area_id,
      };

      entitiesWithAliases.push(aliasInfo);
      totalAliasCount += aliases.length;

      if (!byDomain[domain]) {
        byDomain[domain] = [];
      }
      byDomain[domain].push(aliasInfo);
    }
  }

  return {
    entitiesWithAliases,
    aliasCount: totalAliasCount,
    byDomain,
  };
}

function formatReport(
  entitiesWithAliases: AliasInfo[],
  aliasCount: number,
  byDomain: Record<string, AliasInfo[]>
): string {
  let report = `# Home Assistant Aliases Report\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n\n`;

  report += `## Summary\n\n`;
  report += `- **Total Entities with Aliases:** ${entitiesWithAliases.length}\n`;
  report += `- **Total Alias Count:** ${aliasCount}\n`;
  report += `- **Domains with Aliases:** ${Object.keys(byDomain).length}\n\n`;

  report += `---\n\n`;

  // Entities by Domain
  report += `## Aliases by Domain\n\n`;
  report += `| Domain | Entities with Aliases | Total Aliases |\n`;
  report += `|--------|----------------------|---------------|\n`;

  const sortedDomains = Object.entries(byDomain)
    .sort(([, a], [, b]) => b.length - a.length);

  for (const [domain, domainEntities] of sortedDomains) {
    const totalAliases = domainEntities.reduce((sum, e) => sum + e.aliases.length, 0);
    report += `| ${domain} | ${domainEntities.length} | ${totalAliases} |\n`;
  }

  report += `\n---\n\n`;

  // Detailed list
  report += `## Detailed Alias List\n\n`;
  
  // Group by whether they have explicit aliases or just friendly names
  const withExplicitAliases = entitiesWithAliases.filter(e => e.aliases.length > 0);
  const withFriendlyNamesOnly = entitiesWithAliases.filter(e => e.aliases.length === 0);

  if (withExplicitAliases.length > 0) {
    report += `### Entities with Explicit Aliases (${withExplicitAliases.length})\n\n`;
    report += `| Entity ID | Friendly Name | Aliases | Domain |\n`;
    report += `|-----------|---------------|---------|--------|\n`;

    for (const entity of withExplicitAliases.slice(0, 100)) {
      const aliasesStr = entity.aliases.length > 0 
        ? entity.aliases.map(a => `\`${a}\``).join(', ')
        : 'None';
      report += `| \`${entity.entity_id}\` | ${entity.friendly_name} | ${aliasesStr} | ${entity.domain} |\n`;
    }

    if (withExplicitAliases.length > 100) {
      report += `\n*... and ${withExplicitAliases.length - 100} more entities with explicit aliases*\n`;
    }
  }

  if (withFriendlyNamesOnly.length > 0) {
    report += `\n### Entities with Friendly Names Only (${withFriendlyNamesOnly.length})\n\n`;
    report += `*These entities have friendly names that differ from their entity_id but no explicit aliases defined.*\n\n`;
    report += `| Entity ID | Friendly Name | Domain |\n`;
    report += `|-----------|---------------|--------|\n`;

    for (const entity of withFriendlyNamesOnly.slice(0, 50)) {
      report += `| \`${entity.entity_id}\` | ${entity.friendly_name} | ${entity.domain} |\n`;
    }

    if (withFriendlyNamesOnly.length > 50) {
      report += `\n*... and ${withFriendlyNamesOnly.length - 50} more entities*\n`;
    }
  }

  return report;
}

async function main() {
  console.log("Fetching Home Assistant aliases...\n");

  try {
    console.log("Fetching entity states...");
    const states = await fetchStates();
    console.log(`✓ Found ${states.length} entities\n`);

    console.log("Fetching entity registry...");
    const entityRegistry = await fetchEntityRegistry();
    console.log(`✓ Found ${entityRegistry.length} registry entries\n`);

    console.log("Extracting aliases...");
    const { entitiesWithAliases, aliasCount, byDomain } = extractAliases(states, entityRegistry);
    console.log(`✓ Found ${entitiesWithAliases.length} entities with aliases\n`);
    console.log(`✓ Total aliases: ${aliasCount}\n`);

    const report = formatReport(entitiesWithAliases, aliasCount, byDomain);

    const reportPath = "home_assistant_aliases_report.md";
    await Bun.write(reportPath, report);
    console.log(`\n✅ Report complete! Saved to: ${reportPath}\n`);

    // Print summary to console
    console.log("=== ALIASES SUMMARY ===");
    console.log(`Entities with aliases: ${entitiesWithAliases.length}`);
    console.log(`Total aliases: ${aliasCount}`);
    console.log(`\nTop domains with aliases:`);
    
    const topDomains = Object.entries(byDomain)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 10);
    
    for (const [domain, domainEntities] of topDomains) {
      const totalAliases = domainEntities.reduce((sum, e) => sum + e.aliases.length, 0);
      console.log(`  ${domain}: ${domainEntities.length} entities, ${totalAliases} aliases`);
    }

    // Show entities with explicit aliases
    const withExplicitAliases = entitiesWithAliases.filter(e => e.aliases.length > 0);
    if (withExplicitAliases.length > 0) {
      console.log(`\nEntities with explicit aliases (${withExplicitAliases.length}):`);
      for (const entity of withExplicitAliases.slice(0, 10)) {
        console.log(`  - ${entity.friendly_name} (${entity.entity_id}): ${entity.aliases.join(', ')}`);
      }
      if (withExplicitAliases.length > 10) {
        console.log(`  ... and ${withExplicitAliases.length - 10} more`);
      }
    } else {
      console.log(`\nNo entities with explicit aliases found. All aliases are inferred from friendly names.`);
    }

  } catch (error) {
    console.error("Error during analysis:", error);
    process.exit(1);
  }
}

main();


