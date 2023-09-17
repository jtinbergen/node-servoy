import * as pg from 'pg';
import * as fs from 'fs';

declare const sqlTextField: (text: string, maxLength: number) => string;
declare function format(arg: string): string;
declare const sql: (query: string, args: any[]) => string;

declare const globals_format: typeof format;
declare const globals_sql: typeof sql;
declare const globals_sqlTextField: typeof sqlTextField;
declare namespace globals {
  export {
    globals_format as format,
    globals_sql as sql,
    globals_sqlTextField as sqlTextField,
  };
}

declare enum JSColumn {
    DATABASE_IDENTITY = 0,
    DATABASE_SEQUENCE = 1,
    DATETIME = 2,
    EXCLUDED_COLUMN = 3,
    INTEGER = 4,
    MEDIA = 5,
    NONE = 6,
    NUMBER = 7,
    PK_COLUMN = 8,
    ROWID_COLUMN = 9,
    SERVOY_SEQUENCE = 10,
    TENANT_COLUMN = 14,
    TEXT = 11,
    UUID_COLUMN = 12,
    UUID_GENERATOR = 13
}

type JSDatasetParameters = {
    rows?: string;
    columns?: string;
};
declare class ColumnInfo {
    name: string;
    type: JSColumn;
    position?: any;
    default?: any;
    nullable?: any;
    length?: any;
    primary?: any;
    constructor({ name, type }?: {
        name?: string;
        type?: JSColumn;
    });
}
declare class JSDataSet {
    rowIndex: number;
    rows: any[];
    columns: any[];
    constructor(json?: JSDatasetParameters);
    getMaxRowIndex(): number;
    getMaxColumnIndex(): number;
    getColumnType(index: number): JSColumn;
    getColumnName(index: number): string;
    getColumnNames(): string[];
    addColumn(name?: string, index?: number, type?: JSColumn): void;
    addRow(index: number | any[], array?: any[]): void;
    removeRow(index: number): void;
    getAsHTML(escape_values: boolean, escape_spaces: boolean, multi_line_markup: boolean, pretty_indent: boolean, add_column_names: boolean): string;
    getColumnAsArray(column: number): any[] | null;
    getRowAsArray(row: number): any[] | null;
    getValue(row: number, col: number): any;
    setValue(row: number, col: number, value: any): any;
    removeColumn(col: number): void;
    sort(col: number, sort_direction: boolean): void;
}

declare class JSRecordMarkers {
    hasErrors: boolean;
    onBeforeInsertFailed: boolean;
    onBeforeUpdateFailed: boolean;
    record: JSRecord;
    constructor(hasErrors: boolean, onBeforeInsertFailed: boolean, onBeforeUpdateFailed: boolean, record: JSRecord);
    getGenericExceptions(): void;
    getMarkers(level?: number): void;
    report(message: string, dataprovider: string, level: number, customObject: any, messageKeyParams: any[]): void;
}

declare class JSRecord {
    exception: string | null;
    foundset: JSFoundSet;
    recordMarkers: JSRecordMarkers;
    unsavedChanges: any[];
    [key: string]: any;
    constructor({ databaseManager, foundset, record, }: {
        databaseManager: any;
        foundset: JSFoundSet;
        record: any;
    });
    createMarkers(): JSRecordMarkers;
    getChangedData(): JSDataSet;
    getDataSource(): string;
    getPKs(): any[];
    hasChangedData(): boolean;
    isEditing(): boolean;
    isNew(): boolean;
    isRelatedFoundSetLoaded(relationName: string): boolean;
    revertChanges(): void;
}

declare class JSTable {
    server: any;
    tableName: string;
    databaseManager: DatabaseManager;
    serverName: string;
    columns: ColumnInfo[];
    constructor({ databaseManager, tableName, serverName, server, }: {
        databaseManager: DatabaseManager;
        tableName: string;
        serverName: string;
        server: any;
    });
    initialize(): Promise<void>;
    getColumn(columnName: string): ColumnInfo;
    getColumnNames(): string[];
    getDataSource(): string;
    getQuotedSQLName(): string;
    getRowIdentifierColumnNames(): void;
    getSQLName(): string;
    getServerName(): string;
    isMetadataTable(): boolean;
}

