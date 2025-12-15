# Home Assistant Device and Integration Audit Report

**Generated:** 2025-11-11T04:49:39.821Z
**Audit Period:** Last 7 days (2025-11-04 to 2025-11-11)

## Executive Summary

- **Total Devices:** 2271
- **Active Devices:** 674
- **Stale/Inactive Devices:** 883
- **Total Automations:** 95
- **Active Automations:** 67
- **Total Integrations:** 131

---

## 1. Stale/Inactive Devices

*Devices that have not been updated in more than 7 days*

| Entity ID | Friendly Name | Last Updated | Current State | Domain |
|-----------|---------------|---------------|---------------|--------|
| `update.file_editor_update` | File editor Update | 2025-10-29 | off | update |
| `update.dhcp_server_update` | DHCP server [deprecated] Update | 2025-10-29 | off | update |
| `update.terminal_ssh_update` | Terminal & SSH Update | 2025-10-29 | off | update |
| `update.home_panel_update` | Home Panel Update | 2025-10-29 | off | update |
| `update.whisper_update` | Whisper Update | 2025-10-29 | off | update |
| `update.piper_update` | Piper Update | 2025-10-29 | off | update |
| `update.lxp_bridge_update` | lxp-bridge Update | 2025-10-29 | off | update |
| `update.anylist_update` | Anylist Update | 2025-10-29 | off | update |
| `update.home_assistant_google_drive_backup_update` | Home Assistant Google Drive Backup Update | 2025-10-29 | off | update |
| `update.studio_code_server_update` | Studio Code Server Update | 2025-10-29 | off | update |
| `update.paradox_alarm_interface_development_version_update` | Paradox Alarm Interface (Development version) Update | 2025-10-29 | off | update |
| `update.silicon_labs_multiprotocol_update` | Silicon Labs Multiprotocol Update | 2025-10-29 | off | update |
| `update.get_hacs_update` | Get HACS Update | 2025-10-29 | off | update |
| `update.spotify_connect_update` | Spotify Connect Update | 2025-10-29 | off | update |
| `conversation.home_assistant` | Home Assistant | 2025-10-29 | 2025-06-22T22:31:54.747975+00:00 | conversation |
| `group.all_lights` | All Lights | 2025-10-29 | unknown | group |
| `sensor.chatgpt_response` | ChatGPT Response | 2025-10-29 | Hello! How can I assist you today? | sensor |
| `sensor.weight_reading` | Weight Reading | 2025-10-29 | 1.15 | sensor |
| `sensor.geyserwise_current_temperature` | Geyserwise Current Temperature | 2025-10-29 | 25.0 | sensor |
| `stt.home_assistant_cloud` | Home Assistant Cloud | 2025-10-29 | unknown | stt |
| `tts.home_assistant_cloud` | Home Assistant Cloud | 2025-10-29 | 2024-07-31T20:11:17.090771+00:00 | tts |
| `scene.new_scene` | Bed Time | 2025-10-29 | 2025-01-06T20:58:00.223804+00:00 | scene |
| `scene.sleep_2` | Sleep | 2025-10-29 | 2025-01-11T21:06:34.667156+00:00 | scene |
| `input_select.pool_pump_and_geyser_control` | Pool Pump and Geyser Control | 2025-10-29 | Disable Pool Pump, Enable Geyser Heating | input_select |
| `input_select.pool_pump_and_geyser_control_2` | Pool Pump and Geyser Control | 2025-10-29 | Enable Pool Pump, Enable Geyser Heating | input_select |
| `input_boolean.geyser_override` | Geyser 24 Hour Override | 2025-10-29 | off | input_boolean |
| `input_boolean.trigger_youtube` | Trigger YouTube on TV | 2025-10-29 | off | input_boolean |
| `input_text.chatgpt_input` | ChatGPT Input | 2025-10-29 |  | input_text |
| `input_text.last_doctor_visit_reason` | Last Doctor Visit Reason | 2025-10-29 | No recent visit | input_text |
| `input_text.washing_announcement` | Washing Announcement | 2025-10-29 | The washing cycle has completed | input_text |
| `input_button.bedroom_light_colour_temperature` | Bedroom Light Colour Temperature  | 2025-10-29 | 2023-12-20T19:33:19.226131+00:00 | input_button |
| `input_button.bedroom_light_night_mode` | Bedroom Light Night Mode | 2025-10-29 | 2023-12-07T23:15:19.804988+00:00 | input_button |
| `input_button.bedroom_light_brightness_up` | Bedroom Light Brightness Up | 2025-10-29 | 2023-12-07T23:15:02.740156+00:00 | input_button |
| `input_button.bedroom_light_brightness_down` | Bedroom Light Brightness Down | 2025-10-29 | 2023-12-20T19:33:17.448751+00:00 | input_button |
| `input_button.stop_irrigation` | Stop Irrigation | 2025-10-29 | unknown | input_button |
| `input_button.enable_irrigation_schedule` | Enable Irrigation Schedule | 2025-10-29 | 2023-12-10T08:17:59.913253+00:00 | input_button |
| `input_button.disable_irrigation_schedule` | Disable Irrigation Schedule | 2025-10-29 | unknown | input_button |
| `input_button.run_irrigation_cycle_now` | Run Irrigation Cycle now | 2025-10-29 | unknown | input_button |
| `input_button.stop_irrigation_cycle_now` | Stop Irrigation Cycle Now | 2025-10-29 | unknown | input_button |
| `input_button.hosepipe_manual_trigger` | Hosepipe Manual Trigger | 2025-10-29 | 2025-03-03T17:37:39.831071+00:00 | input_button |
| `input_button.sonos_sleep_timer` | Sonos Sleep Timer | 2025-10-29 | 2024-08-02T08:41:29.452497+00:00 | input_button |
| `input_number.last_recorded_weight` | Last Recorded Weight | 2025-10-29 | 1.15 | input_number |
| `input_number.geyser_temperature_threshold` | Geyser Temperature Threshold | 2025-10-29 | 30.0 | input_number |
| `input_number.irrigation_station_1` | Station 1 Run Time | 2025-10-29 | 15.0 | input_number |
| `input_number.irrigation_station_2` | Station 2 Run Time | 2025-10-29 | 15.0 | input_number |
| `input_number.irrigation_station_3` | Station 3 Run Time | 2025-10-29 | 15.0 | input_number |
| `input_number.irrigation_station_4` | Station 4 Run Time | 2025-10-29 | 0.0 | input_number |
| `input_number.irrigation_station_5` | Station 5 Run Time | 2025-10-29 | 30.0 | input_number |
| `input_number.irrigation_station_6` | Station 6 Run Time | 2025-10-29 | 0.0 | input_number |
| `input_number.wellpoint_runtime` | WellPoint Run Time | 2025-10-29 | 1.0 | input_number |

