import * as globals from './src/globals';
import { JSColumn } from './src/JSColumn';
import { JSDataSet } from './src/JSDataSet';
import { JSFoundSet } from './src/JSFoundSet';
import { DatabaseManager } from './src/DatabaseManager';
import * as application from './src/application';
import * as utils from './src/utils';
import * as constants from './src/constants';
import * as datasources from './src/datasources';
import * as http from './src/plugins/http';
import * as mail from './src/plugins/mail';
import * as file from './src/plugins/file';
import * as rawSQL from './src/plugins/rawSQL';
import * as parser from './src/utils/parser';

const plugins = {
    mail,
    http,
    file,
    rawSQL,
};

export {
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
    plugins,
};
