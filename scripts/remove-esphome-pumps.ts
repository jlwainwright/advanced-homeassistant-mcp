#!/usr/bin/env bun
/**
 * Remove ESPHome Well Pump and JoJo Pump Devices
 * These have been replaced with Sonoff eWeLink devices
 */

import { APP_CONFIG } from "../src/config/app.config.js";

interface Integration {
  entry_id: string;
  domain: string;
  title: string;
  source: string;
  state: string;
}

const ESPHOME_DEVICES_TO_REMOVE = [
  {
    entry_id: "18266acb665b2894a454f87625f01676",
    title: "WellPump",
    reason: "Replaced with Sonoff eWeLink device"
  },
  {
    entry_id: "01JGKWR7TGDSMXYTJEBBAXJHCB",
    title: "WellPointPump",
    reason: "Replaced with Sonoff eWeLink device"
  },
  {
    entry_id: "01JGM44C7GM13SCFQF874478WR",
    title: "jojopump",
    reason: "Replaced with Sonoff eWeLink device"
  }
];

async function fetchIntegrations(): Promise<Integration[]> {
  const response = await fetch(`${APP_CONFIG.HASS_HOST}/api/config/config_entries/entry`, {
    headers: {
      Authorization: `Bearer ${APP_CONFIG.HASS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch integrations: ${response.statusText}`);
  }

  return response.json();
}

async function removeIntegration(entryId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${APP_CONFIG.HASS_HOST}/api/config/config_entries/entry/${entryId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${APP_CONFIG.HASS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error(`Error removing integration ${entryId}:`, error);
    return false;
  }
}

async function backupEntities(): Promise<void> {
  const response = await fetch(`${APP_CONFIG.HASS_HOST}/api/states`, {
    headers: {
      Authorization: `Bearer ${APP_CONFIG.HASS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch states: ${response.statusText}`);
  }

  const states = await response.json();
  
  // Filter entities from devices to be removed
  const entitiesToBackup = states.filter((s: any) => 
    s.entity_id.includes('wellpump') || 
    s.entity_id.includes('wellpoint') || 
    s.entity_id.includes('jojopump')
  );

  const backup = {
    timestamp: new Date().toISOString(),
    entities: entitiesToBackup,
    devices: ESPHOME_DEVICES_TO_REMOVE
  };

  const backupPath = `backups/esphome-pumps-removal-${Date.now()}.json`;
  await Bun.write(backupPath, JSON.stringify(backup, null, 2));
  console.log(`✓ Backup created: ${backupPath}`);
}

async function main() {
  console.log("ESPHome Pump Removal Script\n");
  console.log("Devices to remove:");
  ESPHOME_DEVICES_TO_REMOVE.forEach(d => {
    console.log(`  - ${d.title} (${d.entry_id})`);
  });

  // Check if running in dry-run mode
  const dryRun = process.argv.includes('--dry-run');
  if (dryRun) {
    console.log("\n🔍 DRY-RUN MODE - No changes will be made\n");
  }

  try {
    // Step 1: Backup
    console.log("Step 1: Creating backup...");
    await backupEntities();

    // Step 2: Verify integrations exist
    console.log("\nStep 2: Verifying integrations...");
    const integrations = await fetchIntegrations();
    
    const integrationsToRemove = ESPHOME_DEVICES_TO_REMOVE.map(device => {
      const integration = integrations.find(i => i.entry_id === device.entry_id);
      return { ...device, integration };
    });

    for (const item of integrationsToRemove) {
      if (item.integration) {
        console.log(`  ✓ Found: ${item.title} (${item.integration.state})`);
      } else {
        console.log(`  ⚠ Not found: ${item.title} - may already be removed`);
      }
    }

    // Step 3: Remove integrations
    if (!dryRun) {
      console.log("\nStep 3: Removing integrations...");
      for (const item of integrationsToRemove) {
        if (item.integration) {
          console.log(`  Removing ${item.title}...`);
          const success = await removeIntegration(item.entry_id);
          if (success) {
            console.log(`    ✓ Successfully removed ${item.title}`);
          } else {
            console.log(`    ✗ Failed to remove ${item.title}`);
          }
        }
      }
    } else {
      console.log("\nStep 3: Would remove integrations (dry-run mode)");
    }

    console.log("\n✅ Process complete!");
    
    if (!dryRun) {
      console.log("\nNext steps:");
      console.log("1. Update aliases in ~/.zshrc to point to new Sonoff devices");
      console.log("2. Verify automations still work correctly");
      console.log("3. Check that no entities are broken");
    }

  } catch (error) {
    console.error("Error during removal:", error);
    process.exit(1);
  }
}

main();