*... and 833 more stale devices*

**Analysis:**
- Number of stale devices: 883
- Most common stale device types: sensor, automation, binary_sensor
- Oldest stale device: File editor Update (last updated: 2025-10-29)

---

## 2. Active Devices

### 2.1 Active Device Summary
- **Total Active Devices:** 674
- **Most Recently Updated:** MG5050 System Power Vdc (2025-11-11T04:49:35.826Z)

### 2.2 Top 10 Most Recently Updated Devices

| Entity ID | Friendly Name | Last Updated |
|-----------|---------------|--------------|
| `sensor.mg5050_system_power_vdc` | MG5050 System Power Vdc | 2025-11-11T04:49:35.826Z |
| `sensor.sonoff_bridgeb_sonoff_rf_bridge_wifi_signal` | Sonoff-BridgeB-Workshop Sonoff RF Bridge WiFi Signal | 2025-11-11T04:49:30.037Z |
| `sensor.esphome_web_0784ef_poolpump_voltage` | PoolPump Poolpump Voltage | 2025-11-11T04:49:26.331Z |
| `sensor.qbittorrent_all_time_download_2` | qBittorrent All-time download | 2025-11-11T04:49:19.036Z |
| `sensor.qbittorrent_all_time_upload_2` | qBittorrent All-time upload | 2025-11-11T04:49:19.036Z |
| `sensor.sunlec_123_1min` | Cameron Power Minute Average | 2025-11-11T04:49:18.894Z |
| `sensor.flat_1_1min` | To Inverter Power Minute Average | 2025-11-11T04:49:18.894Z |
| `sensor.pool_db_2_1min` | From Inverter Power Minute Average | 2025-11-11T04:49:18.894Z |
| `sensor.oven_3_1min` | Stove Power Minute Average | 2025-11-11T04:49:18.894Z |
| `sensor.geyser_4_1min` | Geyser 1 Power Minute Average | 2025-11-11T04:49:18.894Z |

