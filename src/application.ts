import * as os from 'os';
import * as uuid from 'uuid';
import { spawn } from 'child_process';
import { LOGGINGLEVEL, APPLICATION_TYPES } from './constants';

const execProgram = async (cmd: string, args: string, options: any) =>
    new Promise((resolve, reject) => {
        let stdout = '';
        let stderr = '';
        const childprocess = spawn(cmd, args.split(' '), options);
        childprocess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        childprocess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        childprocess.on('close', (code) => {
            const result = { code, stdout, stderr };
            if (code !== 0) {
                return reject(result);
            }

            return resolve(result);
        });
    });

const executeProgram = async (
    program: string,
    params: string,
    environmentVars: string[],
    cwd: any,
) => {
    const env: any = {};
    environmentVars.forEach((variable) => {
        const parts = variable.split('=');
        env[parts[0]] = parts[1];
    });

    return execProgram(program, params, {
        env,
        cwd,
    });
};

const executeProgramInBackground = (
    program: string,
    params: string,
    environmentVars: string[],
    cwd: any,
) => {
    const env: any = {};
    environmentVars.forEach((variable) => {
        const parts = variable.split('=');
        env[parts[0]] = parts[1];
    });

    execProgram(program, params, {
        env,
        cwd,
    });
};

const exit = () => {
    process.exit();
};

const getApplicationType = () => APPLICATION_TYPES.HEADLESS_CLIENT;

const getHostName = () => os.hostname();

const getOSName = () => os.type();

const getServerTimeStamp = () => new Date();

const getServerURL = () => `http://${os.hostname()}`;

const getSolutionName = () => 'node-servoy';

const getSolutionRelease = () => 1;

const getTimeStamp = () => new Date();

const getUUID = (arg: string) => {
    const uuidString = arg || uuid.v4();
    const uuidBuffer = Buffer.from(uuidString);
    return {
        toString: () => uuidString,
        toBytes: () => uuidBuffer,
    };
};

const getVersion = () => 1;

const isInDeveloper = () => false;

const output = (msg: any, level: LOGGINGLEVEL) => {
    switch (level) {
        case LOGGINGLEVEL.DEBUG:
        case LOGGINGLEVEL.INFO:
            console.log(msg);
            break;
        case LOGGINGLEVEL.WARNING:
            console.warn(msg);
            break;
        case LOGGINGLEVEL.ERROR:
            console.error(msg);
            break;
        default:
            console.log(msg);
    }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export {
    executeProgram,
    executeProgramInBackground,
    exit,
    getApplicationType,
    getHostName,
    getOSName,
    getServerTimeStamp,
    getServerURL,
    getSolutionName,
    getSolutionRelease,
    getTimeStamp,
    getUUID,
    getVersion,
    isInDeveloper,
    output,
    sleep,
};
