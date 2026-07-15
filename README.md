# Aqara Multi-State Sensor P100 — Zigbee2MQTT External Converter

A Zigbee2MQTT external converter for the [Aqara Multi-State Sensor P100](https://www.aqara.com/en/product/multi-state-sensor-p100/), reverse-engineered from Zigbee packet captures.

- **Zigbee model:** `lumi.vibration.agl002`
- **Aqara model:** `DWZTCGQ11LM

## Requirements

- Aqara Multi-State Sensor with Zigbee firmware 0.0.0_0024 installed
- Zigbee2MQTT v2.9.2+

## Installation

1. In Zigbee2MQTT go to **Settings > Dev Console > External Converters**
2. Select **Create new converter**
3. Name it `p100.mjs`
4. Paste in the code
5. Click **Save**
6. Make sure you have events enabled in the Z2M HA integration settings
7. Restart Zigbee2MQTT

## Pairing the device

1. In Zigbee2MQTT click **Permit join** in the side menu
2. Hold the button on the P100 for 5 seconds
3. The LED will flash blue several time them pulse purple
4. It should be recognised in Z2M and have a cyan coloured label "**Supported: external**"
5. Calibrate the device according to the [user manual](https://store-support.aqara.com/products/multi-state-sensor-p100)

## Operating Modes

The P100 has **two mutually-exclusive operating modes** set via `device_mode`:

| Mode | Purpose | Active exposures |
| --- | --- | --- |
| `object` | Watches an object for movement, vibration, tilt, tap, orientation, fall | `action`, `orientation` |
| `door_window` | Reports a door/window as open/closed using internal motion inference | `contact` |

The event-enable toggles (`movement_detection`, `vibration_detection`, etc.) and `door_window_type` only have effect in their respective modes.

## Exposures

**Note: In door/window mode movement/vibration/orientation etc are NOT reported**

### Events (**object mode only**)

| Exposure | Values | Notes |
| --- | --- | --- |
| `action` | `triple_tap`, `movement`, `vibration`, `orientation`, `fall`, `static` | Published momentarily on each detected event |
| `orientation` | `face_up`, `face_down`, `vertical`, `tilt` | Last reported orientation; meaningful when `action = orientation` |
| `initial_tilt_angle` | ° | Start angle of tilt |
| `stationary_tilt_angle` | ° | End angle of tilt |
| `tilt_angle_deviation` | ° | Change in angle of tilt |
| `vibration_duration` | s | Duration of vibration event |
| `motion_duration` | s | Duration of motion event |

### Contact (**door/window mode only**)

| Exposure | Values | Notes |
| --- | --- | --- |
| `contact` | `true` (closed) / `false` (open) | Derived internally by the device from its motion sensors — not an IAS contact sensor |

### Settings

| Exposure | Type | Range / Values | Description |
| --- | --- | --- | --- |
| `device_mode` | enum | `door_window`, `object` | Operating mode (see above) |
| `door_window_type` | enum | `casement_window`, `hopper_window`, `composite_window`, `hinged_door` | Door/window profile (only relevant in door/window mode) |
| `motion_sensitivity` | numeric | 1–10 | Detection sensitivity (1 = low, 10 = high) |
| `report_interval` | numeric | 5–300 seconds | How often the device reports state |
| `orientation_detection` | binary | ON / OFF | Enable orientation event reporting (object mode) |
| `movement_detection` | binary | ON / OFF | Enable movement event reporting (object mode) |
| `fall_detection` | binary | ON / OFF | Enable fall event reporting (object mode) |
| `vibration_detection` | binary | ON / OFF | Enable vibration event reporting (object mode) |
| `triple_tap_detection` | binary | ON / OFF | Enable triple-tap event reporting (object mode) |
| `remote_calibration` | button | `Calibrate` | Triggers the device's remote calibration routine |

*Note: Changing the settings of the sensor requires an on-device button press*

### Diagnostics

| Exposure | Values | Notes |
| --- | --- | --- |
| `battery` | 0–100 % | From the Aqara bundled buffer (attribute 0x00f7, TLV field 0x18) |
| `voltage` | mV | From the same buffer (TLV field 0x17) |
| `device_posture` | `normal`, `abnormal` | Mounting orientation check for door/window installtion — `abnormal` when installed incorrectly or needs calibration |
