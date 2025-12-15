# Stale Entities Analysis

**Generated:** 2025-11-11T05:02:53.660Z
**Stale Threshold:** 7 days

## Summary

- **Total Stale Entities:** 883
- **Oldest Stale Entity:** File editor Update (12 days old, last updated: 2025-10-29)

### Stale Entities by Domain

| Domain | Count |
|--------|-------|
| sensor | 534 |
| automation | 69 |
| binary_sensor | 60 |
| update | 53 |
| script | 41 |
| todo | 19 |
| input_number | 16 |
| switch | 12 |
| input_button | 11 |
| device_tracker | 7 |
| input_boolean | 6 |
| alarm_control_panel | 6 |
| scene | 5 |
| calendar | 5 |
| tag | 4 |
| conversation | 3 |
| group | 3 |
| stt | 3 |
| tts | 3 |
| input_text | 3 |
| input_datetime | 3 |
| number | 3 |
| media_player | 3 |
| select | 3 |
| input_select | 2 |
| ai_task | 2 |
| light | 2 |
| notify | 1 |
| remote | 1 |

---

## Stale Entities by Issue Type

### Sensor not updating - check battery/connectivity

**Count:** 555

| Entity ID | Friendly Name | Domain | Days Stale | State |
|-----------|---------------|--------|------------|-------|
| `sensor.chatgpt_response` | ChatGPT Response | sensor | 12 | Hello! How can I assist you today? |
| `sensor.presence_combined_state` | Combined Presence State | sensor | 10 | false |
| `binary_sensor.stock_room_motion_status` | Stock Room Motion Status | binary_sensor | 12 | off |
| `binary_sensor.kitchen_motion_status` | Kitchen Motion Status | binary_sensor | 12 | off |
| `binary_sensor.workshop_motion_status` | Workshop Motion Status | binary_sensor | 12 | off |
| `binary_sensor.office_motion_status` | Office Motion Status | binary_sensor | 12 | off |
| `binary_sensor.main_bedroom_motion_status` | Main Bedroom Motion Status | binary_sensor | 12 | off |
| `binary_sensor.kitchen_door_status` | Kitchen Door Status | binary_sensor | 12 | off |
| `binary_sensor.front_door_status` | Front Door Status | binary_sensor | 12 | off |
| `binary_sensor.workshop_door_status` | Workshop Door Status | binary_sensor | 12 | off |
| `binary_sensor.weight_scale_reading_status` | Weight Scale Reading Status | binary_sensor | 12 | off |
| `sensor.weight_reading` | Weight Reading | sensor | 12 | 1.15 |
| `sensor.geyserwise_current_temperature` | Geyserwise Current Temperature | sensor | 12 | 25.0 |
| `binary_sensor.jacquess_macbook_pro_camera_in_use` | Jacques’s MacBook Pro Camera In Use | binary_sensor | 12 | off |
| `binary_sensor.jacquess_macbook_pro_audio_input_in_use` | Jacques’s MacBook Pro Audio Input In Use | binary_sensor | 12 | off |
| `binary_sensor.jacquess_macbook_pro_audio_output_in_use` | Jacques’s MacBook Pro Audio Output In Use | binary_sensor | 12 | off |
| `binary_sensor.jacquess_macbook_pro_active` | Jacques’s MacBook Pro Active | binary_sensor | 12 | off |
| `binary_sensor.jacquess_macbook_pro_focus` | Jacques’s MacBook Pro Focus | binary_sensor | 12 | on |
| `sensor.jacquess_macbook_pro_internal_battery_level` | Jacques’s MacBook Pro Internal Battery Level | sensor | 12 | 100 |
| `sensor.jacquess_macbook_pro_internal_battery_state` | Jacques’s MacBook Pro Internal Battery State | sensor | 12 | Full |

*... and 535 more entities in this category*

### Device not updating - investigate connectivity

**Count:** 175

