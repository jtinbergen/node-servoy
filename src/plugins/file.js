const os = require('os');
const fs = require('fs');
const path = require('path');

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
                    reject(err);
                    return;
                }

                resolve();
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
        return (path.isAbsolute(this.filename) ? this.filename : path.resolve(this.filename));
    }

    exists() {
        return fs.existsSync(this.getAbsolutePath());
    }

    getAbsoluteFile() { }

    getContentType() { }

    getName() { }

    getParent() { }

    getParentFile() { }

    getPath() { }

    isAbsolute() { }

    isDirectory() { }

    isFile() { }

    isHidden() { }

    lastModified() { }

    list() { }

    listFiles() { }

    mkdir() { }

    mkdirs() { }

    renameTo() { }

    getBytes() {
        if (!this.exists()) {
            return Buffer.from([]);
        }

        return new Promise((resolve, reject) => {
            fs.readFile(this.getAbsolutePath(), (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(data);
            });
        });
    }

    setBytes(bytes, createFile) {
        return new Promise((resolve, reject) => {
            const stream = fs.createWriteStream(this.getAbsolutePath(), {});
            stream.on('finish', () => resolve());
            stream.on('error', error => reject(error));
            stream.write(Buffer.from(bytes));
            stream.end();
        });
    }

    setLastModified() { }

    setReadOnly() { }

    size() { }
}

const appendToTXTFile = async (file, content) => {
    let jsfile = file;
    if (!(file instanceof JSFile)) {
        jsfile = new JSFile(file);
    }

    const oldcontent = await jsfile.getBytes();
    return jsfile.setBytes(Buffer.concat([oldcontent, Buffer.from(content)]));
};

const convertToRemoteJSFile = filename => new JSFile(filename);

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

const copyFolder = () => { };
const createFile = convertToRemoteJSFile;
const createFolder = () => { };

const createTempFile = async (prefix, postfix) => {
    const temporaryFilename = path.join(os.tmpdir(), `${prefix}${(Math.random() * 1000000).toFixed(0)}${postfix}`);
    const temporaryFile = new JSFile(temporaryFilename);
    await temporaryFile.setBytes([]);
    return temporaryFile;
};

const deleteFile = (file) => {
    const fullpath = file instanceof JSFile ? file.getAbsolutePath() : file;
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

const deleteFolder = deletePath => new Promise((resolve, reject) => {
    fs.rmdir(deletePath, (err) => {
        if (err) {
            reject(err);
            return;
        }

        resolve();
    });
});

const getDefaultUploadLocation = () => os.tmpdir();
const getDesktopFolder = () => { };
const getDiskList = () => { };
const getFileSize = () => { };
const getFolderContents = () => { };
const getHomeFolder = () => { };
const getModificationDate = () => { };
const getRemoteFolderContents = () => { };

const moveFile = (oldPath, newPath) => new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            reject(err);
            return;
        }

        resolve();
    });
});

const openFile = () => { };

const readFile = async (file, size) => new Promise((resolve, reject) => {
    const filename = file.getAbsolutePath ? file.getAbsolutePath() : file;
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

const readTXTFile = async (file) => {
    const contents = await readFile(file);
    return contents.toString();
};

const streamFilesFromServer = () => {};
const streamFilesToServer = () => {};

const writeFile = (file, content) => {
    let jsfile = file;
    if (!(file instanceof JSFile)) {
        jsfile = new JSFile(file);
    }

    return jsfile.setBytes(content);
};

const writeTXTFile = writeFile;

const convertToJSFile = convertToRemoteJSFile;

module.exports = {
    JSFile,
    appendToTXTFile,
    convertToRemoteJSFile,
    copyFile,
    copyFolder,
    createFile,
    createFolder,
    createTempFile,
    deleteFile,
    deleteFolder,
    getDefaultUploadLocation,
    getDesktopFolder,
    getDiskList,
    getFileSize,
    getFolderContents,
    getHomeFolder,
    getModificationDate,
    getRemoteFolderContents,
    moveFile,
    openFile,
    readFile,
    readTXTFile,
    streamFilesFromServer,
    streamFilesToServer,
    writeFile,
    writeTXTFile,
    convertToJSFile,
};
