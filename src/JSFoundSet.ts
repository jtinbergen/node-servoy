import { JSRecord, recordProxyHandler } from './JSRecord';
import { DatabaseManagerInstance } from './DatabaseManagerInstance';
import { JSTable } from './JSTable';

export type JSFoundSetParameters = {
    databaseManager: DatabaseManagerInstance;
    tableName: string;
    serverName: string;
    table: JSTable;
};

export class JSFoundSet {
    databaseManager: DatabaseManagerInstance;
    tableName: string;
    serverName: string;
    alldataproviders: string[];
    multiSelect: boolean;
    records: Map<number, JSRecord>;
    selectedIndexes: number[];

    /**
     * Creates a new instance of the JSFoundSet class.
     * @param parameters The parameters for the new instance.
     */
    constructor({ databaseManager, tableName, serverName, table }: JSFoundSetParameters) {
        this.databaseManager = databaseManager;
        this.tableName = tableName;
        this.serverName = serverName;
        this.alldataproviders = table.getColumnNames();
        this.multiSelect = false;
        this.records = new Map();
        this.selectedIndexes = [];
    }

    /**
     * Get the records in the given range.
     * @param from The start index (1-based).
     * @param to The end index (1-based).
     */
    public async getRecords(from: number, to: number): Promise<void> {
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

    /**
     * Get the record object at the given index.
     * @param recordIndex Index	record index (1-based).
     * @returns {JSRecord} Record.
     */
    async getRecord(recordIndex: number): Promise<JSRecord> {
        if (!this.records.has(recordIndex)) {
            const page = {
                from: Math.floor(recordIndex / 200) * 200,
                to: (Math.floor(recordIndex / 200) + 1) * 200,
            };
            await this.getRecords(page.from, page.to);
        }

        return this.records.has(recordIndex) ? this.records.get(recordIndex) : null;
    }

    /**
     * Create a new record on top of the foundset and change selection to it. Returns -1 if the record can't be made.
     * @returns {number} The index of the new record.
     */
    public newRecord(): number {
        throw new Error('Not implemented');
    }

    /**
     * Get the number of records in this foundset.
     * @returns {number} The number of records in this foundset.
     */
    public async getSize(): Promise<number> {
        const dataset = await this.databaseManager.getDataSetByQuery(
            this.serverName,
            `SELECT COUNT(*) FROM ${this.tableName}`,
            [],
            -1,
        );

        return dataset.getValue(1, 1);
    }
}