| Entity ID | Friendly Name | Domain | Days Stale | State |
|-----------|---------------|--------|------------|-------|
| `media_player.samsung_tv_2` | Samsung TV | media_player | 12 | off |
| `switch.tv_spotify_launcher` | Spotify | switch | 12 | off |
| `script.tv_launch_youtube` | Launch YouTube on TV | script | 12 | off |
| `script.tv_launch_spotify` | Launch Spotify on TV | script | 12 | off |
| `script.1687808543025` | Confirmable Notification Grid Off | script | 12 | off |
| `script.confirmable_notification_grid_on` | Confirmable Notification Grid On | script | 12 | off |
| `script.learn_ir_command` | Learn Aircon IR Command | script | 12 | off |
| `script.main_bedroom_light_temp` | Main Bedroom Light Temp | script | 12 | off |
| `script.main_bedroom_light_power` | Main Bedroom Light Power | script | 12 | off |
| `script.main_bedroom_light_brighter` | Main Bedroom Light Brighter | script | 12 | off |
| `script.main_bedroom_light_dimmer` | Main Bedroom Light Dimmer | script | 12 | off |
| `script.main_bedroom_light_bedtime_mode` | Main Bedroom Light Bedtime Mode | script | 12 | off |
| `script.main_bedroom_light_timer` | Main Bedroom Light Timer | script | 12 | off |
| `script.aircon_power` | Aircon Power On | script | 12 | off |
| `script.aircon_power_off` | Aircon Power Off | script | 12 | off |
| `script.aircon_temperature_on_20` | Aircon Temperature On 20 | script | 12 | off |
| `script.aircon_power_swing` | Aircon Power Swing | script | 12 | off |
| `script.aircon_power_fan_mode` | Aircon Power Fan Mode | script | 12 | off |
| `script.print_entities_to_file` | Print Entities To File | script | 12 | off |
| `script.parse_chatgpt_response` | Parse ChatGPT Response | script | 12 | off |

*... and 155 more entities in this category*

### Update entity - may be waiting for manual update

**Count:** 53

| Entity ID | Friendly Name | Domain | Days Stale | State |
|-----------|---------------|--------|------------|-------|
| `update.file_editor_update` | File editor Update | update | 12 | off |
| `update.dhcp_server_update` | DHCP server [deprecated] Update | update | 12 | off |
| `update.terminal_ssh_update` | Terminal & SSH Update | update | 12 | off |
| `update.home_panel_update` | Home Panel Update | update | 12 | off |
| `update.whisper_update` | Whisper Update | update | 12 | off |
| `update.piper_update` | Piper Update | update | 12 | off |
| `update.lxp_bridge_update` | lxp-bridge Update | update | 12 | off |
| `update.anylist_update` | Anylist Update | update | 12 | off |
| `update.home_assistant_google_drive_backup_update` | Home Assistant Google Drive Backup Update | update | 12 | off |
| `update.studio_code_server_update` | Studio Code Server Update | update | 12 | off |
| `update.paradox_alarm_interface_development_version_update` | Paradox Alarm Interface (Development version) Update | update | 12 | off |
| `update.silicon_labs_multiprotocol_update` | Silicon Labs Multiprotocol Update | update | 12 | off |
| `update.get_hacs_update` | Get HACS Update | update | 12 | off |
| `update.spotify_connect_update` | Spotify Connect Update | update | 12 | off |
| `update.mini_graph_card_update` | mini-graph-card update | update | 12 | off |
| `update.vertical_stack_in_card_update` | Vertical Stack In Card update | update | 12 | off |
| `update.solarman_update` | Solarman update | update | 12 | off |
| `update.extended_openai_conversation_update` | extended_openai_conversation update | update | 12 | off |
| `update.aqua_temp_update` | Aqua Temp update | update | 12 | off |
| `update.solarman_integration_update` | Solarman Integration update | update | 12 | off |

*... and 33 more entities in this category*

### State unknown - device may be disconnected

**Count:** 42

