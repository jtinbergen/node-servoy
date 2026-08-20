import * as http from './http';

describe('plugins.http', () => {
    test('GET request to function', async () => {
        const client = http.createNewHttpClient();
        const request = client.createGetRequest('http://www.google.nl');
        const response = await request.executeRequest();
        expect(response.getStatusCode).toBeDefined();
        expect(response.getResponseBody).toBeDefined();
        expect(response.getResponseHeaders).toBeDefined();
        expect(response.getMediaData).toBeDefined();
        expect(response.getCharset).toBeDefined();
        expect(response.close).toBeDefined();
        expect(response.getStatusCode()).toEqual(301);
        expect(response.getResponseHeaders()['location']).toBeDefined();
    });

    test('HTTP_STATUS defined', async () => {
        expect(http.HTTP_STATUS).toBeDefined();
    });
});
