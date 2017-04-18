const https = require('https');
const http = require('http');
const url = require('url');

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
                let buffer = Buffer.alloc(0);
                res.on('data', (data) => {
                    buffer = Buffer.concat([buffer, data]);
                });

                res.on('end', () => {
                    resolve(buffer);
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

module.exports = {
    createNewHttpClient,
    getMediaData,
    getPageData,
};
