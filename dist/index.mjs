var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/globals.ts
var globals_exports = {};
__export(globals_exports, {
  format: () => format,
  sql: () => sql,
  sqlTextField: () => sqlTextField
});
var sqlTextField = (text, maxLength) => {
  let sanitizedText = text.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  if (maxLength < sanitizedText.length) {
    sanitizedText = sanitizedText.substring(0, maxLength);
  }
  sanitizedText = sanitizedText.replace(/'/g, "''");
  return `'${sanitizedText}'`;
};
function format(arg) {
  const args = Array.prototype.slice.call(arguments, 1);
  return arg.replace(
    /{(\d+)}/g,
    (match, number) => typeof args[number] !== "undefined" ? args[number] : match
  );
}
var sql = (query, args) => {
  let result = query;
  while (result.indexOf("?") > -1) {
    let arg = args.shift();
    if (typeof arg === "string") {
      arg = `'${arg}'`;
    }
    result = result.replace("?", arg);
  }
  return result;
};

// src/JSColumn.ts
var JSColumn = /* @__PURE__ */ ((JSColumn2) => {
  JSColumn2[JSColumn2["DATABASE_IDENTITY"] = 0] = "DATABASE_IDENTITY";
  JSColumn2[JSColumn2["DATABASE_SEQUENCE"] = 1] = "DATABASE_SEQUENCE";
  JSColumn2[JSColumn2["DATETIME"] = 2] = "DATETIME";
  JSColumn2[JSColumn2["EXCLUDED_COLUMN"] = 3] = "EXCLUDED_COLUMN";
  JSColumn2[JSColumn2["INTEGER"] = 4] = "INTEGER";
  JSColumn2[JSColumn2["MEDIA"] = 5] = "MEDIA";
  JSColumn2[JSColumn2["NONE"] = 6] = "NONE";
  JSColumn2[JSColumn2["NUMBER"] = 7] = "NUMBER";
  JSColumn2[JSColumn2["PK_COLUMN"] = 8] = "PK_COLUMN";
  JSColumn2[JSColumn2["ROWID_COLUMN"] = 9] = "ROWID_COLUMN";
  JSColumn2[JSColumn2["SERVOY_SEQUENCE"] = 10] = "SERVOY_SEQUENCE";
  JSColumn2[JSColumn2["TENANT_COLUMN"] = 14] = "TENANT_COLUMN";
  JSColumn2[JSColumn2["TEXT"] = 11] = "TEXT";
  JSColumn2[JSColumn2["UUID_COLUMN"] = 12] = "UUID_COLUMN";
  JSColumn2[JSColumn2["UUID_GENERATOR"] = 13] = "UUID_GENERATOR";
  return JSColumn2;
})(JSColumn || {});

// src/JSDataSet.ts
var ColumnInfo = class {
  constructor({ name, type: type2 } = {}) {
    this.name = name || "?column?";
    this.type = type2 || 11 /* TEXT */;
  }
};
var JSDataSet = class _JSDataSet {
  /**
   * Creates a new instance of the JSDataSet class.
   * @param json Optional JSON object to initialize the dataset with.
   */
  constructor(json) {
    this.rowIndex = 0;
    this.rows = [];
    this.columns = [];
    if (!(this instanceof _JSDataSet)) {
      return new _JSDataSet();
    }
    if (json && json.rows && json.columns) {
      this.rows = JSON.parse(json.rows);
      this.columns = JSON.parse(json.columns);
    }
  }
  /**
   * Get the number of rows in the dataset.
   * @returns {number} The maximum row index of the dataset.
   */
  getMaxRowIndex() {
    return this.rows.length;
  }
  /**
   * Get the number of columns in the dataset.
   * @returns {number} The maximum column index of the dataset.
   */
  getMaxColumnIndex() {
    return this.columns.length;
  }
  /**
   * Returns the type of the column at the specified index.
   * @param index The index of the column to get the type of.
   * @returns {JSColumn} The type of the column at the specified index, or null if the index is out of range.
   */
  getColumnType(index) {
    return index >= 1 && index <= this.columns.length ? this.columns[index - 1].type : null;
  }
  /**
   * Returns the name of the column at the specified index.
   * @param index The index of the column to retrieve the name for.
   * @returns {string} The name of the column at the specified index, or null if the index is out of range.
   */
  getColumnName(index) {
    return index >= 1 && index <= this.columns.length ? this.columns[index - 1].name : null;
  }
  /**
   * Returns an array of column names for this dataset.
   * @returns {string[]} An array of column names.
   */
  getColumnNames() {
    const names = [];
    for (let i = 0; i < this.getMaxColumnIndex(); i += 1) {
      names.push(this.columns[i].name);
    }
    return names;
  }
  /**
   * Adds a new column to the dataset.
   * @param name The name of the column. If not provided, a default name will be used.
   * @param index The index at which to insert the new column. If not provided, the column will be added to the end of the dataset.
   * @param type The type of the column.
   */
  addColumn(name, index, type2) {
    const col = new ColumnInfo({ name: name || "unnamed", type: type2 });
    if (index && index >= 1 && index <= this.columns.length) {
      this.columns.splice(index - 1, 0, col);
      return;
    }
    this.columns.push(col);
  }
  /**
   * Add a row to the dataset.
   * @param index The index at which to insert the new row. If not provided, the row will be added to the end of the dataset.
   * @param array The array of values to add to the row.
   */
  addRow(index, array) {
    if (index instanceof Array) {
      array = index;
      index = -1;
    }
    if (index >= 1 && index <= this.rows.length) {
      this.rows.splice(index - 1, 0, array);
      return;
    }
    if (array) {
      for (let i = 0; i < array.length; i += 1) {
        const type2 = this.getColumnType(i + 1);
        if (type2 === 7 /* NUMBER */) {
          array[i] = array[i] && typeof array[i] !== "number" ? parseFloat(array[i]) : array[i];
        }
      }
      this.rows.push(array);
    }
  }
  /**
   * Removes a row from the dataset at the specified index.
   * @param index The index of the row to remove.
   */
  removeRow(index) {
    if (index >= 1 && index <= this.rows.length) {
      this.rows.splice(index - 1, 1);
    }
  }
  /**
   * Get the dataset as an html table.
   * @param escape_values If true, replaces illegal HTML characters with corresponding valid escape sequences.
   * @param escape_spaces If true, replaces text spaces with non-breaking space tags ( ) and tabs by four non-breaking space tags.
   * @param multi_line_markup If true, multiLineMarkup will enforce new lines that are in the text; single new lines will be replaced by <br>, multiple new lines will be replaced by <p>
   * @param pretty_indent If true, adds indentation for more readable HTML code.
   * @param add_column_names If false, column headers will not be added to the table.
   * @returns {string} The dataset as an HTML table.
   */
  getAsHTML(escape_values, escape_spaces, multi_line_markup, pretty_indent, add_column_names) {
    let html = "";
    html += `<p>Lines: ${this.getMaxRowIndex()}</p>`;
    html += "<table>";
    if (add_column_names) {
      const columnNames = this.getColumnNames();
      html += '<tr style="background-color: #dddddd">';
      html += '<th style="font-style: italic color: gray">Index</th>';
      for (let i = 0; i < columnNames.length; i++) {
        html += `<th style="text-align: left">${columnNames[i]}</th>`;
      }
      html += "</tr>";
    }
    for (let row = 0; row < this.rows.length; row += 1) {
      html += "<tr>";
      const style = row % 2 === 0 ? "background-color: #eff3fe" : "";
      html += `<td style="${style} font-style: italic color: gray">${(row + 1).toFixed()}</td>`;
      for (let col = 0; col < this.columns.length; col += 1) {
        let value = this.rows[row][col];
        if (!value)
          value = "";
        html += `<td style="${style}">${value}</td>`;
      }
      html += "</tr>";
    }
    html += "</table>";
    return html;
  }
  /**
   * Returns an array of values for a given column index.
   * @param column The index of the column to retrieve values from.
   * @returns An array of values for the given column index, or null if the column index is out of range.
   */
  getColumnAsArray(column) {
    const values = [];
    if (column < 1 || column > this.getMaxColumnIndex()) {
      return null;
    }
    for (let i = 0; i < this.rows.length; i += 1) {
      if (column >= 1 && column <= this.columns.length + 1) {
        values.push(this.rows[i][column - 1]);
      }
    }
    return values;
  }
  /**
   * Returns the specified row as an array.
   * @param row The index of the row to retrieve (1-based).
   * @returns An array containing the values of the specified row, or null if the row index is out of range.
   */
  getRowAsArray(row) {
    if (row < 1 || row > this.getMaxRowIndex()) {
      return null;
    }
    return [...this.rows[row - 1]];
  }
  /**
   * Returns the value at the specified row and column index.
   * @param row The row index (1-based).
   * @param col The column index (1-based).
   * @returns The value at the specified row and column index, or null if the indexes are out of range.
   */
  getValue(row, col) {
    if (col < 1 || col > this.getMaxColumnIndex()) {
      return null;
    }
    if (row < 1 || row > this.getMaxRowIndex()) {
      return null;
    }
    return this.rows[row - 1][col - 1];
  }
  /**
   * Sets the value of a cell in the dataset.
   * @param row The row index of the cell to set (1-based).
   * @param col The column index of the cell to set (1-based).
   * @param value The value to set in the cell.
   * @returns The value that was set in the cell.
   */
  setValue(row, col, value) {
    if (col < 1 || col > this.getMaxColumnIndex()) {
      return null;
    }
    if (row < 1 || row > this.getMaxRowIndex()) {
      return null;
    }
    this.rows[row - 1][col - 1] = value;
    return value;
  }
  /**
   * Removes a column from the dataset.
   * @param col The index of the column to remove.
   */
  removeColumn(col) {
    if (col < 1 || col > this.getMaxColumnIndex()) {
      return;
    }
    this.columns.splice(col - 1, 1);
    for (let row = 0; row < this.rows.length; row += 1) {
      this.rows[row].splice(col - 1, 1);
    }
  }
  /**
   * Sorts the rows of the dataset based on the values in the specified column.
   * @param col The index of the column to sort by.
   * @param sort_direction If true, sorts the rows in ascending order. If false, sorts the rows in descending order.
   */
  sort(col, sort_direction) {
    this.rows = this.rows.sort((a, b) => {
      if (a[col - 1] < b[col - 1])
        return sort_direction ? -1 : 1;
      if (a[col - 1] > b[col - 1])
        return sort_direction ? 1 : -1;
      return 0;
    });
  }
};

// src/JSRecord.ts
var JSRecord = class {
  constructor({
    databaseManager,
    foundset,
    record
  }) {
    this.exception = null;
    this.foundset = foundset;
    this.unsavedChanges = [];
    for (let field in record) {
      this[field] = record[field];
    }
    this.recordMarkers = this.createMarkers();
  }
  createMarkers() {
    throw new Error("Not implemented");
  }
  getChangedData() {
    throw new Error("Not implemented");
  }
  getDataSource() {
    throw new Error("Not implemented");
  }
  getPKs() {
    throw new Error("Not implemented");
  }
  hasChangedData() {
    throw new Error("Not implemented");
  }
  isEditing() {
    throw new Error("Not implemented");
  }
  isNew() {
    throw new Error("Not implemented");
  }
  isRelatedFoundSetLoaded(relationName) {
    throw new Error("Not implemented");
  }
  revertChanges() {
    throw new Error("Not implemented");
  }
};
var isFunction = (functionToCheck) => {
  const getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === "[object Function]";
};
var recordProxyHandler = {
  get: (target, propertyName) => {
    let propertyValue = target[propertyName];
    target.unsavedChanges.forEach((change) => {
      if (change.propertyName === propertyName) {
        propertyValue = change.propertyValue;
      }
    });
    if (isFunction(propertyValue)) {
      propertyValue = propertyValue.bind(target);
    }
    return propertyValue;
  },
  set: (target, propertyName, propertyValue) => {
    target.unsavedChanges.push(
      Object.assign({
        modificationDate: /* @__PURE__ */ new Date(),
        propertyName,
        propertyValue
      })
    );
    return true;
  }
};

// src/JSFoundSet.ts
var JSFoundSet = class {
  /**
   * Creates a new instance of the JSFoundSet class.
   * @param parameters The parameters for the new instance.
   */
  constructor({ databaseManager, tableName, serverName, table }) {
    this.databaseManager = databaseManager;
    this.tableName = tableName;
    this.serverName = serverName;
    this.alldataproviders = table.getColumnNames();
    this.multiSelect = false;
    this.records = /* @__PURE__ */ new Map();
    this.selectedIndexes = [];
  }
  /**
   * Get the records in the given range.
   * @param from The start index (1-based).
   * @param to The end index (1-based).
   */
  async getRecords(from, to) {
    const dataset = await this.databaseManager.getDataSetByQuery(
      this.serverName,
      `SELECT * FROM ${this.tableName} OFFSET ${from} LIMIT ${to - from}`,
      [],
      -1
    );
    for (let row = 1; row <= dataset.getMaxRowIndex(); row += 1) {
      const record = { _state: 0 };
      const columnNames = dataset.getColumnNames();
      columnNames.forEach((columnName, columnIndex) => {
        record[columnNames[columnIndex]] = dataset.getValue(row, columnIndex + 1);
      });
      const jsrecord = new JSRecord({
        databaseManager: this.databaseManager,
        foundset: this,
        record
      });
      const recordProxy = new Proxy(jsrecord, recordProxyHandler);
      this.records.set(row + from, recordProxy);
    }
  }
  /**
   * Get the record object at the given index.
   * @param recordIndex Index	record index (1-based).
   * @returns {JSRecord} Record.
   */
  async getRecord(recordIndex) {
    if (!this.records.has(recordIndex)) {
      const page = {
        from: Math.floor(recordIndex / 200) * 200,
        to: (Math.floor(recordIndex / 200) + 1) * 200
      };
      await this.getRecords(page.from, page.to);
    }
    return this.records.has(recordIndex) ? this.records.get(recordIndex) : null;
  }
  /**
   * Create a new record on top of the foundset and change selection to it. Returns -1 if the record can't be made.
   * @returns {number} The index of the new record.
   */
  newRecord() {
    throw new Error("Not implemented");
  }
  /**
   * Get the number of records in this foundset.
   * @returns {number} The number of records in this foundset.
   */
  async getSize() {
    const dataset = await this.databaseManager.getDataSetByQuery(
      this.serverName,
      `SELECT COUNT(*) FROM ${this.tableName}`,
      [],
      -1
    );
    return dataset.getValue(1, 1);
  }
};

// src/DatabaseManagerInstance.ts
var DatabaseManagerInstance = class {
  constructor({ DatabaseManager: DatabaseManager2 }) {
    this.DatabaseManager = DatabaseManager2;
    this.autoSave = false;
    this.aliasMapping = /* @__PURE__ */ new Map();
    this.globalFilters = {};
  }
  aliasedServerName(serverName) {
    let mappedAlias = serverName;
    if (this.aliasMapping.has(serverName)) {
      const serverAlias = this.aliasMapping.get(serverName);
      if (serverAlias) {
        mappedAlias = serverAlias;
      }
    }
    return mappedAlias;
  }
  async getTableNames(serverName) {
    const dataset = await this.getDataSetByQuery(
      serverName,
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'",
      [],
      -1
    );
    return dataset.getColumnAsArray(1);
  }
  getAutoSave() {
    return this.autoSave;
  }
  async getDatabaseProductName(serverName) {
    const server = this.DatabaseManager.getServer(this.aliasedServerName(serverName));
    if (!server) {
      throw new Error(`Server ${serverName} not found`);
    }
    return server.getDatabaseProductName(() => {
    });
  }
  switchServer(sourceName, destinationName) {
    this.aliasMapping.set(sourceName, destinationName);
  }
  addTableFilterParam(serverName, tableName, dataprovider, operator, value, name) {
    this.globalFilters[serverName] = this.globalFilters[serverName] || [];
    this.globalFilters[serverName].push({
      serverName,
      tableName,
      dataprovider,
      operator,
      value,
      name
    });
  }
  getTableFilterParams(serverName) {
    return this.globalFilters[serverName].map((filter) => [
      filter.tableName,
      filter.dataprovider,
      filter.operator,
      filter.value,
      filter.name
    ]);
  }
  async getDataSetByQuery(serverName, sqlQuery, args, maxReturnedRows, callback) {
    const server = this.DatabaseManager.getServer(this.aliasedServerName(serverName));
    if (!server) {
      throw new Error(`Server ${serverName} not found`);
    }
    const client = await server.getClient();
    const result = await client.getDataSetByQuery(sqlQuery, args, maxReturnedRows);
    if (callback) {
      callback(result);
    }
    return result;
  }
  async getFoundSet(serverName, tableName) {
    return new JSFoundSet({
      databaseManager: this,
      table: await this.DatabaseManager.getTable(serverName, tableName),
      serverName,
      tableName
    });
  }
  createEmptyDataSet() {
    return new JSDataSet();
  }
  startTransaction() {
    throw new Error("Not implemented");
  }
  rollbackTransaction() {
    throw new Error("Not implemented");
  }
  commitTransaction() {
    throw new Error("Not implemented");
  }
};

// src/PostgresServer.ts
import * as pg from "pg";

// src/JSTable.ts
var JSTable = class {
  constructor({
    databaseManager,
    tableName,
    serverName,
    server
  }) {
    this.server = server;
    this.tableName = tableName;
    this.databaseManager = databaseManager;
    this.serverName = serverName;
    this.columns = [];
  }
  async initialize() {
    const tableInformationQuery = (tableName) => `
            WITH pkey AS (
                SELECT
                    information_schema.constraint_column_usage.table_catalog,
                    information_schema.constraint_column_usage.table_schema,
                    information_schema.constraint_column_usage. TABLE_NAME,
                    information_schema.constraint_column_usage. COLUMN_NAME
                FROM
                    information_schema.constraint_column_usage
                JOIN information_schema.table_constraints ON (
                    table_constraints. CONSTRAINT_NAME = constraint_column_usage. CONSTRAINT_NAME
                    AND table_constraints.constraint_type = 'PRIMARY KEY'
                )
                WHERE
                    (
                        information_schema.constraint_column_usage. TABLE_NAME = '${tableName}'
                        AND information_schema.constraint_column_usage.table_schema = 'public'
                    )
            ) SELECT
                information_schema. COLUMNS.*,
                (CASE WHEN pkey.column_name IS NOT NULL THEN true ELSE false END) AS is_primary_key 
            FROM
                information_schema. COLUMNS
            LEFT JOIN pkey ON (
                pkey. COLUMN_NAME = information_schema. COLUMNS . COLUMN_NAME
                AND pkey.table_schema = information_schema. COLUMNS .table_schema
            )
            WHERE
             information_schema. COLUMNS . TABLE_NAME = '${tableName}'
        `;
    const client = await this.server.getClient();
    const dataset = await client.getDataSetByQuery(
      tableInformationQuery(this.tableName),
      [],
      -1
    );
    for (let index = 1; index <= dataset.getMaxRowIndex(); index += 1) {
      this.columns.push({
        name: dataset.getValue(index, 4),
        position: dataset.getValue(index, 5),
        default: dataset.getValue(index, 6),
        nullable: dataset.getValue(index, 7),
        type: dataset.getValue(index, 8),
        length: dataset.getValue(index, 9),
        primary: dataset.getValue(index, 28)
      });
    }
  }
  getColumn(columnName) {
    return this.columns.filter((column) => column.name === columnName)[0];
  }
  getColumnNames() {
    return this.columns.map((column) => column.name);
  }
  getDataSource() {
    return `db:/${this.serverName}/${this.tableName}`;
  }
  getQuotedSQLName() {
    return this.serverName;
  }
  getRowIdentifierColumnNames() {
  }
  getSQLName() {
    return this.tableName;
  }
  getServerName() {
    return this.serverName;
  }
  isMetadataTable() {
    return false;
  }
};

// src/application.ts
var application_exports = {};
__export(application_exports, {
  executeProgram: () => executeProgram,
  executeProgramInBackground: () => executeProgramInBackground,
  exit: () => exit,
  getApplicationType: () => getApplicationType,
  getHostName: () => getHostName,
  getOSName: () => getOSName,
  getServerTimeStamp: () => getServerTimeStamp,
  getServerURL: () => getServerURL,
  getSolutionName: () => getSolutionName,
  getSolutionRelease: () => getSolutionRelease,
  getTimeStamp: () => getTimeStamp,
  getUUID: () => getUUID,
  getVersion: () => getVersion,
  isInDeveloper: () => isInDeveloper,
  output: () => output,
  sleep: () => sleep
});
import * as os from "os";
import * as uuid from "uuid";
import { spawn } from "child_process";

// src/constants.ts
var constants_exports = {};
__export(constants_exports, {
  APPLICATION_TYPES: () => APPLICATION_TYPES,
  LOGGINGLEVEL: () => LOGGINGLEVEL
});
var LOGGINGLEVEL = /* @__PURE__ */ ((LOGGINGLEVEL2) => {
  LOGGINGLEVEL2[LOGGINGLEVEL2["DEBUG"] = 0] = "DEBUG";
  LOGGINGLEVEL2[LOGGINGLEVEL2["INFO"] = 1] = "INFO";
  LOGGINGLEVEL2[LOGGINGLEVEL2["WARNING"] = 2] = "WARNING";
  LOGGINGLEVEL2[LOGGINGLEVEL2["ERROR"] = 3] = "ERROR";
  LOGGINGLEVEL2[LOGGINGLEVEL2["FATAL"] = 4] = "FATAL";
  return LOGGINGLEVEL2;
})(LOGGINGLEVEL || {});
var APPLICATION_TYPES = /* @__PURE__ */ ((APPLICATION_TYPES2) => {
  APPLICATION_TYPES2[APPLICATION_TYPES2["HEADLESS_CLIENT"] = 0] = "HEADLESS_CLIENT";
  APPLICATION_TYPES2[APPLICATION_TYPES2["MOBILE_CLIENT"] = 1] = "MOBILE_CLIENT";
  APPLICATION_TYPES2[APPLICATION_TYPES2["NG_CLIENT"] = 2] = "NG_CLIENT";
  APPLICATION_TYPES2[APPLICATION_TYPES2["RUNTIME_CLIENT"] = 3] = "RUNTIME_CLIENT";
  APPLICATION_TYPES2[APPLICATION_TYPES2["SMART_CLIENT"] = 4] = "SMART_CLIENT";
  APPLICATION_TYPES2[APPLICATION_TYPES2["WEB_CLIENT"] = 5] = "WEB_CLIENT";
  return APPLICATION_TYPES2;
})(APPLICATION_TYPES || {});

// src/application.ts
var execProgram = async (cmd, args, options) => new Promise((resolve2, reject) => {
  let stdout = "";
  let stderr = "";
  const childprocess = spawn(cmd, args.split(" "), options);
  childprocess.stdout.on("data", (data) => {
    stdout += data.toString();
  });
  childprocess.stderr.on("data", (data) => {
    stderr += data.toString();
  });
  childprocess.on("close", (code) => {
    const result = { code, stdout, stderr };
    if (code !== 0) {
      return reject(JSON.stringify(result));
    }
    return resolve2(JSON.stringify(result));
  });
});
var executeProgram = async (program, params, environmentVars, cwd) => {
  const env = {};
  environmentVars.forEach((variable) => {
    const parts = variable.split("=");
    env[parts[0]] = parts[1];
  });
  return execProgram(program, params, {
    env,
    cwd
  });
};
var executeProgramInBackground = (program, params, environmentVars, cwd) => {
  const env = {};
  environmentVars.forEach((variable) => {
    const parts = variable.split("=");
    env[parts[0]] = parts[1];
  });
  execProgram(program, params, {
    env,
    cwd
  });
};
var exit = () => {
  process.exit();
};
var getApplicationType = () => 0 /* HEADLESS_CLIENT */;
var getHostName = () => os.hostname();
var getOSName = () => os.type();
var getServerTimeStamp = () => /* @__PURE__ */ new Date();
var getServerURL = () => `http://${os.hostname()}`;
var getSolutionName = () => "node-servoy";
var getSolutionRelease = () => 1;
var getTimeStamp = () => /* @__PURE__ */ new Date();
var getUUID = (arg) => {
  const uuidString = arg || uuid.v4();
  const uuidBuffer = Buffer.from(uuidString);
  return {
    toString: () => uuidString,
    toBytes: () => uuidBuffer
  };
};
var getVersion = () => "1";
var isInDeveloper = () => false;
var output = (msg, level) => {
  switch (level) {
    case 0 /* DEBUG */:
    case 1 /* INFO */:
      console.log(msg);
      break;
    case 2 /* WARNING */:
      console.warn(msg);
      break;
    case 3 /* ERROR */:
      console.error(msg);
      break;
    default:
      console.log(msg);
  }
};
var sleep = (ms) => new Promise((resolve2) => setTimeout(resolve2, ms));

// src/PostgresServer.ts
var PostgresServer = class {
  constructor(databaseManagerInstance, settings) {
    this.databaseManagerInstance = databaseManagerInstance;
    this.settings = settings;
    this.tables = /* @__PURE__ */ new Map();
    this.pg_types = {
      16: 7 /* NUMBER */,
      19: 11 /* TEXT */,
      20: 7 /* NUMBER */,
      21: 7 /* NUMBER */,
      23: 7 /* NUMBER */,
      25: 11 /* TEXT */,
      705: 11 /* TEXT */,
      1082: 2 /* DATETIME */,
      1114: 2 /* DATETIME */,
      1184: 2 /* DATETIME */,
      1043: 11 /* TEXT */,
      1700: 7 /* NUMBER */
    };
    this.openConnections = [];
    this.availableConnections = [];
  }
  getOpenConnectionCount() {
    return this.openConnections.length;
  }
  getAvailableConnectionCount() {
    return this.availableConnections.length;
  }
  connectToDatabase() {
    let client = this.availableConnections.pop();
    if (client) {
      return Promise.resolve(client);
    }
    if (this.openConnections.length < this.settings.poolSize) {
      return new Promise((resolve2, reject) => {
        client = new pg.Client(this.settings.connectionString);
        this.openConnections.push(client);
        client.connect((err) => {
          if (err) {
            this.openConnections = this.openConnections.filter((c) => c !== client);
            reject(err);
            return;
          }
          resolve2(client);
        });
      });
    }
    return new Promise(async (resolve2) => {
      let done = false;
      while (!done) {
        const availableClient = this.availableConnections.pop();
        if (availableClient) {
          done = true;
          resolve2(availableClient);
          return;
        }
        await sleep(10);
      }
    });
  }
  closeAllConnections() {
    this.openConnections.map((connection) => {
      connection.end();
    });
    this.availableConnections.map((connection) => {
      connection.end();
    });
    this.availableConnections = [];
    this.openConnections = [];
  }
  async getDatabaseProductName(callback) {
    return this.databaseManagerInstance.getDataSetByQuery(
      "postgres",
      "select version()",
      [],
      1,
      (err, result) => {
        callback(err, result.getValue(1, 1));
      }
    );
  }
  async getTables() {
    throw new Error("Not implemented");
  }
  sql(query, args) {
    while (query.indexOf("?") > -1) {
      let arg = args.shift();
      if (typeof arg === "string") {
        arg = `'${arg}'`;
      }
      query = query.replace("?", arg);
    }
    return query;
  }
  async getClient() {
    return {
      getDataSetByQuery: async (sqlQuery, args, maxReturnedRows) => {
        const client = await this.connectToDatabase();
        return new Promise((resolve2, reject) => {
          client.query(
            this.sql(sqlQuery, args),
            [],
            (err, result) => {
              if (err) {
                return reject(err);
              }
              this.availableConnections.push(client);
              const dataset = new JSDataSet();
              result.fields.forEach((field, index) => {
                dataset.addColumn(
                  field.name,
                  index + 1,
                  this.convertToJSColumn(field.dataTypeID, field.name)
                );
              });
              result.rows.forEach((record) => {
                if (dataset.getMaxRowIndex() < maxReturnedRows || maxReturnedRows === -1) {
                  dataset.addRow(
                    result.fields.map((field) => record[field.name])
                  );
                }
              });
              return resolve2(dataset);
            }
          );
        });
      }
    };
  }
  convertToJSColumn(pgType, name) {
    if (this.pg_types[pgType] === void 0) {
      throw new Error(`Unknown dataTypeID: ${pgType.toString()} (${name})`);
    }
    return this.pg_types[pgType];
  }
  async getTable(serverName, tableName) {
    const table = new JSTable({
      databaseManager: new DatabaseManager(),
      serverName,
      tableName,
      server: this
    });
    await table.initialize();
    return table;
  }
};

// src/DatabaseManager.ts
var DatabaseManager = class {
  constructor() {
    this.servers = /* @__PURE__ */ new Map();
    this.autoSave = false;
  }
  registerServer(server) {
    if (!server.name) {
      throw new Error("name property is required.");
    }
    if (!server.connectionString) {
      throw new Error("connectionString property is required.");
    }
    this.servers.set(
      server.name,
      new PostgresServer(this.getInstance(), {
        ...{ poolSize: 1, standbySize: 1 },
        ...server
      })
    );
  }
  unregisterServer(serverName) {
    if (!serverName) {
      throw new Error("name property is required.");
    }
    const server = this.servers.get(serverName);
    if (server) {
      server.closeAllConnections();
      this.servers.delete(serverName);
    }
  }
  getServer(serverName) {
    return this.servers.get(serverName);
  }
  async getTable(serverName, tableName) {
    const server = this.getServer(serverName);
    if (!server) {
      throw new Error(`Server ${serverName} not found`);
    }
    return server.getTable(serverName, tableName);
  }
  setAutoSave(autoSave) {
    this.autoSave = autoSave;
    return this.autoSave;
  }
  getInstance() {
    return new DatabaseManagerInstance({
      DatabaseManager: this
    });
  }
};

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  getUnicodeCharacter: () => getUnicodeCharacter,
  numberFormat: () => numberFormat,
  stringIndexReplace: () => stringIndexReplace,
  stringInitCap: () => stringInitCap,
  stringLeft: () => stringLeft,
  stringLeftWords: () => stringLeftWords,
  stringMiddle: () => stringMiddle,
  stringMiddleWords: () => stringMiddleWords,
  stringPatternCount: () => stringPatternCount,
  stringPosition: () => stringPosition,
  stringReplace: () => stringReplace,
  stringRight: () => stringRight,
  stringRightWords: () => stringRightWords,
  stringToNumber: () => stringToNumber,
  stringTrim: () => stringTrim,
  stringWordCount: () => stringWordCount
});
var getUnicodeCharacter = (unicodeCharacterNumber) => {
  return String.fromCharCode(unicodeCharacterNumber);
};
var numberFormat = (number, digits) => {
  return number.toFixed(digits);
};
var stringIndexReplace = (text, start, size, replacementText) => {
  return `${text.substring(0, start - 1)}${replacementText}${text.substring(start + size - 1)}`;
};
var stringInitCap = (text) => {
  return (text || "").replace(/(?:^|\s)\S/g, (a) => {
    return a.toUpperCase();
  });
};
var stringLeft = (text, size) => {
  return (text || "").substring(0, size);
};
var stringMiddle = (text, start, size) => {
  return (text || "").substring(start - 1, start - 1 + size);
};
var stringRight = (text, size) => {
  return text.substring(text.length - size);
};
var stringTrim = (textString) => {
  return (textString || "").trim();
};
var stringWordCount = (text) => {
  return (text || "").split(" ").length;
};
var stringLeftWords = (text, numberOfWords) => {
  return text.split(" ").slice(0, numberOfWords).join(" ");
};
var stringMiddleWords = (text, start, numberOfWords) => {
  return text.split(" ").slice(start - 1, start - 1 + numberOfWords).join(" ");
};
var stringRightWords = (text, numberOfWords) => {
  return text.split(" ").slice(-numberOfWords).join(" ");
};
var stringToNumber = (textString, decimalSeparator) => {
  return parseFloat((textString || "").replace(/[^0-9.]/g, "").replace(".", decimalSeparator));
};
var stringPatternCount = (text, toSearchFor) => {
  return (text.match(new RegExp(toSearchFor, "g")) || []).length;
};
var stringPosition = (textString, toSearchFor, start, occurrence) => {
  const positions = [];
  let pos = textString.indexOf(toSearchFor, start - 1);
  while (pos !== -1) {
    positions.push(pos);
    pos = textString.indexOf(toSearchFor, pos + 1);
  }
  return positions[occurrence - 1] + 1 || -1;
};
var stringReplace = (text, searchText, replacementText) => {
  return text.replace(new RegExp(searchText, "g"), replacementText);
};

