"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const process = require("process");
const os = require("os");
const open = require("open");
const file = require("./file");
jest.mock('open');
describe('plugins.file', () => {
    describe('JSFile', () => {
        test('getAbsolutePath', async () => {
            const f = file.convertToJSFile('fixtures/test.text');
            await f.setBytes([], true);
            expect(f.exists()).toBe(true);
            expect(f.isAbsolute()).toBe(false);
            expect(f.isDirectory()).toBe(false);
            expect(f.isFile()).toBe(true);
            expect(f.isHidden()).toBe(false);
            await expect(f.canRead()).resolves.toBe(true);
            await expect(f.canWrite()).resolves.toBe(true);
            expect(f.lastModified()).toBeDefined();
            expect(f.getName()).toBe('test.text');
            expect(f.getPath()).toBe(path.join(process.cwd(), 'fixtures'));
            expect(f.getAbsolutePath()).toBe(path.join(process.cwd(), 'fixtures'));
            expect(f.getContentType()).toBe('application/octet-stream');
            expect(f.size()).toBe(0);
        });
    });
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
        expect(jsfile.getAbsoluteFile()).toEqual(TESTFILE);
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
    test.skip('copyFolder works', async () => { });
    test('createTempFile works', async () => {
        const f1 = await file.createTempFile('PREFIX', 'POSTFIX');
        expect(f1.exists()).toBe(true);
        expect(f1.getAbsoluteFile().indexOf('PREFIX')).not.toBe(-1);
        expect(f1.getAbsoluteFile().indexOf('POSTFIX')).not.toBe(-1);
    });
    test('deleteFile works', async () => {
        const TESTDATA = 'Test data';
        const TESTFILE = path.join(os.tmpdir(), (Math.random() * 1000000).toFixed(0));
        await file.appendToTXTFile(TESTFILE, TESTDATA);
        const f1 = file.convertToJSFile(TESTFILE);
        expect(f1.exists()).toBe(true);
        await file.deleteFile(f1.getAbsoluteFile());
        expect(f1.exists()).toBe(false);
    });
    test.skip('deleteFolder works', async () => { });
    test('getDefaultUploadLocation works', async () => {
        expect(file.getDefaultUploadLocation()).toBe(os.tmpdir());
    });
    test.skip('getDesktopFolder works', async () => { });
    test.skip('getDiskList works', async () => { });
    test.skip('getFileSize works', async () => { });
    test.skip('getFolderContents works', async () => { });
    test.skip('getHomeFolder works', async () => { });
    test.skip('getModificationDate works', async () => { });
    test.skip('getRemoteFolderContents works', async () => { });
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
        const myPDF = file.createFile(path.join(process.cwd(), 'fixtures', 'my.pdf'));
        myPDF.setBytes([65], true);
        file.openFile(myPDF);
        expect(open).toHaveBeenCalled();
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
    test('streamFilesFromServer works', async () => { });
    test('streamFilesToServer works', async () => { });
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
        expect(jsfile.getAbsoluteFile()).toEqual(TESTFILE);
    });
});
//# sourceMappingURL=file.test.js.map