declare class PostgresServer {
    settings: any;
    tables: Map<string, JSTable>;
    pg_types: {
        [key: number]: JSColumn;
    };
    openConnections: pg.Client[];
    availableConnections: pg.Client[];
    databaseManagerInstance: DatabaseManagerInstance;
    constructor(databaseManagerInstance: DatabaseManagerInstance, settings: any);
    getOpenConnectionCount(): number;
    getAvailableConnectionCount(): number;
    connectToDatabase(): Promise<pg.Client>;
    closeAllConnections(): void;
    getDatabaseProductName(callback: Function): Promise<JSDataSet>;
    getTables(): Promise<void>;
    sql(query: string, args: any): string;
    getClient(): Promise<{
        getDataSetByQuery: (sqlQuery: string, args: any[], maxReturnedRows: number) => Promise<JSDataSet>;
    }>;
    convertToJSColumn(pgType: JSColumn, name: string): JSColumn;
    getTable(serverName: string, tableName: string): Promise<JSTable>;
}

type Server = {
    name: string;
    poolSize?: number;
    connectionString: string;
};
declare class DatabaseManager {
    servers: Map<string, PostgresServer>;
    autoSave: boolean;
    constructor();
    registerServer(server: Server): void;
    unregisterServer(serverName: string): void;
    getServer(serverName: string): PostgresServer | undefined;
    getTable(serverName: string, tableName: string): Promise<JSTable>;
    setAutoSave(autoSave: boolean): boolean;
    getInstance(): DatabaseManagerInstance;
}

type Filter = {
    serverName: string;
    tableName: string;
    dataprovider: string;
    operator: string;
    value: string;
    name: string;
};
declare class DatabaseManagerInstance {
    DatabaseManager: DatabaseManager;
    autoSave: boolean;
    aliasMapping: Map<string, string>;
    globalFilters: {
        [key: string]: Filter[];
    };
    constructor({ DatabaseManager }: {
        DatabaseManager: DatabaseManager;
    });
    aliasedServerName(serverName: string): string;
    getTableNames(serverName: string): Promise<any[] | null>;
    getAutoSave(): boolean;
    getDatabaseProductName(serverName: string): Promise<JSDataSet>;
    switchServer(sourceName: string, destinationName: string): void;
    addTableFilterParam(serverName: string, tableName: string, dataprovider: string, operator: string, value: string, name: string): void;
    getTableFilterParams(serverName: string): string[][];
    getDataSetByQuery(serverName: string, sqlQuery: string, args: any[], maxReturnedRows: number, callback?: Function): Promise<JSDataSet>;
    getFoundSet(serverName: string, tableName: string): Promise<JSFoundSet>;
    createEmptyDataSet(): JSDataSet;
    startTransaction(): void;
    rollbackTransaction(): void;
    commitTransaction(): void;
}

type JSFoundSetParameters = {
    databaseManager: DatabaseManagerInstance;
    tableName: string;
    serverName: string;
    table: JSTable;
};
declare class JSFoundSet {
    databaseManager: DatabaseManagerInstance;
    tableName: string;
    serverName: string;
    alldataproviders: string[];
    multiSelect: boolean;
    records: Map<number, JSRecord>;
    selectedIndexes: number[];
    constructor({ databaseManager, tableName, serverName, table }: JSFoundSetParameters);
    getRecords(from: number, to: number): Promise<void>;
    getRecord(recordIndex: number): Promise<JSRecord | null | undefined>;
    newRecord(): number;
    getSize(): Promise<number>;
}

declare enum LOGGINGLEVEL {
    DEBUG = 0,
    INFO = 1,
    WARNING = 2,
    ERROR = 3,
    FATAL = 4
}
declare enum APPLICATION_TYPES {
    HEADLESS_CLIENT = 0,
    MOBILE_CLIENT = 1,
    NG_CLIENT = 2,
    RUNTIME_CLIENT = 3,
    SMART_CLIENT = 4,
    WEB_CLIENT = 5
}

