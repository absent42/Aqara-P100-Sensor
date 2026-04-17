import * as lumi from "zigbee-herdsman-converters/lib/lumi";
import * as m from "zigbee-herdsman-converters/lib/modernExtend";

const {lumiModernExtend} = lumi;

export default {
    zigbeeModel: ["lumi.vibration.agl002"],
    model: "DWZTCGQ11LM",
    vendor: "Aqara",
    description: "P100 multi-state sensor",
    
    extend: [
        lumiModernExtend.addManuSpecificLumiCluster(),
        lumiModernExtend.lumiBattery({
            voltageAttribute: 0x17,
            percentageAtrribute: 0x18,
        }),
        lumiModernExtend.lumiZigbeeOTA(),

        m.enumLookup({
            name: "device_mode",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x0116, type: 0x20},
            lookup: {"door_window": 3, "object": 5},
            description: "Device operating mode",
            access: "STATE_SET",
        }),
        m.enumLookup({
            name: "door_window_type",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01eb, type: 0x20},
            lookup: {"casement_window": 1, "hopper_window": 2, "composite_window": 3, "hinged_door": 4},
            description: "Door/window type (applies when device_mode = door window)",
            access: "STATE_SET",
        }),
        m.numeric({
            name: "motion_sensitivity",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x010c, type: 0x20},
            description: "Detection sensitivity (1 = low, 10 = high)",
            valueMin: 1,
            valueMax: 10,
            access: "STATE_SET",
        }),
        m.numeric({
            name: 'report_interval',
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01ec, type: 0x23},
            description: "Reporting interval in seconds",
            unit: "s",
            valueMin: 5,
            valueMax: 300,
            access: "STATE_SET",
        }),
        m.binary({
            name: "orientation_detection",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01f0, type: 0x10},
            valueOn: ["ON", 1],
            valueOff: ["OFF", 0],
            description: "Enable orientation event detection",
            access: "STATE_SET",
        }),
        m.binary({
            name: "movement_detection",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01ed, type: 0x10},
            valueOn: ["ON", 1],
            valueOff: ["OFF", 0],
            description: "Enable movement event detection",
            access: "STATE_SET",
        }),
        m.binary({
            name: "fall_detection",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01d8, type: 0x10},
            valueOn: ["ON", 1],
            valueOff: ["OFF", 0],
            description: "Enable fall event detection",
            access: "STATE_SET",
        }),
        m.binary({
            name: "vibration_detection",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x0107, type: 0x10},
            valueOn: ["ON", 1],
            valueOff: ["OFF", 0],
            description: "Enable vibration event detection",
            access: "STATE_SET",
        }),
        m.binary({
            name: "triple_tap_detection",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01ef, type: 0x10},
            valueOn: ["ON", 1],
            valueOff: ["OFF", 0],
            description: "Enable triple-tap event detection",
            access: "STATE_SET",
        }),
        m.enumLookup({
            name: "orientation",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01f1, type: 0x20},
            lookup: {"face_up": 1, "face_down": 2, "vertical": 3, "tilt": 4},
            description: "Last reported orientation (relevant when action = orientation)",
            access: "STATE",
        }),
        //    
        // manuSpecificLumi 0x01f3 is reported with every event but only ever fires true — no information beyond `action`, so not decoded.
        //
        m.actionEnumLookup({
            cluster: "closuresDoorLock",
            attribute: {ID: 0x0055, type: 0x21},
            actionLookup: {
                "triple_tap": 0,
                "movement": 1,
                "vibration": 2,
                "orientation": 3,
                "fall": 4,
            },
        }),
        m.binary({
            name: "contact",
            cluster: "genOnOff",
            attribute: "onOff",
            valueOn: [true, 0],
            valueOff: [false, 1],
            description: "Door/window state (door/window mode only)",
            access: "STATE",
        }),
        m.enumLookup({
            name: "device_posture",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01ee, type: 0x20},
            lookup: {"normal": 1, "abnormal": 2},
            description: "Mounting orientation check — 'abnormal' when the sensor is incorrectly installed or needs calibration",
            access: "STATE",
        }),
    ],
};
