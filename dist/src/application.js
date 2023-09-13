"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.output = exports.isInDeveloper = exports.getVersion = exports.getUUID = exports.getTimeStamp = exports.getSolutionRelease = exports.getSolutionName = exports.getServerURL = exports.getServerTimeStamp = exports.getOSName = exports.getHostName = exports.getApplicationType = exports.exit = exports.executeProgramInBackground = exports.executeProgram = void 0;
const os = require("os");
const uuid = require("uuid");
const child_process_1 = require("child_process");
const constants_1 = require("./constants");
const execProgram = async (cmd, args, options) => new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const childprocess = (0, child_process_1.spawn)(cmd, args.split(' '), options);
    childprocess.stdout.on('data', (data) => {
        stdout += data.toString();
    });
    childprocess.stderr.on('data', (data) => {
        stderr += data.toString();
    });
    childprocess.on('close', (code) => {
        const result = { code, stdout, stderr };
        if (code !== 0) {
            return reject(JSON.stringify(result));
        }
        return resolve(JSON.stringify(result));
    });
});
const executeProgram = async (program, params, environmentVars, cwd) => {
    const env = {};
    environmentVars.forEach((variable) => {
        const parts = variable.split('=');
        env[parts[0]] = parts[1];
    });
    return execProgram(program, params, {
        env,
        cwd,
    });
};
exports.executeProgram = executeProgram;
const executeProgramInBackground = (program, params, environmentVars, cwd) => {
    const env = {};
    environmentVars.forEach((variable) => {
        const parts = variable.split('=');
        env[parts[0]] = parts[1];
    });
    execProgram(program, params, {
        env,
        cwd,
    });
};
exports.executeProgramInBackground = executeProgramInBackground;
const exit = () => {
    process.exit();
};
exports.exit = exit;
const getApplicationType = () => constants_1.APPLICATION_TYPES.HEADLESS_CLIENT;
exports.getApplicationType = getApplicationType;
const getHostName = () => os.hostname();
exports.getHostName = getHostName;
const getOSName = () => os.type();
exports.getOSName = getOSName;
const getServerTimeStamp = () => new Date();
exports.getServerTimeStamp = getServerTimeStamp;
const getServerURL = () => `http://${os.hostname()}`;
exports.getServerURL = getServerURL;
const getSolutionName = () => 'node-servoy';
exports.getSolutionName = getSolutionName;
const getSolutionRelease = () => 1;
exports.getSolutionRelease = getSolutionRelease;
const getTimeStamp = () => new Date();
exports.getTimeStamp = getTimeStamp;
const getUUID = (arg) => {
    const uuidString = arg || uuid.v4();
    const uuidBuffer = Buffer.from(uuidString);
    return {
        toString: () => uuidString,
        toBytes: () => uuidBuffer,
    };
};
exports.getUUID = getUUID;
const getVersion = () => '1';
exports.getVersion = getVersion;
const isInDeveloper = () => false;
exports.isInDeveloper = isInDeveloper;
const output = (msg, level) => {
    switch (level) {
        case constants_1.LOGGINGLEVEL.DEBUG:
        case constants_1.LOGGINGLEVEL.INFO:
            console.log(msg);
            break;
        case constants_1.LOGGINGLEVEL.WARNING:
            console.warn(msg);
            break;
        case constants_1.LOGGINGLEVEL.ERROR:
            console.error(msg);
            break;
        default:
            console.log(msg);
    }
};
exports.output = output;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.sleep = sleep;
//# sourceMappingURL=application.js.map