type constants_APPLICATION_TYPES = APPLICATION_TYPES;
declare const constants_APPLICATION_TYPES: typeof APPLICATION_TYPES;
type constants_LOGGINGLEVEL = LOGGINGLEVEL;
declare const constants_LOGGINGLEVEL: typeof LOGGINGLEVEL;
declare namespace constants {
  export {
    constants_APPLICATION_TYPES as APPLICATION_TYPES,
    constants_LOGGINGLEVEL as LOGGINGLEVEL,
  };
}

declare const executeProgram: (program: string, params: string, environmentVars: string[], cwd: any) => Promise<string>;
declare const executeProgramInBackground: (program: string, params: string, environmentVars: string[], cwd: any) => void;
declare const exit: () => never;
declare const getApplicationType: () => number;
declare const getHostName: () => string;
declare const getOSName: () => string;
declare const getServerTimeStamp: () => Date;
declare const getServerURL: () => string;
declare const getSolutionName: () => string;
declare const getSolutionRelease: () => number;
declare const getTimeStamp: () => Date;
declare const getUUID: (arg: string) => {
    toString: () => string;
    toBytes: () => ArrayBuffer;
};
declare const getVersion: () => string;
declare const isInDeveloper: () => boolean;
declare const output: (msg: any, level: LOGGINGLEVEL) => void;
declare const sleep: (ms: number) => Promise<number>;

declare const application_executeProgram: typeof executeProgram;
declare const application_executeProgramInBackground: typeof executeProgramInBackground;
declare const application_exit: typeof exit;
declare const application_getApplicationType: typeof getApplicationType;
declare const application_getHostName: typeof getHostName;
declare const application_getOSName: typeof getOSName;
declare const application_getServerTimeStamp: typeof getServerTimeStamp;
declare const application_getServerURL: typeof getServerURL;
declare const application_getSolutionName: typeof getSolutionName;
declare const application_getSolutionRelease: typeof getSolutionRelease;
declare const application_getTimeStamp: typeof getTimeStamp;
declare const application_getUUID: typeof getUUID;
declare const application_getVersion: typeof getVersion;
declare const application_isInDeveloper: typeof isInDeveloper;
declare const application_output: typeof output;
declare const application_sleep: typeof sleep;
declare namespace application {
  export {
    application_executeProgram as executeProgram,
    application_executeProgramInBackground as executeProgramInBackground,
    application_exit as exit,
    application_getApplicationType as getApplicationType,
    application_getHostName as getHostName,
    application_getOSName as getOSName,
    application_getServerTimeStamp as getServerTimeStamp,
    application_getServerURL as getServerURL,
    application_getSolutionName as getSolutionName,
    application_getSolutionRelease as getSolutionRelease,
    application_getTimeStamp as getTimeStamp,
    application_getUUID as getUUID,
    application_getVersion as getVersion,
    application_isInDeveloper as isInDeveloper,
    application_output as output,
    application_sleep as sleep,
  };
}

declare const getUnicodeCharacter: (unicodeCharacterNumber: number) => string;
declare const numberFormat: (number: number, digits: number) => string;
declare const stringIndexReplace: (text: string, start: number, size: number, replacementText: string) => string;
declare const stringInitCap: (text: string) => string;
declare const stringLeft: (text: string, size: number) => string;
declare const stringMiddle: (text: string, start: number, size: number) => string;
declare const stringRight: (text: string, size: number) => string;
declare const stringTrim: (textString: string) => string;
declare const stringWordCount: (text: string) => number;
declare const stringLeftWords: (text: string, numberOfWords: number) => string;
declare const stringMiddleWords: (text: string, start: number, numberOfWords: number) => string;
declare const stringRightWords: (text: string, numberOfWords: number) => string;
declare const stringToNumber: (textString: string, decimalSeparator: string) => number;
declare const stringPatternCount: (text: string, toSearchFor: string) => number;
declare const stringPosition: (textString: string, toSearchFor: string, start: number, occurrence: number) => number;
declare const stringReplace: (text: string, searchText: string, replacementText: string) => string;

