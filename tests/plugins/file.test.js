const fs = require('fs');
const path = require('path');
const os = require('os');
const file = require('../../src/plugins/file');

test('appendToTXTFile works', async () => {
    const TESTDATA = 'Test data';
    const TESTFILE = path.join(os.tmpdir(), (Math.random() * 1000000).toFixed(0));
    await file.appendToTXTFile(TESTFILE, TESTDATA);
    await file.appendToTXTFile(TESTFILE, TESTDATA);
    expect(fs.readFileSync(TESTFILE).toString()).toEqual(TESTDATA + TESTDATA);
});

test('convertToRemoteJSFile works', async () => {
    const TESTFILE = path.join(os.tmpdir(), 'test');
    const jsfile = file.convertToRemoteJSFile(TESTFILE);
    expect(jsfile instanceof file.JSFile).toBe(true);
    expect(jsfile.getAbsolutePath()).toEqual(TESTFILE);
});

test('copyFile works', async () => {
    const TESTDATA = 'Test data';
    const TESTFILE = path.join(os.tmpdir(), (Math.random() * 1000000).toFixed(0));
    const TESTFILE2 = path.join(os.tmpdir(), (Math.random() * 1000000).toFixed(0));
    await file.appendToTXTFile(TESTFILE, TESTDATA);
    await file.copyFile(TESTFILE, TESTFILE2);
    expect(fs.readFileSync(TESTFILE).toString()).toEqual(TESTDATA);
    expect(fs.readFileSync(TESTFILE2).toString()).toEqual(TESTDATA);
});

test('createFile works', async () => {
    const TESTFILE = path.join(os.tmpdir(), (Math.random() * 1000000).toFixed(0));
    const f1 = file.createFile(TESTFILE);
    expect(f1.exists()).toBe(false);
});

test('copyFolder works', async () => {
});

test('createTempFile works', async () => {
    const f1 = await file.createTempFile('PREFIX', 'POSTFIX');
    expect(f1.exists()).toBe(true);
    expect(f1.getAbsolutePath().indexOf('PREFIX')).not.toBe(-1);
    expect(f1.getAbsolutePath().indexOf('POSTFIX')).not.toBe(-1);
});

test('deleteFile works', async () => {
    const TESTDATA = 'Test data';
    const TESTFILE = path.join(os.tmpdir(), (Math.random() * 1000000).toFixed(0));
    await file.appendToTXTFile(TESTFILE, TESTDATA);
    const f1 = file.convertToJSFile(TESTFILE);
    expect(f1.exists()).toBe(true);
    await file.deleteFile(f1.getAbsolutePath());
    expect(f1.exists()).toBe(false);
});

test('deleteFolder works', async () => {
});

test('getDefaultUploadLocation works', async () => {
    expect(file.getDefaultUploadLocation()).toBe(os.tmpdir());
});

test('getDesktopFolder works', async () => {
});

test('getDiskList works', async () => {
});

test('getFileSize works', async () => {
});

test('getFolderContents works', async () => {
});

test('getHomeFolder works', async () => {
});

test('getModificationDate works', async () => {
});

test('getRemoteFolderContents works', async () => {
});

test('moveFile works', async () => {
    const TESTDATA = 'Test data';
    const TESTFILE = path.join(os.tmpdir(), (Math.random() * 1000000).toFixed(0));
    const TESTFILE2 = path.join(os.tmpdir(), (Math.random() * 1000000).toFixed(0));
    await file.appendToTXTFile(TESTFILE, TESTDATA);
    await file.moveFile(TESTFILE, TESTFILE2);
    const f1 = file.convertToJSFile(TESTFILE);
    const f2 = file.convertToJSFile(TESTFILE2);
    expect(f1.exists()).toBe(false);
    expect(f2.exists()).toBe(true);
});

test('openFile works', async () => {
});

test('readFile works', async () => {
    const TESTDATA = 'Test data';
    const TESTFILE = path.join(os.tmpdir(), (Math.random() * 1000000).toFixed(0));
    await file.appendToTXTFile(TESTFILE, TESTDATA);
    const content = await file.readFile(TESTFILE);
    expect(content.toString()).toEqual(TESTDATA);
});

test('readTXTFile works', async () => {
    const TESTDATA = 'Test data';
    const TESTFILE = path.join(os.tmpdir(), (Math.random() * 1000000).toFixed(0));
    await file.appendToTXTFile(TESTFILE, TESTDATA);
    expect(await file.readTXTFile(TESTFILE)).toEqual(TESTDATA);
});

test('streamFilesFromServer works', async () => {
});

test('streamFilesToServer works', async () => {
});

test('writeFile works', async () => {
    const TESTFILE = path.join(os.tmpdir(), (Math.random() * 1000000).toFixed(0));
    const f1 = file.convertToJSFile(TESTFILE);
    await file.writeFile(f1, [65, 66, 67]);
    expect(fs.readFileSync(TESTFILE).toString()).toEqual('ABC');
});

test('writeTXTFile works', async () => {
    const TESTDATA = 'Test data';
    const TESTFILE = path.join(os.tmpdir(), (Math.random() * 1000000).toFixed(0));
    const TESTFILE2 = path.join(os.tmpdir(), (Math.random() * 1000000).toFixed(0));
    const f1 = file.convertToJSFile(TESTFILE);
    await file.writeTXTFile(f1, TESTDATA);
    await file.writeTXTFile(TESTFILE2, TESTDATA);
    expect(fs.readFileSync(TESTFILE).toString()).toEqual(TESTDATA);
    expect(fs.readFileSync(TESTFILE2).toString()).toEqual(TESTDATA);
});

test('convertToJSFile works', async () => {
    const TESTFILE = path.join(os.tmpdir(), 'test');
    const jsfile = file.convertToRemoteJSFile(TESTFILE);
    expect(jsfile instanceof file.JSFile).toBe(true);
    expect(jsfile.getAbsolutePath()).toEqual(TESTFILE);
});
