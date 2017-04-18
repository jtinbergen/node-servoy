const globals = require('./src/globals');
const JSColumn = require('./src/JSDataSet');
const JSDataSet = require('./src/JSDataSet');
const JSFoundSet = require('./src/JSFoundSet');
const DatabaseManager = require('./src/DatabaseManager');
const application = require('./src/application');
const utils = require('./src/utils');
const constants = require('./src/constants');
const datasources = require('./src/datasources');
const http = require('./src/plugins/http');
const mail = require('./src/plugins/mail');
const file = require('./src/plugins/file');
const rawSQL = require('./src/plugins/rawSQL');
const parser = require('./src/utils/parser');

module.exports = {
    constants,
    DatabaseManager,
    JSColumn,
    JSDataSet,
    JSFoundSet,
    application,
    globals,
    utils,
    datasources,
    parser,
    plugins: {
        mail,
        http,
        file,
        rawSQL,
    },
};