declare const utils_getUnicodeCharacter: typeof getUnicodeCharacter;
declare const utils_numberFormat: typeof numberFormat;
declare const utils_stringIndexReplace: typeof stringIndexReplace;
declare const utils_stringInitCap: typeof stringInitCap;
declare const utils_stringLeft: typeof stringLeft;
declare const utils_stringLeftWords: typeof stringLeftWords;
declare const utils_stringMiddle: typeof stringMiddle;
declare const utils_stringMiddleWords: typeof stringMiddleWords;
declare const utils_stringPatternCount: typeof stringPatternCount;
declare const utils_stringPosition: typeof stringPosition;
declare const utils_stringReplace: typeof stringReplace;
declare const utils_stringRight: typeof stringRight;
declare const utils_stringRightWords: typeof stringRightWords;
declare const utils_stringToNumber: typeof stringToNumber;
declare const utils_stringTrim: typeof stringTrim;
declare const utils_stringWordCount: typeof stringWordCount;
declare namespace utils {
  export {
    utils_getUnicodeCharacter as getUnicodeCharacter,
    utils_numberFormat as numberFormat,
    utils_stringIndexReplace as stringIndexReplace,
    utils_stringInitCap as stringInitCap,
    utils_stringLeft as stringLeft,
    utils_stringLeftWords as stringLeftWords,
    utils_stringMiddle as stringMiddle,
    utils_stringMiddleWords as stringMiddleWords,
    utils_stringPatternCount as stringPatternCount,
    utils_stringPosition as stringPosition,
    utils_stringReplace as stringReplace,
    utils_stringRight as stringRight,
    utils_stringRightWords as stringRightWords,
    utils_stringToNumber as stringToNumber,
    utils_stringTrim as stringTrim,
    utils_stringWordCount as stringWordCount,
  };
}

declare const db: any[];
declare const mem: any[];

declare const datasources_db: typeof db;
declare const datasources_mem: typeof mem;
declare namespace datasources {
  export {
    datasources_db as db,
    datasources_mem as mem,
  };
}

