"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugins = exports.parser = exports.datasources = exports.utils = exports.globals = exports.application = exports.JSFoundSet = exports.JSDataSet = exports.JSColumn = exports.DatabaseManager = exports.constants = void 0;
const globals = require("./src/globals");
exports.globals = globals;
const JSColumn_1 = require("./src/JSColumn");
Object.defineProperty(exports, "JSColumn", { enumerable: true, get: function () { return JSColumn_1.JSColumn; } });
const JSDataSet_1 = require("./src/JSDataSet");
Object.defineProperty(exports, "JSDataSet", { enumerable: true, get: function () { return JSDataSet_1.JSDataSet; } });
const JSFoundSet_1 = require("./src/JSFoundSet");
Object.defineProperty(exports, "JSFoundSet", { enumerable: true, get: function () { return JSFoundSet_1.JSFoundSet; } });
const DatabaseManager_1 = require("./src/DatabaseManager");
Object.defineProperty(exports, "DatabaseManager", { enumerable: true, get: function () { return DatabaseManager_1.DatabaseManager; } });
const application = require("./src/application");
exports.application = application;
const utils = require("./src/utils");
exports.utils = utils;
const constants = require("./src/constants");
exports.constants = constants;
const datasources = require("./src/datasources");
exports.datasources = datasources;
const http = require("./src/plugins/http");
const mail = require("./src/plugins/mail");
const file = require("./src/plugins/file");
const rawSQL = require("./src/plugins/rawSQL");
const parser = require("./src/utils/parser");
exports.parser = parser;
const plugins = {
    mail,
    http,
    file,
    rawSQL,
};
exports.plugins = plugins;
//# sourceMappingURL=index.js.map