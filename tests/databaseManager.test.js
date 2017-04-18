const DatabaseManager = require('../src/DatabaseManager');

test('databaseManager can register server', () => {
    DatabaseManager.registerServer({
        name: 'postgres',
        standbySize: 1,
        poolSize: 10,
        connectionString: 'postgresql://postgres:postgres@localhost/postgres',
    });
    expect(DatabaseManager.getServer('postgres')).toBeDefined();
});

test('databaseManager Instance shares connection info from DatabaseManager', async () => {
    DatabaseManager.registerServer({
        name: 'postgres',
        connectionString: 'postgresql://postgres:postgres@localhost/postgres',
        databaseName: 'postgres',
    });
    const databaseManager = DatabaseManager.getInstance();
    const result = await databaseManager.getDataSetByQuery('postgres', 'SELECT 22', [], -1);
    expect(result).toBeDefined();
    expect(result.getValue(1, 1)).toEqual(22);
});

test('pooledConnections are reused', async () => {
    DatabaseManager.registerServer({
        name: 'postgres',
        poolSize: 3,
        connectionString: 'postgresql://postgres:postgres@localhost/postgres',
        databaseName: 'postgres',
    });
    const databaseManager = DatabaseManager.getInstance();
    expect(DatabaseManager.getServer('postgres').getAvailableConnectionCount()).toEqual(0);
    expect(DatabaseManager.getServer('postgres').getOpenConnectionCount()).toEqual(0);

    const results = await Promise.all([
        databaseManager.getDataSetByQuery('postgres', 'SELECT 1', [], -1),
        databaseManager.getDataSetByQuery('postgres', 'SELECT 2', [], -1),
        databaseManager.getDataSetByQuery('postgres', 'SELECT 3', [], -1),
        databaseManager.getDataSetByQuery('postgres', 'SELECT 4', [], -1),
        databaseManager.getDataSetByQuery('postgres', 'SELECT 5', [], -1),
        databaseManager.getDataSetByQuery('postgres', 'SELECT 6', [], -1),
        databaseManager.getDataSetByQuery('postgres', 'SELECT 7', [], -1),
        databaseManager.getDataSetByQuery('postgres', 'SELECT 8', [], -1),
        databaseManager.getDataSetByQuery('postgres', 'SELECT 9', [], -1),
        databaseManager.getDataSetByQuery('postgres', 'SELECT 10', [], -1),
    ]);

    expect(DatabaseManager.getServer('postgres').getAvailableConnectionCount()).toEqual(3);
    expect(DatabaseManager.getServer('postgres').getOpenConnectionCount()).toEqual(3);
    DatabaseManager.getServer('postgres').closeAllConnections();
    expect(DatabaseManager.getServer('postgres').getAvailableConnectionCount()).toEqual(0);
    expect(DatabaseManager.getServer('postgres').getOpenConnectionCount()).toEqual(0);
    expect(results).toBeDefined();
    expect(results.length).toEqual(10);
});