declare class HttpResponse {
    data: any;
    headers: any;
    statusCode: any;
    constructor({ data, statusCode, headers }: {
        data: any;
        statusCode: any;
        headers: any;
    });
    getStatusCode(): any;
    getResponseBody(): any;
    getResponseHeaders(header?: string): any;
    getMediaData(): any;
    getCharset(): string;
    close(): boolean;
}
declare class HttpRequest {
    options: any;
    charSet: any;
    body: Buffer | null;
    mimeType: any;
    constructor(options: any);
    addHeader(headerName: string, value: any): boolean;
    setCharset(charSet: any): void;
    setBodyContent(content: any, mimeType: any): void;
    executeAsyncRequest(username?: Function, password?: Function, workstation?: Function, domain?: Function, successCallbackMethod?: Function, errorCallbackMethod?: Function): Promise<void>;
    executeRequest(username?: Function, password?: Function, workstation?: Function, domain?: Function): Promise<HttpResponse>;
}
declare class HttpClient {
    static defaultTimeout: number;
    constructor();
    static createRequest(type: string, uri: string): HttpRequest;
    createGetRequest(uri: string): HttpRequest;
    createHeadRequest(uri: string): HttpRequest;
    createOptionsRequest(uri: string): HttpRequest;
    createPostRequest(uri: string): HttpRequest;
    createPutRequest(uri: string): HttpRequest;
    createTraceRequest(uri: string): HttpRequest;
    createDeleteRequest(uri: string): HttpRequest;
    getCookie(cookieName: string): void;
    getCookies(): void;
    setClientProxyCredentials(userName: string, password: string): void;
    setCookie(cookieName: string, cookieValue: string, domain: string, path: string, maxAge: number, secure: boolean): void;
    setTimeout(msTimeout: number): void;
}
declare const createNewHttpClient: () => HttpClient;
declare const getMediaData: () => void;
declare const getPageData: () => void;
declare const HTTP_STATUS: {
    SC_ACCEPTED: number;
    SC_BAD_GATEWAY: number;
    SC_BAD_REQUEST: number;
    SC_CONFLICT: number;
    SC_CONTINUE: number;
    SC_CREATED: number;
    SC_EXPECTATION_FAILED: number;
    SC_FAILED_DEPENDENCY: number;
    SC_FORBIDDEN: number;
    SC_GATEWAY_TIMEOUT: number;
    SC_GONE: number;
    SC_HTTP_VERSION_NOT_SUPPORTED: number;
    SC_INSUFFICIENT_SPACE_ON_RESOURCE: number;
    SC_INSUFFICIENT_STORAGE: number;
    SC_INTERNAL_SERVER_ERROR: number;
    SC_LENGTH_REQUIRED: number;
    SC_LOCKED: number;
    SC_METHOD_FAILURE: number;
    SC_METHOD_NOT_ALLOWED: number;
    SC_MOVED_PERMANENTLY: number;
    SC_MOVED_TEMPORARILY: number;
    SC_MULTIPLE_CHOICES: number;
    SC_MULTI_STATUS: number;
    SC_NON_AUTHORITATIVE_INFORMATION: number;
    SC_NOT_ACCEPTABLE: number;
    SC_NOT_FOUND: number;
    SC_NOT_IMPLEMENTED: number;
    SC_NOT_MODIFIED: number;
    SC_NO_CONTENT: number;
    SC_OK: number;
    SC_PARTIAL_CONTENT: number;
    SC_PAYMENT_REQUIRED: number;
    SC_PRECONDITION_FAILED: number;
    SC_PROCESSING: number;
    SC_PROXY_AUTHENTICATION_REQUIRED: number;
    SC_REQUESTED_RANGE_NOT_SATISFIABLE: number;
    SC_REQUEST_TIMEOUT: number;
    SC_REQUEST_TOO_LONG: number;
    SC_REQUEST_URI_TOO_LONG: number;
    SC_RESET_CONTENT: number;
    SC_SEE_OTHER: number;
    SC_SERVICE_UNAVAILABLE: number;
    SC_SWITCHING_PROTOCOLS: number;
    SC_TEMPORARY_REDIRECT: number;
    SC_UNAUTHORIZED: number;
    SC_UNPROCESSABLE_ENTITY: number;
    SC_UNSUPPORTED_MEDIA_TYPE: number;
    SC_USE_PROXY: number;
};

declare const http_HTTP_STATUS: typeof HTTP_STATUS;
declare const http_createNewHttpClient: typeof createNewHttpClient;
declare const http_getMediaData: typeof getMediaData;
declare const http_getPageData: typeof getPageData;
declare namespace http {
  export {
    http_HTTP_STATUS as HTTP_STATUS,
    http_createNewHttpClient as createNewHttpClient,
    http_getMediaData as getMediaData,
    http_getPageData as getPageData,
  };
}

type MailTransporter = {
    sendEmail?: any;
    x?: boolean;
};
declare const setImplementation: (mailTransporter: MailTransporter) => void;
declare const createBinaryAttachment: (filename: string, data: any) => {
    filename: string;
    content: Buffer;
};
declare const sendMail: (to: string, from: string, subject: string, msgText: string, cc?: string, bcc?: string, attachments?: any[], overrideProperties?: boolean) => Promise<any>;
declare const sendBulkMail: (to: string, from: string, subject: string, msgText: string, cc?: string, bcc?: string, attachments?: any[], overrideProperties?: boolean) => Promise<any>;
declare const receiveMail: (username: any, password: any, leaveMsgsOnServer: any, receiveMode: any, onlyReceiveMsgWithSentDate: any, properties: any) => never;
declare const isValidEmailAddress: (email: string) => boolean;
declare const getPlainMailAddresses: (addressesString: string) => never;
declare const getLastSendMailExceptionMsg: () => never;
declare const getMailMessage: (binaryblobOrString: Buffer | string) => never;