---

## 3. Device Distribution by Domain

| Domain | Count |
|--------|-------|
| sensor | 1314 |
| binary_sensor | 213 |
| switch | 174 |
| automation | 95 |
| update | 87 |
| number | 54 |
| script | 44 |
| todo | 32 |
| camera | 31 |
| media_player | 20 |
| button | 20 |
| select | 19 |
| device_tracker | 19 |
| time | 18 |
| input_number | 16 |
| text | 12 |
| input_button | 11 |
| calendar | 10 |
| alarm_control_panel | 8 |
| input_boolean | 7 |
| climate | 7 |
| scene | 6 |
| light | 6 |
| remote | 6 |
| conversation | 4 |
| tag | 4 |
| group | 3 |
| stt | 3 |
| tts | 3 |
| input_text | 3 |
| input_datetime | 3 |
| person | 2 |
| input_select | 2 |
| vacuum | 2 |
| ai_task | 2 |
| event | 1 |
| schedule | 1 |
| notify | 1 |
| weather | 1 |

---

## 4. Automation Analysis

### 4.1 Automation Summary
- **Total Automations:** 95
- **Active Automations:** 67
- **Inactive Automations:** 28

### 4.2 Automation List

| Entity ID | Name | State | Last Triggered |
|-----------|------|-------|----------------|
| `automation.auto_launch_youtube_on_tv` | Auto Launch YouTube on TV | on | Never |
| `automation.guest_toilet_pir_motion` | Guest Toilet PIR Motion | on | 2025-10-03 |
| `automation.record_daily_weight` | Record Daily Weight | on | 2025-08-22 |
| `automation.tag_main_gate_is_scanned` | Open Main Gate When NFC TAG Gets Scanned | on | 2025-05-08 |
| `automation.turn_on_lights_when_jacques_gets_home` | Turn On Lights When Jacques Gets Home | on | 2025-11-10 |
| `automation.load_shedding_stage` | Load Shedding (Stage) | on | 2025-07-18 |
| `automation.load_shedding_warning` | Load Shedding (Warning) | on | 2025-02-22 |
| `automation.load_shedding_start_end` | Load Shedding (Start/End) | on | 2025-03-09 |
| `automation.laundry_earth_leakage_tripped` | Laundry Earth Leakage Tripped | on | 2025-10-25 |
| `automation.gate_remote_triggered` | Gate Remote Triggered | on | 2024-08-16 |
| `automation.turn_on_wendy_outside_light_at_sunset` | Manage Fence Post, Wendy & Garden Lights at Sunrise and Sunset | on | 2025-11-11 |
| `automation.new_automation` | Toggle Guest Toilet Light When Zigbee Button Is Pressed | on | Never |
| `automation.hold_to_switch_off_guest_toilet_fan_light` | Hold To Switch Off Guest Toilet Fan/Light | on | Never |
| `automation.solcast_update` | Solcast_update | on | 2025-11-11 |
| `automation.washing_cycle_has_completed` | Washing Cycle Has Completed - AI Announcement | off | 2024-07-31 |
| `automation.irrigation_controller_2` | Irrigation Controller | off | 2025-05-17 |
| `automation.change_bedroom_light_colour_temperature` | Change Bedroom Light Colour Temperature | on | 2023-12-20 |
| `automation.bedroom_light_night_mode` | Bedroom Light Night Mode | on | 2023-12-07 |
| `automation.bedroom_light_brightness_up` | Bedroom Light Brightness Up | on | 2023-12-07 |
| `automation.bedroom_light_brightness_down` | Bedroom Light Brightness Down | on | 2023-12-20 |

*... and 75 more automations*

---

## 6. Recommendations

- Review 883 stale devices that haven't updated in 7 days
- Check battery levels and connectivity for stale battery-powered devices
- Review 17 inactive automations - consider enabling or removing them
- Consider organizing update, media_player, sensor, binary_sensor, switch, camera, input_button, input_number, script, button, number, select, text, device_tracker, todo, automation, time devices into areas for better management

---

## 7. Technical Notes

### Data Collection Method
- Data source: Home Assistant REST API
- Collection timestamp: 2025-11-11T04:49:39.821Z
- Stale threshold: 7 days without updates

### Definitions
- **Stale Device**: Device/entity with last updated timestamp > 7 days ago
- **Active Device**: Device that is available and has been updated within the last 7 days
- **Inactive Automation**: Automation with state "off"