// src/datasources.ts
var datasources_exports = {};
__export(datasources_exports, {
  db: () => db,
  mem: () => mem
});
var db = [];
var mem = [];

// src/plugins/http.ts
var http_exports = {};
__export(http_exports, {
  HTTP_STATUS: () => HTTP_STATUS,
  createNewHttpClient: () => createNewHttpClient,
  getMediaData: () => getMediaData,
  getPageData: () => getPageData
});
import * as https from "https";
import * as http from "http";
import * as url from "url";
var HttpResponse = class {
  constructor({ data, statusCode, headers }) {
    this.data = data;
    this.headers = headers;
    this.statusCode = statusCode;
  }
  getStatusCode() {
    return this.statusCode;
  }
  getResponseBody() {
    return this.data.toString();
  }
  getResponseHeaders(header) {
    if (!header) {
      return this.headers;
    }
    return this.headers[header];
  }
  getMediaData() {
    return this.data;
  }
  getCharset() {
    return "utf-8";
  }
  close() {
    return true;
  }
};
var HttpRequest = class {
  constructor(options) {
    this.options = options;
    this.body = null;
  }
  addHeader(headerName, value) {
    this.options.headers = this.options.headers || {};
    this.options.headers[headerName] = value;
    return this.options.headers[headerName] === value;
  }
  setCharset(charSet) {
    this.charSet = charSet;
  }
  setBodyContent(content, mimeType) {
    this.body = Buffer.from(content);
    this.mimeType = mimeType;
  }
  async executeAsyncRequest(username, password, workstation, domain, successCallbackMethod, errorCallbackMethod) {
    let successCallback = successCallbackMethod;
    let errorCallback = errorCallbackMethod;
    if (typeof username === "function" && typeof password === "function") {
      successCallback = username;
      errorCallback = password;
    }
    if (typeof workstation === "function" && typeof domain === "function") {
      successCallback = workstation;
      errorCallback = domain;
    }
    const client = this.options.tls ? https : http;
    const req = client.request(this.options, (res) => {
      let buffer = Buffer.alloc(0);
      res.on("data", (data) => {
        buffer = Buffer.concat(buffer, data);
      });
      res.on("end", () => {
        if (successCallback) {
          successCallback(buffer);
        }
      });
    });
    req.setTimeout(this.options.timeout);
    req.on("error", (e) => {
      req.end();
      if (errorCallback) {
        errorCallback(e);
      }
    });
    if (this.body) {
      req.write(this.body, this.charSet);
    }
    req.end();
  }
  async executeRequest(username, password, workstation, domain) {
    return new Promise((resolve2, reject) => {
      const client = this.options.tls || this.options.protocol && this.options.protocol === "https:" ? https : http;
      this.options.headers = this.options.headers || {};
      if (this.body) {
        this.options.headers["Content-type"] = this.options.headers["Content-type"] || "application/json";
        this.options.headers["Content-length"] = this.body.length;
      }
      const req = client.request(this.options, (res) => {
        let data = Buffer.alloc(0);
        res.on("data", (newData) => {
          data = Buffer.concat([data, newData]);
        });
        res.on("end", () => {
          resolve2(
            new HttpResponse({
              headers: res.headers,
              statusCode: res.statusCode,
              data
            })
          );
        });
      });
      req.setTimeout(this.options.timeout);
      req.on("error", (e) => {
        req.end();
        reject(e);
      });
      if (this.body) {
        req.write(this.body, this.charSet);
      }
      req.end();
    });
  }
};
var HttpClient = class _HttpClient {
  constructor() {
    _HttpClient.defaultTimeout = 3e4;
  }
  static createRequest(type2, uri) {
    const correctedUrl = uri.indexOf("http") !== 0 ? `http://${uri}` : uri;
    const urlInformation = url.parse(correctedUrl);
    return new HttpRequest({
      timeout: this.defaultTimeout || 6e4,
      hostname: urlInformation.hostname,
      protocol: urlInformation.protocol,
      port: urlInformation.port || (urlInformation.protocol === "https:" ? 443 : 80),
      path: urlInformation.path,
      method: type2
    });
  }
  createGetRequest(uri) {
    return _HttpClient.createRequest("GET", uri);
  }
  createHeadRequest(uri) {
    return _HttpClient.createRequest("HEAD", uri);
  }
  createOptionsRequest(uri) {
    return _HttpClient.createRequest("OPTIONS", uri);
  }
  createPostRequest(uri) {
    return _HttpClient.createRequest("POST", uri);
  }
  createPutRequest(uri) {
    return _HttpClient.createRequest("PUT", uri);
  }
  createTraceRequest(uri) {
    return _HttpClient.createRequest("TRACE", uri);
  }
  createDeleteRequest(uri) {
    return _HttpClient.createRequest("DELETE", uri);
  }
  getCookie(cookieName) {
    throw new Error("Not implemented.");
  }
  getCookies() {
    throw new Error("Not implemented.");
  }
  setClientProxyCredentials(userName, password) {
    throw new Error("Not implemented.");
  }
  setCookie(cookieName, cookieValue, domain, path2, maxAge, secure) {
    throw new Error("Not implemented.");
  }
  setTimeout(msTimeout) {
    _HttpClient.defaultTimeout = msTimeout;
  }
};
var createNewHttpClient = () => new HttpClient();
var getMediaData = () => {
};
var getPageData = () => {
};
var HTTP_STATUS = {
  SC_ACCEPTED: 202,
  SC_BAD_GATEWAY: 502,
  SC_BAD_REQUEST: 400,
  SC_CONFLICT: 409,
  SC_CONTINUE: 100,
  SC_CREATED: 201,
  SC_EXPECTATION_FAILED: 417,
  SC_FAILED_DEPENDENCY: 424,
  SC_FORBIDDEN: 403,
  SC_GATEWAY_TIMEOUT: 504,
  SC_GONE: 410,
  SC_HTTP_VERSION_NOT_SUPPORTED: 505,
  SC_INSUFFICIENT_SPACE_ON_RESOURCE: 419,
  SC_INSUFFICIENT_STORAGE: 507,
  SC_INTERNAL_SERVER_ERROR: 500,
  SC_LENGTH_REQUIRED: 411,
  SC_LOCKED: 423,
  SC_METHOD_FAILURE: 420,
  SC_METHOD_NOT_ALLOWED: 405,
  SC_MOVED_PERMANENTLY: 301,
  SC_MOVED_TEMPORARILY: 302,
  SC_MULTIPLE_CHOICES: 300,
  SC_MULTI_STATUS: 207,
  SC_NON_AUTHORITATIVE_INFORMATION: 203,
  SC_NOT_ACCEPTABLE: 406,
  SC_NOT_FOUND: 404,
  SC_NOT_IMPLEMENTED: 501,
  SC_NOT_MODIFIED: 304,
  SC_NO_CONTENT: 204,
  SC_OK: 200,
  SC_PARTIAL_CONTENT: 206,
  SC_PAYMENT_REQUIRED: 402,
  SC_PRECONDITION_FAILED: 412,
  SC_PROCESSING: 102,
  SC_PROXY_AUTHENTICATION_REQUIRED: 407,
  SC_REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  SC_REQUEST_TIMEOUT: 408,
  SC_REQUEST_TOO_LONG: 413,
  SC_REQUEST_URI_TOO_LONG: 414,
  SC_RESET_CONTENT: 205,
  SC_SEE_OTHER: 303,
  SC_SERVICE_UNAVAILABLE: 503,
  SC_SWITCHING_PROTOCOLS: 101,
  SC_TEMPORARY_REDIRECT: 307,
  SC_UNAUTHORIZED: 401,
  SC_UNPROCESSABLE_ENTITY: 422,
  SC_UNSUPPORTED_MEDIA_TYPE: 415,
  SC_USE_PROXY: 305
};