declare const mail_createBinaryAttachment: typeof createBinaryAttachment;
declare const mail_getLastSendMailExceptionMsg: typeof getLastSendMailExceptionMsg;
declare const mail_getMailMessage: typeof getMailMessage;
declare const mail_getPlainMailAddresses: typeof getPlainMailAddresses;
declare const mail_isValidEmailAddress: typeof isValidEmailAddress;
declare const mail_receiveMail: typeof receiveMail;
declare const mail_sendBulkMail: typeof sendBulkMail;
declare const mail_sendMail: typeof sendMail;
declare const mail_setImplementation: typeof setImplementation;
declare namespace mail {
  export {
    mail_createBinaryAttachment as createBinaryAttachment,
    mail_getLastSendMailExceptionMsg as getLastSendMailExceptionMsg,
    mail_getMailMessage as getMailMessage,
    mail_getPlainMailAddresses as getPlainMailAddresses,
    mail_isValidEmailAddress as isValidEmailAddress,
    mail_receiveMail as receiveMail,
    mail_sendBulkMail as sendBulkMail,
    mail_sendMail as sendMail,
    mail_setImplementation as setImplementation,
  };
}

declare class JSFile {
    filename: string;
    constructor(filename: string);
    refreshInformation(): Promise<unknown>;
    testForPermission(type: number): Promise<unknown>;
    canRead(): Promise<unknown>;
    canWrite(): Promise<unknown>;
    createNewFile(): void;
    deleteFile(): void;
    getAbsolutePath(): string;
    exists(): boolean;
    getAbsoluteFile(): string;
    getContentType(): string;
    getName(): string;
    getParent(): void;
    getParentFile(): void;
    getPath(): string;
    isAbsolute(): boolean;
    isDirectory(): boolean;
    isFile(): boolean;
    isHidden(): boolean;
    lastModified(): Date;
    list(): void;
    listFiles(): void;
    mkdir(): void;
    mkdirs(): void;
    renameTo(): void;
    getBytes(): Promise<any>;
    setBytes(bytes: any, createFile: boolean): false | Promise<unknown>;
    setLastModified(): boolean;
    setReadOnly(): boolean;
    size(): number;
}
declare const appendToTXTFile: (file: string | JSFile, content: any) => Promise<unknown>;
declare const convertToRemoteJSFile: (filename: string) => JSFile;
declare const copyFile: (source: fs.PathLike, target: fs.PathLike) => Promise<void>;
declare const copyFolder: () => void;
declare const createFile: (filename: string) => JSFile;
declare const createFolder: () => void;
declare const createTempFile: (prefix: string, postfix: string) => Promise<JSFile>;
declare const deleteFile: (file: string | JSFile) => Promise<void>;
declare const deleteFolder: (deletePath: string) => Promise<void>;
declare const getDefaultUploadLocation: () => string;
declare const getDesktopFolder: () => void;
declare const getDiskList: () => void;
declare const getFileSize: () => void;
declare const getFolderContents: () => void;
declare const getHomeFolder: () => void;
declare const getModificationDate: () => void;
declare const getRemoteFolderContents: () => void;
declare const moveFile: (oldPath: fs.PathLike, newPath: fs.PathLike) => Promise<void>;
declare const openFile: (jsfile: JSFile) => void;
declare const readFile: (file: string | JSFile, size?: number) => Promise<Buffer>;
declare const readTXTFile: (file: string | JSFile) => Promise<string>;
declare const streamFilesFromServer: () => void;
declare const streamFilesToServer: () => void;
declare const writeFile: (file: string | JSFile, content: any) => false | Promise<unknown>;
declare const writeTXTFile: (file: string | JSFile, content: any) => false | Promise<unknown>;
declare const convertToJSFile: (filename: string) => JSFile;

