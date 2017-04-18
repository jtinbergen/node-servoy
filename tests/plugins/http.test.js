const http = require('../../src/plugins/http');

test('GET request to function', async () => {
    const client = http.createNewHttpClient();
    const request = client.createGetRequest('http://www.google.nl');
    const body = await request.executeRequest();
    expect(body.indexOf('google')).toBeGreaterThan(-1);
});
