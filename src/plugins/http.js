const https = require('https');
const http = require('http');
const url = require('url');

class HttpResponse {
    constructor({ data, statusCode, headers }) {
        this.data = data;
        this.headers = headers;
        this.statusCode = statusCode;
    }

    getStatusCode() {
        return this.statusCode;
    }

    getResponseBody() {
        return this.data.toString();
    }

    getResponseHeaders(header) {
        if (!header) {
            return this.headers;
        }

        return this.headers[header];
    }

    getMediaData() {
        return this.data;
    }

    getCharset() {
        return 'utf-8';
    }

    close() {
        return true;
    }
}

class HttpRequest {
    constructor(options) {
        this.options = options;
    }

    addHeader(headerName, value) {
        this.options.headers = this.options.headers || {};
        this.options.headers[headerName] = value;
        return this.options.headers[headerName] === value;
    }

    setCharset(charSet) {
        this.charSet = charSet;
    }

    setBodyContent(content, mimeType) {
        this.body = Buffer.from(content);
        this.mimeType = mimeType;
    }

    /**
     * Execute the request method asynchronous. Success callback method will be called when response is received.
     * Response is sent as parameter in callback.
     * If no response is received (request errors out), the errorCallbackMethod is called with exception message as parameter.
     *
     * Windows authentication is not implemented.
     *
     * @param {*} userName
     * @param {*} password
     * @param {*} workstation
     * @param {*} domain
     * @param {*} successCallbackMethod
     * @param {*} errorCallbackMethod
     */
    async executeAsyncRequest(username, password, workstation, domain, successCallbackMethod, errorCallbackMethod) {
        let successCallback = successCallbackMethod;
        let errorCallback = errorCallbackMethod;
        if (typeof username === 'function' && typeof password === 'function') {
            successCallback = username;
            errorCallback = password;
        }

        if (typeof workstation === 'function' && typeof domain === 'function') {
            successCallback = workstation;
            errorCallback = domain;
        }

        const client = this.options.tls ? https : http;
        const req = client.request(this.options, (res) => {
            let buffer = Buffer.alloc(0);
            res.on('data', (data) => {
                buffer = Buffer.concat(buffer, data);
            });

            res.on('end', () => {
                successCallback(buffer);
            });
        });

        req.setTimeout(this.options.timeout);
        req.on('error', (e) => {
            req.end();
            errorCallback(e);
        });

        if (this.body) {
            req.write(this.body, this.charSet);
        }

        req.end();
    }

    /**
     * Execute the request method asynchronous. Success callback method will be called when response is received.
     * Response is sent as promise result.
     * The promise will reject with an error when applicable.
     *
     * Windows authentication is not implemented.
     *
     * @param {*} userName
     * @param {*} password
     * @param {*} workstation
     * @param {*} domain
     */
    async executeRequest(userName, password, workstation, domain) {
        return new Promise((resolve, reject) => {
            const client = this.options.tls ? https : http;
            const req = client.request(this.options, (res) => {
                let data = Buffer.alloc(0);
                res.on('data', (newData) => {
                    data = Buffer.concat([data, newData]);
                });

                res.on('end', () => {
                    resolve(new HttpResponse({
                        headers: res.headers,
                        statusCode: res.statusCode,
                        data,
                    }));
                });
            });

            req.setTimeout(this.options.timeout);
            req.on('error', (e) => {
                req.end();
                reject(e);
            });

            if (this.body) {
                req.write(this.body, this.charSet);
            }

            req.end();
        });
    }
}

class HttpClient {
    constructor() {
        this.defaultTimeout = 30000;
    }

    static createRequest(type, uri) {
        const correctedUrl = uri.indexOf('http') !== 0 ? `http://${uri}` : uri;
        const urlInformation = url.parse(correctedUrl);
        return new HttpRequest({
            timeout: this.defaultTimeout || 60000,
            hostname: urlInformation.hostname,
            port: urlInformation.port || (urlInformation.protocol === 'https:' ? 443 : 80),
            path: urlInformation.path,
            method: 'GET',
        });
    }

