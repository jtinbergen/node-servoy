import { JSRecord, recordProxyHandler } from './JSRecord';
import { DatabaseManagerInstance } from './DatabaseManagerInstance';
import { JSTable } from './JSTable';

export class JSFoundSet {
    databaseManager: DatabaseManagerInstance;
    tableName: string;
    serverName: string;
    alldataproviders: string[];
    multiSelect: boolean;
    records: Map<number, JSRecord>;
    selectedIndexes: number[];

    constructor({
        databaseManager,
        tableName,
        serverName,
        table,
    }: {
        databaseManager: DatabaseManagerInstance;
        tableName: string;
        serverName: string;
        table: JSTable;
    }) {
        this.databaseManager = databaseManager;
        this.tableName = tableName;
        this.serverName = serverName;
        this.alldataproviders = table.getColumnNames();
        this.multiSelect = false;
        this.records = new Map();
        this.selectedIndexes = [];
    }

    public async getRecords(from: number, to: number) {
        const dataset = await this.databaseManager.getDataSetByQuery(
            this.serverName,
            `SELECT * FROM ${this.tableName} OFFSET ${from} LIMIT ${to - from}`,
            [],
            -1,
        );

        for (let row = 1; row <= dataset.getMaxRowIndex(); row += 1) {
            const record: any = { _state: 0 };
            const columnNames = dataset.getColumnNames();
            columnNames.forEach((columnName: string, columnIndex: number) => {
                record[columnNames[columnIndex]] = dataset.getValue(row, columnIndex + 1);
            });

            const jsrecord = new JSRecord({
                databaseManager: this.databaseManager,
                foundset: this,
                record,
            });

            const recordProxy: any = new Proxy(jsrecord, recordProxyHandler);
            this.records.set(row + from, recordProxy);
        }
    }

    async getRecord(recordIndex: number) {
        if (!this.records.has(recordIndex)) {
            const page = {
                from: Math.floor(recordIndex / 200) * 200,
                to: (Math.floor(recordIndex / 200) + 1) * 200,
            };
            await this.getRecords(page.from, page.to);
        }

        return this.records.has(recordIndex) ? this.records.get(recordIndex) : null;
    }

    public newRecord() {
        throw new Error('Not implemented');
    }

    public async getSize() {
        const dataset = await this.databaseManager.getDataSetByQuery(
            this.serverName,
            `SELECT COUNT(*) FROM ${this.tableName}`,
            [],
            -1,
        );

        return dataset.getValue(1, 1);
    }
}
