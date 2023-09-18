import { DatabaseManager } from './DatabaseManager';
import { JSColumn } from './JSColumn';

describe.skip('JSTable', () => {
    let databaseManager: DatabaseManager;

    beforeEach(() => {
        databaseManager = new DatabaseManager();
        databaseManager.registerServer({
            name: 'postgres',
            poolSize: 10,
            connectionString: 'postgresql://postgres:postgres@localhost/postgres',
        });
    });

    afterEach(() => {
        databaseManager.getServer('postgres')!.closeAllConnections();
        databaseManager.unregisterServer('postgres');
    });

    afterAll(() => {
        databaseManager.getServer('postgres')!.closeAllConnections();
    });

    test('databaseManager can query JSTable', async () => {
        const jstable = await databaseManager.getTable('postgres', 'pg_tablespace');
        expect(jstable.getSQLName()).toEqual('pg_tablespace');

        const columnNamesArray = jstable.getColumnNames();
        expect(columnNamesArray.length).toEqual(4);
        // expect(jstable.getColumn(columnNamesArray[0])).toEqual('test');
        // expect(jstable.getColumn(columnNamesArray[1])).toEqual('omschrijving');

        const firstColumnName = columnNamesArray[1];
        const jscolumn = jstable.getColumn(firstColumnName);
        //expect(jscolumn.getLength()).toEqual(255);
        //expect(jscolumn.getTypeAsString()).toEqual(JSColumn.TEXT);
        //expect(jscolumn.getSQLName()).toEqual('varchar');
        //expect(jscolumn.isRowIdentifier()).toEqual(false);
    });
});
