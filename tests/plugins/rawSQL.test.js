const DatabaseManager = require('../../src/DatabaseManager');
const rawSQL = require('../../src/plugins/rawSQL.js');

test('databaseManager Instance shares connection info from DatabaseManager', async () => {
    DatabaseManager.registerServer({
        name: 'postgres',
        connectionString: 'postgresql://postgres:postgres@localhost/postgres',
        databaseName: 'postgres',
    });
    const result = await rawSQL.executeSQL('postgres', null, 'SELECT 1');
    expect(result).toBeDefined();
    expect(result.getValue(1, 1)).toEqual(1);
});