| Entity ID | Friendly Name | Domain | Days Stale | State |
|-----------|---------------|--------|------------|-------|
| `binary_sensor.s23_ultra_work_profile` | S23 Ultra Work profile | binary_sensor | 12 | unknown |
| `binary_sensor.s23_ultra_high_accuracy_mode` | S23 Ultra High accuracy mode | binary_sensor | 12 | unknown |
| `sensor.s23_ultra_high_accuracy_update_interval` | S23 Ultra High accuracy update interval | sensor | 12 | unknown |
| `sensor.s23_ultra_last_notification` | S23 Ultra Last notification | sensor | 12 | unknown |
| `sensor.s23_ultra_last_removed_notification` | S23 Ultra Last removed notification | sensor | 12 | unknown |
| `ai_task.openai_ai_task` | OpenAI AI Task | ai_task | 12 | unknown |
| `ai_task.google_ai_task` | Google AI Task | ai_task | 12 | unknown |
| `notify.entity_log` | entity_log | notify | 12 | unknown |
| `binary_sensor.sunlec_presence` | Sunlec - Presence | binary_sensor | 12 | unknown |
| `sensor.house_levy_heatpump_compressor_o01` | House Levy Heatpump Compressor [O01] | sensor | 12 | unknown |
| `sensor.house_levy_heatpump_high_fan_o02` | House Levy Heatpump High fan [O02] | sensor | 12 | unknown |
| `sensor.house_levy_heatpump_low_fan_o03` | House Levy Heatpump Low fan [O03] | sensor | 12 | unknown |
| `sensor.house_levy_heatpump_circulate_pump_o04` | House Levy Heatpump Circulate pump [O04] | sensor | 12 | unknown |
| `sensor.house_levy_heatpump_4_way_valve_o05` | House Levy Heatpump 4-way valve [O05] | sensor | 12 | unknown |
| `sensor.house_levy_heatpump_hp_switch_s01` | House Levy Heatpump HP switch [S01] | sensor | 12 | unknown |
| `sensor.house_levy_heatpump_lp_switch_s02` | House Levy Heatpump LP switch [S02] | sensor | 12 | unknown |
| `sensor.house_levy_heatpump_flow_switch_s03` | House Levy Heatpump Flow switch [S03] | sensor | 12 | unknown |
| `sensor.house_levy_heatpump_remote_switch_s04` | House Levy Heatpump Remote switch [S04] | sensor | 12 | unknown |
| `sensor.house_levy_heatpump_mode_switch_s05` | House Levy Heatpump Mode switch [S05] | sensor | 12 | unknown |
| `sensor.house_levy_heatpump_master_slave_switch_s06` | House Levy Heatpump Master/Slave switch [S06] | sensor | 12 | unknown |

*... and 22 more entities in this category*

### Input helper - manually controlled, may be intentional

**Count:** 41

| Entity ID | Friendly Name | Domain | Days Stale | State |
|-----------|---------------|--------|------------|-------|
| `input_select.pool_pump_and_geyser_control` | Pool Pump and Geyser Control | input_select | 12 | Disable Pool Pump, Enable Geyser Heating |
| `input_select.pool_pump_and_geyser_control_2` | Pool Pump and Geyser Control | input_select | 12 | Enable Pool Pump, Enable Geyser Heating |
| `input_boolean.geyser_override` | Geyser 24 Hour Override | input_boolean | 12 | off |
| `input_boolean.kitchen_occupied` | Kitchen Occupied Status | input_boolean | 12 | off |
| `input_boolean.trigger_youtube` | Trigger YouTube on TV | input_boolean | 12 | off |
| `input_text.chatgpt_input` | ChatGPT Input | input_text | 12 |  |
| `input_text.last_doctor_visit_reason` | Last Doctor Visit Reason | input_text | 12 | No recent visit |
| `input_text.washing_announcement` | Washing Announcement | input_text | 12 | The washing cycle has completed |
| `input_button.bedroom_light_colour_temperature` | Bedroom Light Colour Temperature  | input_button | 12 | 2023-12-20T19:33:19.226131+00:00 |
| `input_button.bedroom_light_night_mode` | Bedroom Light Night Mode | input_button | 12 | 2023-12-07T23:15:19.804988+00:00 |
| `input_button.bedroom_light_brightness_up` | Bedroom Light Brightness Up | input_button | 12 | 2023-12-07T23:15:02.740156+00:00 |
| `input_button.bedroom_light_brightness_down` | Bedroom Light Brightness Down | input_button | 12 | 2023-12-20T19:33:17.448751+00:00 |
| `input_button.stop_irrigation` | Stop Irrigation | input_button | 12 | unknown |
| `input_button.enable_irrigation_schedule` | Enable Irrigation Schedule | input_button | 12 | 2023-12-10T08:17:59.913253+00:00 |
| `input_button.disable_irrigation_schedule` | Disable Irrigation Schedule | input_button | 12 | unknown |
| `input_button.run_irrigation_cycle_now` | Run Irrigation Cycle now | input_button | 12 | unknown |
| `input_button.stop_irrigation_cycle_now` | Stop Irrigation Cycle Now | input_button | 12 | unknown |
| `input_button.hosepipe_manual_trigger` | Hosepipe Manual Trigger | input_button | 12 | 2025-03-03T17:37:39.831071+00:00 |
| `input_button.sonos_sleep_timer` | Sonos Sleep Timer | input_button | 12 | 2024-08-02T08:41:29.452497+00:00 |
| `input_number.last_recorded_weight` | Last Recorded Weight | input_number | 12 | 1.15 |

