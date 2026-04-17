# Aqara P100 Multi-State Sensor — Zigbee2MQTT External Converter

An external converter for the [Aqara P100 Multi-State Sensor](https://www.aqara.com/en/product/multi-state-sensor-p100/), reverse-engineered from Zigbee packet captures.

- **Zigbee model:** `lumi.vibration.agl002`
- **Aqara model:** `DWZTCGQ11LM`

## Installation

1. In Zigbee2MQTT go to **Settings > Dev Console > External Converters**
2. Select **Create new converter**
3. Name it `p100.mjs`
4. Paste in the code
5. Click **Save**
6. Restart Zigbee2MQTT

## Pairing the device

1. In Zigbee2MQTT click **Permit join** in the side menu
2. Hold the button on the P100 for 5 seconds
3. The LED will flash blue several time them pulse purple
4. It should be recognised in Z2M and have a cyan coloured label "**Supported: external**"

## Operating Modes

The P100 has **two mutually-exclusive operating modes** set via `device_mode`:

| Mode | Purpose | Active exposures |
| --- | --- | --- |
| `object` | Watches an object for movement, vibration, tilt, tap, orientation, fall | `action`, `orientation` |
| `door_window` | Reports a door/window as open/closed using internal motion inference | `contact` |

The event-enable toggles (`movement_detection`, `vibration_detection`, etc.) and `door_window_type` only have effect in their respective modes.

## Exposures

### Events (object mode)

| Exposure | Values | Notes |
| --- | --- | --- |
| `action` | `triple_tap`, `movement`, `vibration`, `orientation`, `fall` | Published momentarily on each detected event |
| `orientation` | `face_up`, `face_down`, `vertical`, `tilt` | Last reported orientation; meaningful when `action = orientation` |

### Contact (door/window mode)

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

### Diagnostics

| Exposure | Values | Notes |
| --- | --- | --- |
| `battery` | 0–100 % | From the Aqara bundled buffer (attribute 0x00f7, TLV field 0x18) |
| `voltage` | mV | From the same buffer (TLV field 0x17) |
| `device_posture` | `normal`, `abnormal` | Mounting orientation check — `abnormal` when installed incorrectly or needs calibration |