// src/plugins/mail.ts
var mail_exports = {};
__export(mail_exports, {
  createBinaryAttachment: () => createBinaryAttachment,
  getLastSendMailExceptionMsg: () => getLastSendMailExceptionMsg,
  getMailMessage: () => getMailMessage,
  getPlainMailAddresses: () => getPlainMailAddresses,
  isValidEmailAddress: () => isValidEmailAddress,
  receiveMail: () => receiveMail,
  sendBulkMail: () => sendBulkMail,
  sendMail: () => sendMail,
  setImplementation: () => setImplementation
});
var implementation;
var setImplementation = (mailTransporter) => {
  if (!mailTransporter.sendEmail || typeof mailTransporter.sendEmail !== "function") {
    throw new Error("Not a valid implementation");
  }
  implementation = mailTransporter;
};
var createBinaryAttachment = (filename, data) => ({
  filename,
  content: Buffer.from(data)
});
var sendMail = async (to, from, subject, msgText, cc, bcc, attachments, overrideProperties) => {
  if (!implementation) {
    throw new Error("No email transport defined yet. Unable to send mail.");
  }
  return implementation.sendEmail(
    to,
    from,
    subject,
    msgText,
    cc,
    bcc,
    attachments,
    overrideProperties
  );
};
var sendBulkMail = sendMail;
var receiveMail = (username, password, leaveMsgsOnServer, receiveMode, onlyReceiveMsgWithSentDate, properties) => {
  throw new Error("Not implemented");
};
var isValidEmailAddress = (email) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
  email
);
var getPlainMailAddresses = (addressesString) => {
  throw new Error("Not implemented");
};
var getLastSendMailExceptionMsg = () => {
  throw new Error("Not implemented");
};
var getMailMessage = (binaryblobOrString) => {
  throw new Error("Not implemented");
};