*... and 21 more entities in this category*

### AI/Conversation entity - only updates on use

**Count:** 9

| Entity ID | Friendly Name | Domain | Days Stale | State |
|-----------|---------------|--------|------------|-------|
| `conversation.home_assistant` | Home Assistant | conversation | 12 | 2025-06-22T22:31:54.747975+00:00 |
| `stt.home_assistant_cloud` | Home Assistant Cloud | stt | 12 | unknown |
| `tts.home_assistant_cloud` | Home Assistant Cloud | tts | 12 | 2024-07-31T20:11:17.090771+00:00 |
| `conversation.openai_conversation_2` | OpenAI Conversation | conversation | 12 | 2025-04-03T04:29:50.635927+00:00 |
| `conversation.google_generative_ai` | Google Generative AI | conversation | 12 | 2025-05-08T01:59:44.097592+00:00 |
| `stt.google_ai_stt` | Google AI STT | stt | 12 | unknown |
| `tts.google_ai_tts` | Google AI TTS | tts | 12 | 2025-10-26T17:47:11.377683+00:00 |
| `tts.piper` | piper | tts | 12 | 2024-07-31T20:09:55.799970+00:00 |
| `stt.faster_whisper` | faster-whisper | stt | 12 | unknown |

### Scene - only updates when activated

**Count:** 5

| Entity ID | Friendly Name | Domain | Days Stale | State |
|-----------|---------------|--------|------------|-------|
| `scene.new_scene` | Bed Time | scene | 12 | 2025-01-06T20:58:00.223804+00:00 |
| `scene.sleep_2` | Sleep | scene | 12 | 2025-01-11T21:06:34.667156+00:00 |
| `scene.backyard_lights` | Backyard Lights | scene | 10 | 2025-11-01T03:32:00.127948+00:00 |
| `scene.keep_guest_geyser_on` | Keep Guest geyser on | scene | 12 | unknown |
| `scene.keep_guestroom_geyser_on` | Keep Guestroom Geyser On | scene | 12 | unknown |

### Group entity - aggregates other entities

**Count:** 3

| Entity ID | Friendly Name | Domain | Days Stale | State |
|-----------|---------------|--------|------------|-------|
| `group.all_switches` | All Switches | group | 12 | on |
| `group.all_lights` | All Lights | group | 12 | unknown |
| `group.presence_monitoring` | Presence Monitoring | group | 10 | off |


---

## Detailed Stale Entities List

### Top 50 Oldest Stale Entities