    createGetRequest(uri) {
        return HttpClient.createRequest('GET', uri);
    }

    createHeadRequest(uri) {
        return HttpClient.createRequest('HEAD', uri);
    }

    createOptionsRequest(uri) {
        return HttpClient.createRequest('OPTIONS', uri);
    }

    createPostRequest(uri) {
        return HttpClient.createRequest('POST', uri);
    }

    createPutRequest(uri) {
        return HttpClient.createRequest('PUT', uri);
    }

    createTraceRequest(uri) {
        return HttpClient.createRequest('TRACE', uri);
    }

    createDeleteRequest(uri) {
        return HttpClient.createRequest('DELETE', uri);
    }

    getCookie(cookieName) {
        throw new Error('Not implemented.');
    }

    getCookies() {
        throw new Error('Not implemented.');
    }

    setClientProxyCredentials(userName, password) {
        throw new Error('Not implemented.');
    }

    setCookie(cookieName, cookieValue, domain, path, maxAge, secure) {
        throw new Error('Not implemented.');
    }

    setTimeout(msTimeout) {
        this.defaultTimeout = msTimeout;
    }
}

const createNewHttpClient = () => new HttpClient();
const getMediaData = () => {};
const getPageData = () => {};
const HTTP_STATUS = {
    SC_ACCEPTED: 202,
    SC_BAD_GATEWAY: 502,
    SC_BAD_REQUEST: 400,
    SC_CONFLICT: 409,
    SC_CONTINUE: 100,
    SC_CREATED: 201,
    SC_EXPECTATION_FAILED: 417,
    SC_FAILED_DEPENDENCY: 424,
    SC_FORBIDDEN: 403,
    SC_GATEWAY_TIMEOUT: 504,
    SC_GONE: 410,
    SC_HTTP_VERSION_NOT_SUPPORTED: 505,
    SC_INSUFFICIENT_SPACE_ON_RESOURCE: 419,
    SC_INSUFFICIENT_STORAGE: 507,
    SC_INTERNAL_SERVER_ERROR: 500,
    SC_LENGTH_REQUIRED: 411,
    SC_LOCKED: 423,
    SC_METHOD_FAILURE: 420,
    SC_METHOD_NOT_ALLOWED: 405,
    SC_MOVED_PERMANENTLY: 301,
    SC_MOVED_TEMPORARILY: 302,
    SC_MULTIPLE_CHOICES: 300,
    SC_MULTI_STATUS: 207,
    SC_NON_AUTHORITATIVE_INFORMATION: 203,
    SC_NOT_ACCEPTABLE: 406,
    SC_NOT_FOUND: 404,
    SC_NOT_IMPLEMENTED: 501,
    SC_NOT_MODIFIED: 304,
    SC_NO_CONTENT: 204,
    SC_OK: 200,
    SC_PARTIAL_CONTENT: 206,
    SC_PAYMENT_REQUIRED: 402,
    SC_PRECONDITION_FAILED: 412,
    SC_PROCESSING: 102,
    SC_PROXY_AUTHENTICATION_REQUIRED: 407,
    SC_REQUESTED_RANGE_NOT_SATISFIABLE: 416,
    SC_REQUEST_TIMEOUT: 408,
    SC_REQUEST_TOO_LONG: 413,
    SC_REQUEST_URI_TOO_LONG: 414,
    SC_RESET_CONTENT: 205,
    SC_SEE_OTHER: 303,
    SC_SERVICE_UNAVAILABLE: 503,
    SC_SWITCHING_PROTOCOLS: 101,
    SC_TEMPORARY_REDIRECT: 307,
    SC_UNAUTHORIZED: 401,
    SC_UNPROCESSABLE_ENTITY: 422,
    SC_UNSUPPORTED_MEDIA_TYPE: 415,
    SC_USE_PROXY: 305,
};

module.exports = {
    HTTP_STATUS,
    createNewHttpClient,
    getMediaData,
    getPageData,
};
