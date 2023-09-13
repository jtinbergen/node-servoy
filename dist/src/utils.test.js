"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("./utils");
describe('utils', () => {
    test('getUnicodeCharacter', async () => {
        expect(utils.getUnicodeCharacter(9679)).toEqual('●');
    });
    test('numberFormat', async () => {
        expect(utils.numberFormat(16.749, 2)).toEqual('16.75');
    });
    test('stringIndexReplace', async () => {
        expect(utils.stringIndexReplace('this is a test', 6, 2, 'was')).toBe('this was a test');
    });
    test('stringInitCap', async () => {
        expect(utils.stringInitCap('This is A test')).toBe('This Is A Test');
    });
    test('stringLeft', async () => {
        expect(utils.stringLeft('this is a test', 6)).toBe('this i');
    });
    test('stringRight', async () => {
        expect(utils.stringRight('this is a test', 6)).toBe('a test');
    });
    test('stringMiddle', async () => {
        expect(utils.stringMiddle('this is a test', 2, 3)).toBe('his');
    });
    test('stringTrim', async () => {
        expect(utils.stringTrim('   text   ')).toBe('text');
    });
});
//# sourceMappingURL=utils.test.js.map