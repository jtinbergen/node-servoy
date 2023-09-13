"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToJSFile = exports.writeTXTFile = exports.writeFile = exports.streamFilesToServer = exports.streamFilesFromServer = exports.readTXTFile = exports.readFile = exports.openFile = exports.moveFile = exports.getRemoteFolderContents = exports.getModificationDate = exports.getHomeFolder = exports.getFolderContents = exports.getFileSize = exports.getDiskList = exports.getDesktopFolder = exports.getDefaultUploadLocation = exports.deleteFolder = exports.deleteFile = exports.createTempFile = exports.createFolder = exports.createFile = exports.copyFolder = exports.copyFile = exports.convertToRemoteJSFile = exports.appendToTXTFile = exports.JSFile = void 0;
const os = require("os");
const fs = require("fs");
const path = require("path");
const open = require("open");
class JSFile {
    constructor(filename) {
        this.filename = filename;
    }
    refreshInformation() {
        return new Promise((resolve, reject) => {
            fs.stat(this.filename, (error, info) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(info);
            });
        });
    }
    testForPermission(type) {
        return new Promise((resolve, reject) => {
            fs.access(this.filename, type, (err) => {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    }
    async canRead() {
        return this.testForPermission(fs.constants.R_OK);
    }
    async canWrite() {
        return this.testForPermission(fs.constants.W_OK);
    }
    createNewFile() { }
    deleteFile() {
        fs.unlinkSync(this.filename);
    }
    getAbsolutePath() {
        return path.parse(path.resolve(this.filename)).dir;
    }
    exists() {
        return fs.existsSync(this.getAbsoluteFile());
    }
    getAbsoluteFile() {
        return path.resolve(this.filename);
    }
    getContentType() {
        return 'application/octet-stream';
    }
    getName() {
        return path.parse(this.filename).base;
    }
    getParent() { }
    getParentFile() { }
    getPath() {
        return path.parse(path.resolve(this.filename)).dir;
    }
    isAbsolute() {
        return path.resolve(this.filename) === this.filename;
    }
    isDirectory() {
        return fs.existsSync(this.filename) && fs.lstatSync(this.filename).isDirectory();
    }
    isFile() {
        return fs.existsSync(this.filename) && fs.lstatSync(this.filename).isFile();
    }
    isHidden() {
        return false;
    }
    lastModified() {
        return fs.statSync(this.filename).mtime;
    }
    list() {
        throw new Error('Not implemented');
    }
    listFiles() {
        throw new Error('Not implemented');
    }
    mkdir() {
        throw new Error('Not implemented');
    }
    mkdirs() {
        throw new Error('Not implemented');
    }
    renameTo() {
        throw new Error('Not implemented');
    }
    async getBytes() {
        if (!this.exists()) {
            return Buffer.from([]);
        }
        return new Promise((resolve, reject) => {
            fs.readFile(this.getAbsoluteFile(), (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(data);
            });
        });
    }
    setBytes(bytes, createFile) {
        if (!this.exists() && !createFile) {
            return false;
        }
        return new Promise((resolve, reject) => {
            const stream = fs.createWriteStream(this.getAbsoluteFile(), {});
            stream.on('finish', () => resolve(true));
            stream.on('error', (error) => reject(error));
            if (bytes) {
                stream.write(Buffer.from(bytes));
            }
            stream.end();
        });
    }
    setLastModified() {
        return false;
    }
    setReadOnly() {
        return false;
    }
    size() {
        const stats = fs.statSync(this.filename);
        return stats.size;
    }
}
exports.JSFile = JSFile;
const appendToTXTFile = async (file, content) => {
    const jsfile = file instanceof JSFile ? file : new JSFile(file);
    const oldcontent = await jsfile.getBytes();
    return jsfile.setBytes(Buffer.concat([oldcontent, Buffer.from(content)]), true);
};
exports.appendToTXTFile = appendToTXTFile;
const convertToRemoteJSFile = (filename) => new JSFile(filename);
exports.convertToRemoteJSFile = convertToRemoteJSFile;
const copyFile = (source, target) => new Promise((resolve, reject) => {
    let cbCalled = false;
    function done(error) {
        if (!cbCalled) {
            cbCalled = true;
            if (error) {
                reject(error);
                return;
            }
            resolve();
        }
    }
    const readableStream = fs.createReadStream(source);
    readableStream.on('error', (err) => {
        done(err);
    });
    const writableStream = fs.createWriteStream(target);
    writableStream.on('error', (error) => {
        done(error);
    });
    writableStream.on('close', () => {
        done();
    });
    readableStream.pipe(writableStream);
});
exports.copyFile = copyFile;
const copyFolder = () => { };
exports.copyFolder = copyFolder;
const createFile = convertToRemoteJSFile;
exports.createFile = createFile;
const createFolder = () => { };
exports.createFolder = createFolder;
const createTempFile = async (prefix, postfix) => {
    const temporaryFilename = path.join(os.tmpdir(), `${prefix}${(Math.random() * 1000000).toFixed(0)}${postfix}`);
    const temporaryFile = new JSFile(temporaryFilename);
    await temporaryFile.setBytes(null, true);
    return temporaryFile;
};
exports.createTempFile = createTempFile;
const deleteFile = (file) => {
    const fullpath = file instanceof JSFile ? file.getAbsoluteFile() : file;
    return new Promise((resolve, reject) => {
        fs.unlink(fullpath, (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
};
exports.deleteFile = deleteFile;
const deleteFolder = (deletePath) => new Promise((resolve, reject) => {
    fs.rmdir(deletePath, (err) => {
        if (err) {
            reject(err);
            return;
        }
        resolve();
    });
});
exports.deleteFolder = deleteFolder;
const getDefaultUploadLocation = () => os.tmpdir();
exports.getDefaultUploadLocation = getDefaultUploadLocation;
const getDesktopFolder = () => { };
exports.getDesktopFolder = getDesktopFolder;
const getDiskList = () => { };
exports.getDiskList = getDiskList;
const getFileSize = () => { };
exports.getFileSize = getFileSize;
const getFolderContents = () => { };
exports.getFolderContents = getFolderContents;
const getHomeFolder = () => { };
exports.getHomeFolder = getHomeFolder;
const getModificationDate = () => { };
exports.getModificationDate = getModificationDate;
const getRemoteFolderContents = () => { };
exports.getRemoteFolderContents = getRemoteFolderContents;
const moveFile = (oldPath, newPath) => new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            reject(err);
            return;
        }
        resolve();
    });
});
exports.moveFile = moveFile;
const openFile = (jsfile) => {
    open(jsfile.getAbsoluteFile());
};
exports.openFile = openFile;
const readFile = async (file, size) => new Promise((resolve, reject) => {
    const filename = file instanceof JSFile ? file.getAbsoluteFile() : file;
    fs.readFile(filename, (error, data) => {
        if (error) {
            reject(error);
            return;
        }
        if (data.length > size) {
            resolve(data.slice(0, size));
        }
        resolve(data);
    });
});
exports.readFile = readFile;
const readTXTFile = async (file) => {
    const contents = await readFile(file);
    return contents.toString();
};
exports.readTXTFile = readTXTFile;
const streamFilesFromServer = () => { };
exports.streamFilesFromServer = streamFilesFromServer;
const streamFilesToServer = () => { };
exports.streamFilesToServer = streamFilesToServer;
const writeFile = (file, content) => {
    const jsfile = file instanceof JSFile ? file : new JSFile(file);
    return jsfile.setBytes(content, true);
};
exports.writeFile = writeFile;
const writeTXTFile = writeFile;
exports.writeTXTFile = writeTXTFile;
const convertToJSFile = convertToRemoteJSFile;
exports.convertToJSFile = convertToJSFile;
//# sourceMappingURL=file.js.map