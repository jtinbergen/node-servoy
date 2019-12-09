const os = require('os');
const uuid = require('uuid');
const { spawn } = require('child_process');
const constants = require('./constants');

const { LOGGINGLEVEL } = constants;
const { APPLICATION_TYPES } = constants;

const execProgram = async (cmd, args, options) =>
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

/**
 * Produces a "beep" sound; commonly used to indicate an error or warning dialog.
 */
const beep = () => {
  // Not implemented
};

/**
 * Execute a program and returns output.
 *
 * @example
 *  application.executeProgram("c:\\Users\\myself\\myapp.exe", ["arg1", "arg2", "arg3"], ["MY_ENV_VAR=something"], "c:\\Users\\myself\\");
 */
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

/**
 * Execute a program in the background.
 */
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

/**
 * Stop and exit application.
 */
const exit = () => {
  process.exit();
};

/**
 * Get the application type.
 */
const getApplicationType = () => APPLICATION_TYPES.HEADLESS_CLIENT;

/**
 * Get the name of the localhost.
 */
const getHostName = () => os.hostname();

/**
 * Returns the name of the operating system.
 */
const getOSName = () => os.type();

/**
 * Returns a date object initialized on server with current date and time.
 */
const getServerTimeStamp = () => new Date();

/**
 * Gets the HTTP server url.
 */
const getServerURL = () => `http://${os.hostname()}`;

/**
 * Returns the name of the current solution.
 */
const getSolutionName = () => 'node-servoy';

/**
 * Get the solution release number.
 */
const getSolutionRelease = () => 1;

/**
 * Returns a date object initialized in client with current date and time.
 */
const getTimeStamp = () => new Date();

/**
 * Get a new UUID object (also known as GUID) or convert the parameter (that can be string or byte array) to an UUID object.
 */
const getUUID = (arg) => {
  const uuidString = arg || uuid.v4();
  const uuidBuffer = Buffer.from(uuidString);
  return {
    toString: () => uuidString,
    toBytes: () => uuidBuffer,
  };
};

/**
 * Returns the application version.
 */
const getVersion = () => 1;

/**
 * Returns true if the solution is running in the developer.
 */
const isInDeveloper = () => false;

/**
 * Output something on the out stream.
 */
const output = (msg, level) => {
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

/**
 * Sleep for specified time (in milliseconds).
 */
const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });

const application = {
  beep,
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

module.exports = application;
