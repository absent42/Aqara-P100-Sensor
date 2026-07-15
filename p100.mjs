import * as lumi from "zigbee-herdsman-converters/lib/lumi";
import * as m from "zigbee-herdsman-converters/lib/modernExtend";

const {lumiModernExtend, manufacturerCode} = lumi;

// 0x01f3 reports `true` when the device becomes still after any motion event.
// The `false` transition is not reliably emitted
// Surface as an additional `action` value so it flows through the
// same event stream as the five primary action codes.
const fzStatic = {
    cluster: "manuSpecificLumi",
    type: ["attributeReport", "readResponse"],
    convert: (_model, msg) => {
        if (msg.data["499"] === 1) {
            return {action: "static"};
        }
    },
};

export default {
    zigbeeModel: ["lumi.vibration.agl002"],
    model: "DWZTCGQ11LM",
    vendor: "Aqara",
    description: "Multi-state sensor P100",
    
    extend: [
        lumiModernExtend.addManuSpecificLumiCluster(),
        lumiModernExtend.lumiPreventReset(),
        lumiModernExtend.lumiBattery({
            voltageAttribute: 0x17,
            percentageAttribute: 0x18,
        }),
        lumiModernExtend.lumiZigbeeOTA(),

        m.enumLookup({
            name: "device_mode",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x0116, type: 0x20},
            lookup: {"door_window": 3, "object": 5},
            description: "Device operating mode",
            access: "STATE_SET",
            entityCategory: "config",
            zigbeeCommandOptions: {manufacturerCode},
        }),
        m.enumLookup({
            name: "door_window_type",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01eb, type: 0x20},
            lookup: {"casement_window": 1, "hopper_window": 2, "composite_window": 3, "hinged_door": 4},
            description: "Door/window type (applies when device_mode = door window)",
            access: "STATE_SET",
            entityCategory: "config",
            zigbeeCommandOptions: {manufacturerCode},
        }),
        m.numeric({
            name: "sensitivity",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x010c, type: 0x20},
            valueMin: 1,
            valueMax: 10,
            description: "Detection sensitivity (1 = low, 10 = high)",
            access: "STATE_SET",
            entityCategory: "config",
            zigbeeCommandOptions: {manufacturerCode},
        }),
        m.numeric({
            name: "report_interval",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01ec, type: 0x23},
            unit: "s",
            valueMin: 5,
            valueMax: 300,
            description: "Reporting interval in seconds",
            access: "STATE_SET",
            entityCategory: "config",
            zigbeeCommandOptions: {manufacturerCode},
        }),
        // NEW
        m.enumLookup({
            name: "remote_calibration",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x0270, type: 0x20},
            lookup: {"calibrate": 1},
            description: "Trigger remote device calibration",
            access: "SET",
            entityCategory: "config",
            zigbeeCommandOptions: {manufacturerCode},
        }),
        m.binary({
            name: "orientation_detection",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01f0, type: 0x10},
            valueOn: ["ON", 1],
            valueOff: ["OFF", 0],
            description: "Enable orientation event detection",
            access: "STATE_SET",
            zigbeeCommandOptions: {manufacturerCode},
        }),
        m.binary({
            name: "movement_detection",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01ed, type: 0x10},
            valueOn: ["ON", 1],
            valueOff: ["OFF", 0],
            description: "Enable movement event detection",
            access: "STATE_SET",
            zigbeeCommandOptions: {manufacturerCode},
        }),
        m.binary({
            name: "fall_detection",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01d8, type: 0x10},
            valueOn: ["ON", 1],
            valueOff: ["OFF", 0],
            description: "Enable fall event detection",
            access: "STATE_SET",
            zigbeeCommandOptions: {manufacturerCode},
        }),
        m.binary({
            name: "vibration_detection",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x0107, type: 0x10},
            valueOn: ["ON", 1],
            valueOff: ["OFF", 0],
            description: "Enable vibration event detection",
            access: "STATE_SET",
            zigbeeCommandOptions: {manufacturerCode},
        }),
        m.binary({
            name: "triple_tap_detection",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01ef, type: 0x10},
            valueOn: ["ON", 1],
            valueOff: ["OFF", 0],
            description: "Enable triple-tap event detection",
            access: "STATE_SET",
            zigbeeCommandOptions: {manufacturerCode},
        }),
        m.enumLookup({
            name: "orientation",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01f1, type: 0x20},
            lookup: {"face_up": 1, "face_down": 2, "vertical": 3, "tilt": 4},
            description: "Last reported orientation (relevant when action = orientation)",
            access: "STATE",
            zigbeeCommandOptions: {manufacturerCode},
        }),
        // The 5 primary events come from cluster 0x0101 attr 0x0055.
        // `static` is a 6th value sourced from manuSpecificLumi 0x01f3 (the
        // Aqara `static_state` flag) — fired when the device becomes still after
        // motion. Wired via fzStatic in the top-level fromZigbee.
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
            extraActions: ["static"],
        }),
        m.binary({
            name: "contact",
            cluster: "genOnOff",
            attribute: "onOff",
            valueOn: [false, 1],
            valueOff: [true, 0],
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
            entityCategory: "diagnostic",
            zigbeeCommandOptions: {manufacturerCode},
        }),
        // NEW
        m.numeric({
            name: "initial_tilt_angle",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01f2, type: 0x39},
            unit: "°",
            description: "Start angle of tilt",
            access: "STATE",
            zigbeeCommandOptions: {manufacturerCode},
        }),
        m.numeric({
            name: "stationary_tilt_angle",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01f5, type: 0x39},
            unit: "°",
            description: "End angle of tilt",
            access: "STATE",
            zigbeeCommandOptions: {manufacturerCode},
        }),
        m.numeric({
            name: "tilt_angle_deviation",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01f6, type: 0x39},
            unit: "°",
            description: "Change in angle of tilt",
            access: "STATE",
            zigbeeCommandOptions: {manufacturerCode},
        }),
        m.numeric({
            name: "vibration_duration",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01fc, type: 0x21},
            unit: "s",
            description: "Duration of vibration event",
            access: "STATE",
            zigbeeCommandOptions: {manufacturerCode},
        }),
        m.numeric({
            name: "motion_duration",
            cluster: "manuSpecificLumi",
            attribute: {ID: 0x01fe, type: 0x21},
            unit: "s",
            description: "Duration of motion event",
            access: "STATE",
            zigbeeCommandOptions: {manufacturerCode},
        }),
    ],
    fromZigbee: [fzStatic],
};