| Entity ID | Friendly Name | Domain | Days Stale | Last Updated | State | Issue |
|-----------|---------------|--------|------------|--------------|-------|------|
| `update.file_editor_update` | File editor Update | update | 12 | 2025-10-29 | off | Update entity - may be waiting for manual update |
| `update.dhcp_server_update` | DHCP server [deprecated] Update | update | 12 | 2025-10-29 | off | Update entity - may be waiting for manual update |
| `update.terminal_ssh_update` | Terminal & SSH Update | update | 12 | 2025-10-29 | off | Update entity - may be waiting for manual update |
| `update.home_panel_update` | Home Panel Update | update | 12 | 2025-10-29 | off | Update entity - may be waiting for manual update |
| `update.whisper_update` | Whisper Update | update | 12 | 2025-10-29 | off | Update entity - may be waiting for manual update |
| `update.piper_update` | Piper Update | update | 12 | 2025-10-29 | off | Update entity - may be waiting for manual update |
| `update.lxp_bridge_update` | lxp-bridge Update | update | 12 | 2025-10-29 | off | Update entity - may be waiting for manual update |
| `update.anylist_update` | Anylist Update | update | 12 | 2025-10-29 | off | Update entity - may be waiting for manual update |
| `update.home_assistant_google_drive_backup_update` | Home Assistant Google Drive Backup Update | update | 12 | 2025-10-29 | off | Update entity - may be waiting for manual update |
| `update.studio_code_server_update` | Studio Code Server Update | update | 12 | 2025-10-29 | off | Update entity - may be waiting for manual update |
| `update.paradox_alarm_interface_development_version_update` | Paradox Alarm Interface (Development version) Update | update | 12 | 2025-10-29 | off | Update entity - may be waiting for manual update |
| `update.silicon_labs_multiprotocol_update` | Silicon Labs Multiprotocol Update | update | 12 | 2025-10-29 | off | Update entity - may be waiting for manual update |
| `update.get_hacs_update` | Get HACS Update | update | 12 | 2025-10-29 | off | Update entity - may be waiting for manual update |
| `update.spotify_connect_update` | Spotify Connect Update | update | 12 | 2025-10-29 | off | Update entity - may be waiting for manual update |
| `conversation.home_assistant` | Home Assistant | conversation | 12 | 2025-10-29 | 2025-06-22T22:31:54.747975+00:00 | AI/Conversation entity - only updates on use |
| `group.all_lights` | All Lights | group | 12 | 2025-10-29 | unknown | Group entity - aggregates other entities |
| `sensor.chatgpt_response` | ChatGPT Response | sensor | 12 | 2025-10-29 | Hello! How can I assist you today? | Sensor not updating - check battery/connectivity |
| `sensor.weight_reading` | Weight Reading | sensor | 12 | 2025-10-29 | 1.15 | Sensor not updating - check battery/connectivity |
| `sensor.geyserwise_current_temperature` | Geyserwise Current Temperature | sensor | 12 | 2025-10-29 | 25.0 | Sensor not updating - check battery/connectivity |
| `stt.home_assistant_cloud` | Home Assistant Cloud | stt | 12 | 2025-10-29 | unknown | AI/Conversation entity - only updates on use |
| `tts.home_assistant_cloud` | Home Assistant Cloud | tts | 12 | 2025-10-29 | 2024-07-31T20:11:17.090771+00:00 | AI/Conversation entity - only updates on use |
| `scene.new_scene` | Bed Time | scene | 12 | 2025-10-29 | 2025-01-06T20:58:00.223804+00:00 | Scene - only updates when activated |
| `scene.sleep_2` | Sleep | scene | 12 | 2025-10-29 | 2025-01-11T21:06:34.667156+00:00 | Scene - only updates when activated |
| `input_select.pool_pump_and_geyser_control` | Pool Pump and Geyser Control | input_select | 12 | 2025-10-29 | Disable Pool Pump, Enable Geyser Heating | Input helper - manually controlled, may be intentional |
| `input_select.pool_pump_and_geyser_control_2` | Pool Pump and Geyser Control | input_select | 12 | 2025-10-29 | Enable Pool Pump, Enable Geyser Heating | Input helper - manually controlled, may be intentional |
| `input_boolean.geyser_override` | Geyser 24 Hour Override | input_boolean | 12 | 2025-10-29 | off | Input helper - manually controlled, may be intentional |
| `input_boolean.trigger_youtube` | Trigger YouTube on TV | input_boolean | 12 | 2025-10-29 | off | Input helper - manually controlled, may be intentional |
| `input_text.chatgpt_input` | ChatGPT Input | input_text | 12 | 2025-10-29 |  | Input helper - manually controlled, may be intentional |
| `input_text.last_doctor_visit_reason` | Last Doctor Visit Reason | input_text | 12 | 2025-10-29 | No recent visit | Input helper - manually controlled, may be intentional |
| `input_text.washing_announcement` | Washing Announcement | input_text | 12 | 2025-10-29 | The washing cycle has completed | Input helper - manually controlled, may be intentional |
| `input_button.bedroom_light_colour_temperature` | Bedroom Light Colour Temperature  | input_button | 12 | 2025-10-29 | 2023-12-20T19:33:19.226131+00:00 | Input helper - manually controlled, may be intentional |
| `input_button.bedroom_light_night_mode` | Bedroom Light Night Mode | input_button | 12 | 2025-10-29 | 2023-12-07T23:15:19.804988+00:00 | Input helper - manually controlled, may be intentional |
| `input_button.bedroom_light_brightness_up` | Bedroom Light Brightness Up | input_button | 12 | 2025-10-29 | 2023-12-07T23:15:02.740156+00:00 | Input helper - manually controlled, may be intentional |
| `input_button.bedroom_light_brightness_down` | Bedroom Light Brightness Down | input_button | 12 | 2025-10-29 | 2023-12-20T19:33:17.448751+00:00 | Input helper - manually controlled, may be intentional |
| `input_button.stop_irrigation` | Stop Irrigation | input_button | 12 | 2025-10-29 | unknown | Input helper - manually controlled, may be intentional |
| `input_button.enable_irrigation_schedule` | Enable Irrigation Schedule | input_button | 12 | 2025-10-29 | 2023-12-10T08:17:59.913253+00:00 | Input helper - manually controlled, may be intentional |
| `input_button.disable_irrigation_schedule` | Disable Irrigation Schedule | input_button | 12 | 2025-10-29 | unknown | Input helper - manually controlled, may be intentional |
| `input_button.run_irrigation_cycle_now` | Run Irrigation Cycle now | input_button | 12 | 2025-10-29 | unknown | Input helper - manually controlled, may be intentional |
| `input_button.stop_irrigation_cycle_now` | Stop Irrigation Cycle Now | input_button | 12 | 2025-10-29 | unknown | Input helper - manually controlled, may be intentional |
| `input_button.hosepipe_manual_trigger` | Hosepipe Manual Trigger | input_button | 12 | 2025-10-29 | 2025-03-03T17:37:39.831071+00:00 | Input helper - manually controlled, may be intentional |
| `input_button.sonos_sleep_timer` | Sonos Sleep Timer | input_button | 12 | 2025-10-29 | 2024-08-02T08:41:29.452497+00:00 | Input helper - manually controlled, may be intentional |
| `input_number.last_recorded_weight` | Last Recorded Weight | input_number | 12 | 2025-10-29 | 1.15 | Input helper - manually controlled, may be intentional |
| `input_number.geyser_temperature_threshold` | Geyser Temperature Threshold | input_number | 12 | 2025-10-29 | 30.0 | Input helper - manually controlled, may be intentional |
| `input_number.irrigation_station_1` | Station 1 Run Time | input_number | 12 | 2025-10-29 | 15.0 | Input helper - manually controlled, may be intentional |
| `input_number.irrigation_station_2` | Station 2 Run Time | input_number | 12 | 2025-10-29 | 15.0 | Input helper - manually controlled, may be intentional |
| `input_number.irrigation_station_3` | Station 3 Run Time | input_number | 12 | 2025-10-29 | 15.0 | Input helper - manually controlled, may be intentional |
| `input_number.irrigation_station_4` | Station 4 Run Time | input_number | 12 | 2025-10-29 | 0.0 | Input helper - manually controlled, may be intentional |
| `input_number.irrigation_station_5` | Station 5 Run Time | input_number | 12 | 2025-10-29 | 30.0 | Input helper - manually controlled, may be intentional |
| `input_number.irrigation_station_6` | Station 6 Run Time | input_number | 12 | 2025-10-29 | 0.0 | Input helper - manually controlled, may be intentional |
| `input_number.wellpoint_runtime` | WellPoint Run Time | input_number | 12 | 2025-10-29 | 1.0 | Input helper - manually controlled, may be intentional |

*... and 833 more stale entities*
