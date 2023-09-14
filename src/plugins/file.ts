import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as open from 'open';

class JSFile {
    filename: string;

    constructor(filename: string) {
        this.filename = filename;
    }

    public refreshInformation() {
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

    public testForPermission(type: number) {
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

    public async canRead() {
        return this.testForPermission(fs.constants.R_OK);
    }

    public async canWrite() {
        return this.testForPermission(fs.constants.W_OK);
    }

    public createNewFile() {}

    public deleteFile() {
        fs.unlinkSync(this.filename);
    }

    public getAbsolutePath() {
        return path.parse(path.resolve(this.filename)).dir;
    }

    public exists() {
        return fs.existsSync(this.getAbsoluteFile());
    }

    public getAbsoluteFile() {
        return path.resolve(this.filename);
    }

    public getContentType() {
        return 'application/octet-stream';
    }

    public getName() {
        return path.parse(this.filename).base;
    }

    public getParent() {}

    public getParentFile() {}

    public getPath() {
        return path.parse(path.resolve(this.filename)).dir;
    }

    public isAbsolute() {
        return path.resolve(this.filename) === this.filename;
    }

    public isDirectory() {
        return fs.existsSync(this.filename) && fs.lstatSync(this.filename).isDirectory();
    }

    public isFile() {
        return fs.existsSync(this.filename) && fs.lstatSync(this.filename).isFile();
    }

    public isHidden() {
        return false;
    }

    public lastModified() {
        return fs.statSync(this.filename).mtime;
    }

    public list() {
        throw new Error('Not implemented');
    }

    public listFiles() {
        throw new Error('Not implemented');
    }

    public mkdir() {
        throw new Error('Not implemented');
    }

    public mkdirs() {
        throw new Error('Not implemented');
    }

    public renameTo() {
        throw new Error('Not implemented');
    }

    public async getBytes(): Promise<any> {
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

    public setBytes(bytes: any, createFile: boolean) {
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

    public setLastModified() {
        return false;
    }

    public setReadOnly() {
        return false;
    }

    public size() {
        const stats = fs.statSync(this.filename);
        return stats.size;
    }
}

const appendToTXTFile = async (file: string | JSFile, content: any) => {
    const jsfile: JSFile = file instanceof JSFile ? file : new JSFile(file);
    const oldcontent = await jsfile.getBytes();
    return jsfile.setBytes(Buffer.concat([oldcontent, Buffer.from(content)]), true);
};

const convertToRemoteJSFile = (filename: string) => new JSFile(filename);

const copyFile = (source: fs.PathLike, target: fs.PathLike): Promise<void> =>
    new Promise((resolve, reject) => {
        let cbCalled = false;
        function done(error?: any) {
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

const copyFolder = () => {};
const createFile = convertToRemoteJSFile;
const createFolder = () => {};

const createTempFile = async (prefix: string, postfix: string) => {
    const temporaryFilename = path.join(
        os.tmpdir(),
        `${prefix}${(Math.random() * 1000000).toFixed(0)}${postfix}`,
    );
    const temporaryFile = new JSFile(temporaryFilename);
    await temporaryFile.setBytes(null, true);
    return temporaryFile;
};

const deleteFile = (file: string | JSFile): Promise<void> => {
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

const deleteFolder = (deletePath: string): Promise<void> =>
    new Promise((resolve, reject) => {
        fs.rmdir(deletePath, (err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });

const getDefaultUploadLocation = () => os.tmpdir();
const getDesktopFolder = () => {};
const getDiskList = () => {};
const getFileSize = () => {};
const getFolderContents = () => {};
const getHomeFolder = () => {};
const getModificationDate = () => {};
const getRemoteFolderContents = () => {};

const moveFile = (oldPath: fs.PathLike, newPath: fs.PathLike): Promise<void> =>
    new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });

const openFile = (jsfile: JSFile) => {
    open(jsfile.getAbsoluteFile());
};

const readFile = async (file: string | JSFile, size?: number): Promise<Buffer> =>
    new Promise((resolve, reject) => {
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

const readTXTFile = async (file: string | JSFile) => {
    const contents = await readFile(file);
    return contents.toString();
};

const streamFilesFromServer = () => {};
const streamFilesToServer = () => {};

const writeFile = (file: string | JSFile, content: any) => {
    const jsfile: JSFile = file instanceof JSFile ? file : new JSFile(file);
    return jsfile.setBytes(content, true);
};

const writeTXTFile = writeFile;

const convertToJSFile = convertToRemoteJSFile;

export {
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
