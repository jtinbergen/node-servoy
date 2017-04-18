const JSRecord = require('./JSRecord').JSRecord;
const recordProxyHandler = require('./JSRecord').recordProxyHandler;

class JSFoundSet {
    constructor({databaseManager, tableName, serverName, table }) {
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
        for (let row = 1; row <= dataset.getMaxRowIndex(); row ++)
        {
            const record = {
                _state: 0
            };
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

    async getRecord(recordIndex) {
        if (!this.records.has(recordIndex)) {
            const page = {
                from: Math.floor(recordIndex / 200) * 200,
                to: (Math.floor(recordIndex / 200)+1) * 200,
            };
            await this.getRecords(page.from, page.to);
        }

        return this.records.has(recordIndex) ? this.records.get(recordIndex) : null;
    }

    newRecord() {

    }

    /** Get the number of records in this foundset. */
    async getSize() {
        const dataset = await this.databaseManager.getDataSetByQuery(this.serverName, `SELECT COUNT(*) FROM ${this.tableName}`, [], -1);
        return dataset.getValue(1, 1);
    };
}

module.exports = JSFoundSet;
