import { ColumnInfo } from './JSDataSet';
import { DatabaseManager } from './DatabaseManager';

export class JSTable {
    server: any;
    tableName: string;
    databaseManager: DatabaseManager;
    serverName: string;
    columns: ColumnInfo[];

    constructor({
        databaseManager,
        tableName,
        serverName,
        server,
    }: {
        databaseManager: DatabaseManager;
        tableName: string;
        serverName: string;
        server: any;
    }) {
        this.server = server;
        this.tableName = tableName;
        this.databaseManager = databaseManager;
        this.serverName = serverName;
        this.columns = [];
    }

    async initialize() {
        const tableInformationQuery = (tableName: string) => `
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
            -1,
        );

        for (let index = 1; index <= dataset.getMaxRowIndex(); index += 1) {
            this.columns.push({
                name: dataset.getValue(index, 4),
                position: dataset.getValue(index, 5),
                default: dataset.getValue(index, 6),
                nullable: dataset.getValue(index, 7),
                type: dataset.getValue(index, 8),
                length: dataset.getValue(index, 9),
                primary: dataset.getValue(index, 28),
            });
        }
    }

    public getColumn(columnName: string) {
        return this.columns.filter((column) => column.name === columnName)[0];
    }

    public getColumnNames() {
        return this.columns.map((column) => column.name);
    }

    public getDataSource() {
        return `db:/${this.serverName}/${this.tableName}`;
    }

    public getQuotedSQLName() {
        return this.serverName;
    }

    public getRowIdentifierColumnNames() {}

    public getSQLName() {
        return this.tableName;
    }

    public getServerName() {
        return this.serverName;
    }

    public isMetadataTable() {
        return false;
    }
}
