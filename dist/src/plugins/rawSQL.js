"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeSQL = void 0;
const DatabaseManager_1 = require("../DatabaseManager");
const executeSQL = async (serverName, table, sql) => {
    try {
        const databaseManager = new DatabaseManager_1.DatabaseManager().getInstance();
        const result = await databaseManager.getDataSetByQuery(serverName, sql, [], -1);
        return result !== null;
    }
    catch (e) {
        return false;
    }
};
exports.executeSQL = executeSQL;
//# sourceMappingURL=rawSQL.js.map