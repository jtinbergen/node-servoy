import * as https from 'https';
import * as http from 'http';
import * as url from 'url';

class HttpResponse {
    data: any;
    headers: any;
    statusCode: any;

    constructor({ data, statusCode, headers }: { data: any; statusCode: any; headers: any }) {
        this.data = data;
        this.headers = headers;
        this.statusCode = statusCode;
    }

    public getStatusCode() {
        return this.statusCode;
    }

    public getResponseBody() {
        return this.data.toString();
    }

    public getResponseHeaders(header?: string) {
        if (!header) {
            return this.headers;
        }

        return this.headers[header];
    }

    public getMediaData() {
        return this.data;
    }

    public getCharset() {
        return 'utf-8';
    }

    public close() {
        return true;
    }
}

class HttpRequest {
    options: any;
    charSet: any;
    body: Buffer;
    mimeType: any;

    constructor(options: any) {
        this.options = options;
    }

    addHeader(headerName: string, value: any) {
        this.options.headers = this.options.headers || {};
        this.options.headers[headerName] = value;
        return this.options.headers[headerName] === value;
    }

    setCharset(charSet: any) {
        this.charSet = charSet;
    }

    setBodyContent(content: any, mimeType: any) {
        this.body = Buffer.from(content);
        this.mimeType = mimeType;
    }

    async executeAsyncRequest(
        username?: Function,
        password?: Function,
        workstation?: Function,
        domain?: Function,
        successCallbackMethod?: Function,
        errorCallbackMethod?: Function,
    ) {
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
            let buffer: any = Buffer.alloc(0);
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

    async executeRequest(
        username?: Function,
        password?: Function,
        workstation?: Function,
        domain?: Function,
    ): Promise<HttpResponse> {
        return new Promise((resolve, reject) => {
            const client =
                this.options.tls || (this.options.protocol && this.options.protocol === 'https:')
                    ? https
                    : http;
            this.options.headers = this.options.headers || {};
            if (this.body) {
                this.options.headers['Content-type'] =
                    this.options.headers['Content-type'] || 'application/json';
                this.options.headers['Content-length'] = this.body.length;
            }

            const req = client.request(this.options, (res) => {
                let data = Buffer.alloc(0);
                res.on('data', (newData) => {
                    data = Buffer.concat([data, newData]);
                });

                res.on('end', () => {
                    resolve(
                        new HttpResponse({
                            headers: res.headers,
                            statusCode: res.statusCode,
                            data,
                        }),
                    );
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
    static defaultTimeout: number;

    constructor() {
        HttpClient.defaultTimeout = 30000;
    }

    static createRequest(type: string, uri: string) {
        const correctedUrl = uri.indexOf('http') !== 0 ? `http://${uri}` : uri;
        const urlInformation = url.parse(correctedUrl);
        return new HttpRequest({
            timeout: this.defaultTimeout || 60000,
            hostname: urlInformation.hostname,
            protocol: urlInformation.protocol,
            port: urlInformation.port || (urlInformation.protocol === 'https:' ? 443 : 80),
            path: urlInformation.path,
            method: type,
        });
    }

    createGetRequest(uri: string) {
        return HttpClient.createRequest('GET', uri);
    }

    createHeadRequest(uri: string) {
        return HttpClient.createRequest('HEAD', uri);
    }

    createOptionsRequest(uri: string) {
        return HttpClient.createRequest('OPTIONS', uri);
    }

    createPostRequest(uri: string) {
        return HttpClient.createRequest('POST', uri);
    }

    createPutRequest(uri: string) {
        return HttpClient.createRequest('PUT', uri);
    }

    createTraceRequest(uri: string) {
        return HttpClient.createRequest('TRACE', uri);
    }

    createDeleteRequest(uri: string) {
        return HttpClient.createRequest('DELETE', uri);
    }

    getCookie(cookieName: string) {
        throw new Error('Not implemented.');
    }

    getCookies() {
        throw new Error('Not implemented.');
    }

    setClientProxyCredentials(userName: string, password: string) {
        throw new Error('Not implemented.');
    }

    setCookie(
        cookieName: string,
        cookieValue: string,
        domain: string,
        path: string,
        maxAge: number,
        secure: boolean,
    ) {
        throw new Error('Not implemented.');
    }

    setTimeout(msTimeout: number) {
        HttpClient.defaultTimeout = msTimeout;
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

export { HTTP_STATUS, createNewHttpClient, getMediaData, getPageData };