// src/plugins/file.ts
var file_exports = {};
__export(file_exports, {
  JSFile: () => JSFile,
  appendToTXTFile: () => appendToTXTFile,
  convertToJSFile: () => convertToJSFile,
  convertToRemoteJSFile: () => convertToRemoteJSFile,
  copyFile: () => copyFile,
  copyFolder: () => copyFolder,
  createFile: () => createFile,
  createFolder: () => createFolder,
  createTempFile: () => createTempFile,
  deleteFile: () => deleteFile,
  deleteFolder: () => deleteFolder,
  getDefaultUploadLocation: () => getDefaultUploadLocation,
  getDesktopFolder: () => getDesktopFolder,
  getDiskList: () => getDiskList,
  getFileSize: () => getFileSize,
  getFolderContents: () => getFolderContents,
  getHomeFolder: () => getHomeFolder,
  getModificationDate: () => getModificationDate,
  getRemoteFolderContents: () => getRemoteFolderContents,
  moveFile: () => moveFile,
  openFile: () => openFile,
  readFile: () => readFile2,
  readTXTFile: () => readTXTFile,
  streamFilesFromServer: () => streamFilesFromServer,
  streamFilesToServer: () => streamFilesToServer,
  writeFile: () => writeFile,
  writeTXTFile: () => writeTXTFile
});
import * as os2 from "os";
import * as fs from "fs";
import * as path from "path";
import * as open from "open";
var JSFile = class {
  constructor(filename) {
    this.filename = filename;
  }
  refreshInformation() {
    return new Promise((resolve2, reject) => {
      fs.stat(this.filename, (error, info) => {
        if (error) {
          reject(error);
          return;
        }
        resolve2(info);
      });
    });
  }
  testForPermission(type2) {
    return new Promise((resolve2, reject) => {
      fs.access(this.filename, type2, (err) => {
        if (err) {
          resolve2(false);
          return;
        }
        resolve2(true);
      });
    });
  }
  async canRead() {
    return this.testForPermission(fs.constants.R_OK);
  }
  async canWrite() {
    return this.testForPermission(fs.constants.W_OK);
  }
  createNewFile() {
  }
  deleteFile() {
    fs.unlinkSync(this.filename);
  }
  getAbsolutePath() {
    return path.parse(path.resolve(this.filename)).dir;
  }
  exists() {
    return fs.existsSync(this.getAbsoluteFile());
  }
  getAbsoluteFile() {
    return path.resolve(this.filename);
  }
  getContentType() {
    return "application/octet-stream";
  }
  getName() {
    return path.parse(this.filename).base;
  }
  getParent() {
  }
  getParentFile() {
  }
  getPath() {
    return path.parse(path.resolve(this.filename)).dir;
  }
  isAbsolute() {
    return path.resolve(this.filename) === this.filename;
  }
  isDirectory() {
    return fs.existsSync(this.filename) && fs.lstatSync(this.filename).isDirectory();
  }
  isFile() {
    return fs.existsSync(this.filename) && fs.lstatSync(this.filename).isFile();
  }
  isHidden() {
    return false;
  }
  lastModified() {
    return fs.statSync(this.filename).mtime;
  }
  list() {
    throw new Error("Not implemented");
  }
  listFiles() {
    throw new Error("Not implemented");
  }
  mkdir() {
    throw new Error("Not implemented");
  }
  mkdirs() {
    throw new Error("Not implemented");
  }
  renameTo() {
    throw new Error("Not implemented");
  }
  async getBytes() {
    if (!this.exists()) {
      return Buffer.from([]);
    }
    return new Promise((resolve2, reject) => {
      fs.readFile(this.getAbsoluteFile(), (error, data) => {
        if (error) {
          reject(error);
          return;
        }
        resolve2(data);
      });
    });
  }
  setBytes(bytes, createFile2) {
    if (!this.exists() && !createFile2) {
      return false;
    }
    return new Promise((resolve2, reject) => {
      const stream = fs.createWriteStream(this.getAbsoluteFile(), {});
      stream.on("finish", () => resolve2(true));
      stream.on("error", (error) => reject(error));
      if (bytes) {
        stream.write(Buffer.from(bytes));
      }
      stream.end();
    });
  }
  setLastModified() {
    return false;
  }
  setReadOnly() {
    return false;
  }
  size() {
    const stats = fs.statSync(this.filename);
    return stats.size;
  }
};
var appendToTXTFile = async (file, content) => {
  const jsfile = file instanceof JSFile ? file : new JSFile(file);
  const oldcontent = await jsfile.getBytes();
  return jsfile.setBytes(Buffer.concat([oldcontent, Buffer.from(content)]), true);
};
var convertToRemoteJSFile = (filename) => new JSFile(filename);
var copyFile = (source, target) => new Promise((resolve2, reject) => {
  let cbCalled = false;
  function done(error) {
    if (!cbCalled) {
      cbCalled = true;
      if (error) {
        reject(error);
        return;
      }
      resolve2();
    }
  }
  const readableStream = fs.createReadStream(source);
  readableStream.on("error", (err) => {
    done(err);
  });
  const writableStream = fs.createWriteStream(target);
  writableStream.on("error", (error) => {
    done(error);
  });
  writableStream.on("close", () => {
    done();
  });
  readableStream.pipe(writableStream);
});
var copyFolder = () => {
};
var createFile = convertToRemoteJSFile;
var createFolder = () => {
};
var createTempFile = async (prefix, postfix) => {
  const temporaryFilename = path.join(
    os2.tmpdir(),
    `${prefix}${(Math.random() * 1e6).toFixed(0)}${postfix}`
  );
  const temporaryFile = new JSFile(temporaryFilename);
  await temporaryFile.setBytes(null, true);
  return temporaryFile;
};
var deleteFile = (file) => {
  const fullpath = file instanceof JSFile ? file.getAbsoluteFile() : file;
  return new Promise((resolve2, reject) => {
    fs.unlink(fullpath, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve2();
    });
  });
};
var deleteFolder = (deletePath) => new Promise((resolve2, reject) => {
  fs.rmdir(deletePath, (err) => {
    if (err) {
      reject(err);
      return;
    }
    resolve2();
  });
});
var getDefaultUploadLocation = () => os2.tmpdir();
var getDesktopFolder = () => {
};
var getDiskList = () => {
};
var getFileSize = () => {
};
var getFolderContents = () => {
};
var getHomeFolder = () => {
};
var getModificationDate = () => {
};
var getRemoteFolderContents = () => {
};
var moveFile = (oldPath, newPath) => new Promise((resolve2, reject) => {
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      reject(err);
      return;
    }
    resolve2();
  });
});
var openFile = (jsfile) => {
  open(jsfile.getAbsoluteFile());
};
var readFile2 = async (file, size) => new Promise((resolve2, reject) => {
  const filename = file instanceof JSFile ? file.getAbsoluteFile() : file;
  fs.readFile(filename, (error, data) => {
    if (error) {
      reject(error);
      return;
    }
    if (size && data.length > size) {
      resolve2(data.slice(0, size));
    }
    resolve2(data);
  });
});
var readTXTFile = async (file) => {
  const contents = await readFile2(file);
  return contents.toString();
};
var streamFilesFromServer = () => {
};
var streamFilesToServer = () => {
};
var writeFile = (file, content) => {
  const jsfile = file instanceof JSFile ? file : new JSFile(file);
  return jsfile.setBytes(content, true);
};
var writeTXTFile = writeFile;
var convertToJSFile = convertToRemoteJSFile;