type file_JSFile = JSFile;
declare const file_JSFile: typeof JSFile;
declare const file_appendToTXTFile: typeof appendToTXTFile;
declare const file_convertToJSFile: typeof convertToJSFile;
declare const file_convertToRemoteJSFile: typeof convertToRemoteJSFile;
declare const file_copyFile: typeof copyFile;
declare const file_copyFolder: typeof copyFolder;
declare const file_createFile: typeof createFile;
declare const file_createFolder: typeof createFolder;
declare const file_createTempFile: typeof createTempFile;
declare const file_deleteFile: typeof deleteFile;
declare const file_deleteFolder: typeof deleteFolder;
declare const file_getDefaultUploadLocation: typeof getDefaultUploadLocation;
declare const file_getDesktopFolder: typeof getDesktopFolder;
declare const file_getDiskList: typeof getDiskList;
declare const file_getFileSize: typeof getFileSize;
declare const file_getFolderContents: typeof getFolderContents;
declare const file_getHomeFolder: typeof getHomeFolder;
declare const file_getModificationDate: typeof getModificationDate;
declare const file_getRemoteFolderContents: typeof getRemoteFolderContents;
declare const file_moveFile: typeof moveFile;
declare const file_openFile: typeof openFile;
declare const file_readFile: typeof readFile;
declare const file_readTXTFile: typeof readTXTFile;
declare const file_streamFilesFromServer: typeof streamFilesFromServer;
declare const file_streamFilesToServer: typeof streamFilesToServer;
declare const file_writeFile: typeof writeFile;
declare const file_writeTXTFile: typeof writeTXTFile;
declare namespace file {
  export {
    file_JSFile as JSFile,
    file_appendToTXTFile as appendToTXTFile,
    file_convertToJSFile as convertToJSFile,
    file_convertToRemoteJSFile as convertToRemoteJSFile,
    file_copyFile as copyFile,
    file_copyFolder as copyFolder,
    file_createFile as createFile,
    file_createFolder as createFolder,
    file_createTempFile as createTempFile,
    file_deleteFile as deleteFile,
    file_deleteFolder as deleteFolder,
    file_getDefaultUploadLocation as getDefaultUploadLocation,
    file_getDesktopFolder as getDesktopFolder,
    file_getDiskList as getDiskList,
    file_getFileSize as getFileSize,
    file_getFolderContents as getFolderContents,
    file_getHomeFolder as getHomeFolder,
    file_getModificationDate as getModificationDate,
    file_getRemoteFolderContents as getRemoteFolderContents,
    file_moveFile as moveFile,
    file_openFile as openFile,
    file_readFile as readFile,
    file_readTXTFile as readTXTFile,
    file_streamFilesFromServer as streamFilesFromServer,
    file_streamFilesToServer as streamFilesToServer,
    file_writeFile as writeFile,
    file_writeTXTFile as writeTXTFile,
  };
}

declare const executeSQL: (serverName: string, table: string, sql: string) => Promise<boolean>;

declare const rawSQL_executeSQL: typeof executeSQL;
declare namespace rawSQL {
  export {
    rawSQL_executeSQL as executeSQL,
  };
}

declare enum TokenType {
    IDENTIFIER = 1,
    BRACKET_OPEN = 2,
    BRACKET_CLOSE = 3,
    CURLY_OPEN = 4,
    CURLY_CLOSE = 5,
    DOUBLEQUOTE = 6,
    COMMA = 7,
    COLON = 8,
    NUMBER = 9,
    CARRIAGERETURN = 10,
    LINEFEED = 11,
    STRING = 12,
    BOOLEAN = 13,
    NULL = 14,
    WHITESPACE = 15
}
type Token = {
    type: TokenType;
    value?: any;
};
declare const tokenToString: (token: Token) => any;
declare const read: (code: string) => any;

declare const parser_read: typeof read;
declare const parser_tokenToString: typeof tokenToString;
declare namespace parser {
  export {
    parser_read as read,
    parser_tokenToString as tokenToString,
  };
}

declare const plugins: {
    mail: typeof mail;
    http: typeof http;
    file: typeof file;
    rawSQL: typeof rawSQL;
};

export { DatabaseManager, JSColumn, JSDataSet, JSFoundSet, application, constants, datasources, globals, parser, plugins, utils };
