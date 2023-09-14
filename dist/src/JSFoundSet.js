"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSFoundSet = void 0;
const JSRecord_1 = require("./JSRecord");
class JSFoundSet {
    constructor({ databaseManager, tableName, serverName, table }) {
        this.databaseManager = databaseManager;
        this.tableName = tableName;
        this.serverName = serverName;
        this.alldataproviders = table.getColumnNames();
        this.multiSelect = false;
        this.records = new Map();
        this.selectedIndexes = [];
    }
    async getRecords(from, to) {
        const dataset = await this.databaseManager.getDataSetByQuery(this.serverName, `SELECT * FROM ${this.tableName} OFFSET ${from} LIMIT ${to - from}`, [], -1);
        for (let row = 1; row <= dataset.getMaxRowIndex(); row += 1) {
            const record = { _state: 0 };
            const columnNames = dataset.getColumnNames();
            columnNames.forEach((columnName, columnIndex) => {
                record[columnNames[columnIndex]] = dataset.getValue(row, columnIndex + 1);
            });
            const jsrecord = new JSRecord_1.JSRecord({
                databaseManager: this.databaseManager,
                foundset: this,
                record,
            });
            const recordProxy = new Proxy(jsrecord, JSRecord_1.recordProxyHandler);
            this.records.set(row + from, recordProxy);
        }
    }
    async getRecord(recordIndex) {
        if (!this.records.has(recordIndex)) {
            const page = {
                from: Math.floor(recordIndex / 200) * 200,
                to: (Math.floor(recordIndex / 200) + 1) * 200,
            };
            await this.getRecords(page.from, page.to);
        }
        return this.records.has(recordIndex) ? this.records.get(recordIndex) : null;
    }
    newRecord() {
        throw new Error('Not implemented');
    }
    async getSize() {
        const dataset = await this.databaseManager.getDataSetByQuery(this.serverName, `SELECT COUNT(*) FROM ${this.tableName}`, [], -1);
        return dataset.getValue(1, 1);
    }
}
exports.JSFoundSet = JSFoundSet;
//# sourceMappingURL=JSFoundSet.js.map