// src/plugins/rawSQL.ts
var rawSQL_exports = {};
__export(rawSQL_exports, {
  executeSQL: () => executeSQL
});
var executeSQL = async (serverName, table, sql2) => {
  try {
    const databaseManager = new DatabaseManager().getInstance();
    const result = await databaseManager.getDataSetByQuery(serverName, sql2, [], -1);
    return result !== null;
  } catch (e) {
    return false;
  }
};

// src/utils/parser.ts
var parser_exports = {};
__export(parser_exports, {
  read: () => read,
  tokenToString: () => tokenToString
});
var tokenizer = (code) => {
  const tokens = [];
  let pos = 0;
  const parseIdentifier = () => {
    let value = "";
    while (/[a-zA-Z\-_0-9]/.test(code[pos]) && pos < code.length) {
      value += code[pos];
      pos += 1;
    }
    if (value === "true" || value === "false") {
      tokens.push({
        type: 13 /* BOOLEAN */,
        value: value === "true"
      });
      return;
    }
    if (value === "null") {
      tokens.push({
        type: 14 /* NULL */
      });
      return;
    }
    tokens.push({
      type: 1 /* IDENTIFIER */,
      value
    });
  };
  const parseNumber = () => {
    let value = "";
    while (/[-0-9]/.test(code[pos]) && pos < code.length) {
      value += code[pos];
      pos += 1;
    }
    tokens.push({
      type: 9 /* NUMBER */,
      value: parseFloat(value)
    });
  };
  const stringValue = () => {
    let value = "";
    pos += 1;
    while (code[pos] !== '"' && pos < code.length) {
      if (code[pos] === "\\") {
        pos += 1;
      }
      value += code[pos];
      pos += 1;
    }
    pos += 1;
    tokens.push({
      type: 12 /* STRING */,
      value
    });
  };
  const matchCharacter = (character, type2, optional) => {
    if (code[pos] === character) {
      tokens.push({
        type: type2
      });
      pos += 1;
      return;
    }
    if (!optional) {
      throw new Error(`Expected character ${character}`);
    }
  };
  let counter = 0;
  while (pos < code.length) {
    counter += 1;
    while (code.charCodeAt(pos) === 32 || code.charCodeAt(pos) === 9) {
      tokens.push({
        type: 15 /* WHITESPACE */
      });
      pos += 1;
    }
    matchCharacter("\r", 10 /* CARRIAGERETURN */, true);
    matchCharacter("\n", 11 /* LINEFEED */, true);
    matchCharacter("[", 2 /* BRACKET_OPEN */, true);
    matchCharacter("]", 3 /* BRACKET_CLOSE */, true);
    matchCharacter("{", 4 /* CURLY_OPEN */, true);
    matchCharacter("}", 5 /* CURLY_CLOSE */, true);
    matchCharacter(",", 7 /* COMMA */, true);
    matchCharacter(":", 8 /* COLON */, true);
    if (code[pos] === '"') {
      stringValue();
      continue;
    }
    if (/[a-zA-Z]/.test(code[pos])) {
      parseIdentifier();
      continue;
    }
    if (/[-0-9]/.test(code[pos])) {
      parseNumber();
      continue;
    }
    if (counter > code.length) {
      throw new Error(`Stuck tokenizing: position ${pos} (${code.charCodeAt(pos)})`);
    }
  }
  return tokens;
};
var tokenToString = (token) => {
  if (token.type === 1 /* IDENTIFIER */) {
    return token.value;
  }
  if (token.type === 9 /* NUMBER */) {
    return token.value;
  }
  if (token.type === 12 /* STRING */) {
    return `"${token.value}"`;
  }
  if (token.type === 8 /* COLON */) {
    return ":";
  }
  if (token.type === 7 /* COMMA */) {
    return ",";
  }
  if (token.type === 2 /* BRACKET_OPEN */) {
    return "[";
  }
  if (token.type === 3 /* BRACKET_CLOSE */) {
    return "]";
  }
  if (token.type === 4 /* CURLY_OPEN */) {
    return "{";
  }
  if (token.type === 5 /* CURLY_CLOSE */) {
    return "}";
  }
  if (token.type === 6 /* DOUBLEQUOTE */) {
    return '"';
  }
  if (token.type === 10 /* CARRIAGERETURN */) {
    return "\r";
  }
  if (token.type === 11 /* LINEFEED */) {
    return "\n";
  }
  if (token.type === 13 /* BOOLEAN */) {
    return token.value;
  }
  if (token.type === 14 /* NULL */) {
    return '"null"';
  }
  return "";
};
var expectIdentifier = (state) => {
  if (state.tokens[state.pos].type !== 1 /* IDENTIFIER */) {
    throw new Error("Expected identifier");
  }
  return state.tokens[state.pos++].value;
};
var expectType = (state, type2) => {
  if (state.tokens[state.pos].type !== type2) {
    throw new Error(`Expected type ${type2} but got ${state.tokens[state.pos].type}`);
  }
  state.pos++;
};
var nextIs = (state, type2) => state.pos < state.tokens.length && state.tokens[state.pos].type === type2;
var eatWhitespace = (state) => {
  while (nextIs(state, 15 /* WHITESPACE */)) {
    expectType(state, 15 /* WHITESPACE */);
  }
};
var expectValue = (state) => {
  if (nextIs(state, 2 /* BRACKET_OPEN */)) {
    expectType(state, 2 /* BRACKET_OPEN */);
    const array = [];
    let continueLoop = true;
    while (continueLoop && !nextIs(state, 3 /* BRACKET_CLOSE */)) {
      array.push(expectValue(state));
      continueLoop = nextIs(state, 7 /* COMMA */);
      if (continueLoop) {
        expectType(state, 7 /* COMMA */);
      }
    }
    expectType(state, 3 /* BRACKET_CLOSE */);
    return array;
  }
  if (nextIs(state, 4 /* CURLY_OPEN */)) {
    const obj = expectObject(state);
    return obj;
  }
  if (state.tokens[state.pos].type !== 14 /* NULL */ && state.tokens[state.pos].type !== 13 /* BOOLEAN */ && state.tokens[state.pos].type !== 9 /* NUMBER */ && state.tokens[state.pos].type !== 12 /* STRING */) {
    throw new Error(`Expected value but got ${state.tokens[state.pos].type}`);
  }
  return state.tokens[state.pos++].value;
};
var expectObject = (state) => {
  expectType(state, 4 /* CURLY_OPEN */);
  const object = {};
  let continueLoop = true;
  while (continueLoop && !nextIs(state, 5 /* CURLY_CLOSE */)) {
    const propertyName = expectIdentifier(state);
    eatWhitespace(state);
    expectType(state, 8 /* COLON */);
    eatWhitespace(state);
    object[propertyName] = expectValue(state);
    if (nextIs(state, 7 /* COMMA */)) {
      expectType(state, 7 /* COMMA */);
    } else {
      continueLoop = false;
    }
  }
  expectType(state, 5 /* CURLY_CLOSE */);
  return object;
};
var parser = (tokens) => {
  const state = {
    pos: 0,
    tokens: tokens.filter((token) => token.type !== 11 /* LINEFEED */).filter((token) => token.type !== 10 /* CARRIAGERETURN */)
  };
  const object = {};
  let continueLoop = true;
  if (nextIs(state, 6 /* DOUBLEQUOTE */)) {
    expectType(state, 6 /* DOUBLEQUOTE */);
  }
  while (continueLoop) {
    const propertyName = expectIdentifier(state);
    eatWhitespace(state);
    expectType(state, 8 /* COLON */);
    eatWhitespace(state);
    object[propertyName] = expectValue(state);
    if (nextIs(state, 7 /* COMMA */)) {
      expectType(state, 7 /* COMMA */);
    } else {
      continueLoop = false;
    }
  }
  if (nextIs(state, 6 /* DOUBLEQUOTE */)) {
    expectType(state, 6 /* DOUBLEQUOTE */);
  }
  return object;
};
var read = (code) => {
  const tokens = tokenizer(code);
  return parser(tokens);
};

// src/index.ts
var plugins = {
  mail: mail_exports,
  http: http_exports,
  file: file_exports,
  rawSQL: rawSQL_exports
};
export {
  DatabaseManager,
  JSColumn,
  JSDataSet,
  JSFoundSet,
  application_exports as application,
  constants_exports as constants,
  datasources_exports as datasources,
  globals_exports as globals,
  parser_exports as parser,
  plugins,
  utils_exports as utils
};
//# sourceMappingURL=index.mjs.map