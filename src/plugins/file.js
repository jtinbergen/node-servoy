const os = require('os');
const fs = require('fs');
const path = require('path');
const open = require('open');

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

  createNewFile() {}

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
    // console.log(path.resolve(this.filename), this.filename);
    return path.resolve(this.filename);
  }

  getContentType() {
    return 'application/octet-stream';
  }

  getName() {
    return path.parse(this.filename).base;
  }

  getParent() {}

  getParentFile() {}

  getPath() {
    return path.parse(path.resolve(this.filename)).dir;
  }

  isAbsolute() {
    return path.resolve(this.filename) === this.filename;
  }

  isDirectory() {
    return (
      fs.existsSync(this.filename) && fs.lstatSync(this.filename).isDirectory()
    );
  }

  isFile() {
    return fs.existsSync(this.filename) && fs.lstatSync(this.filename).isFile();
  }

  isHidden() {
    // TODO: Report not implemented
    return false;
  }

  lastModified() {
    return fs.statSync(this.filename).mtime;
  }

  list() {}

  listFiles() {}

  mkdir() {}

  mkdirs() {}

  renameTo() {}

  getBytes() {
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

    return new Promise((resolve) => {
      const stream = fs.createWriteStream(this.getAbsoluteFile(), {});
      stream.on('finish', () => resolve(true));
      stream.on('error', (error) => {
        // TODO: Output error
        resolve(false);
      });
      stream.write(Buffer.from(bytes));
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

const appendToTXTFile = async (file, content) => {
  let jsfile = file;
  if (!(file instanceof JSFile)) {
    jsfile = new JSFile(file);
  }

  const oldcontent = await jsfile.getBytes();
  return jsfile.setBytes(
    Buffer.concat([oldcontent, Buffer.from(content)]),
    true,
  );
};

const convertToRemoteJSFile = (filename) => new JSFile(filename);

const copyFile = (source, target) =>
  new Promise((resolve, reject) => {
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

const copyFolder = () => {};
const createFile = convertToRemoteJSFile;
const createFolder = () => {};

const createTempFile = async (prefix, postfix) => {
  const temporaryFilename = path.join(
    os.tmpdir(),
    `${prefix}${(Math.random() * 1000000).toFixed(0)}${postfix}`,
  );
  const temporaryFile = new JSFile(temporaryFilename);
  await temporaryFile.setBytes([], true);
  return temporaryFile;
};

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

const deleteFolder = (deletePath) =>
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

const moveFile = (oldPath, newPath) =>
  new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });

const openFile = (jsfile) => {
  open(jsfile.getAbsoluteFile());
};

const readFile = async (file, size) =>
  new Promise((resolve, reject) => {
    const filename = file.getAbsoluteFile ? file.getAbsoluteFile() : file;
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

  return jsfile.setBytes(content, true);
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
