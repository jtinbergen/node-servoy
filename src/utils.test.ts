import * as utils from './utils';

/**
 * All tests are based on samples in the documentation: https://wiki.servoy.com/display/DOCS/Utils
 */

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
    test('stringMiddle', async () => {
        expect(utils.stringMiddle('this is a test', 2, 3)).toBe('his');
    });

    test('stringRight', async () => {
        expect(utils.stringRight('this is a test', 6)).toBe('a test');
    });

    test('stringTrim', async () => {
        expect(utils.stringTrim('   text   ')).toBe('text');
    });

    test('stringWordCount', async () => {
        expect(utils.stringWordCount('this is a test')).toBe(4);
    });

    test('stringLeftWords', async () => {
        expect(utils.stringLeftWords('this is a test', 3)).toBe('this is a');
    });

    test('stringMiddleWords', async () => {
        expect(utils.stringMiddleWords('this is a test', 2, 2)).toBe('is a');
    });

    test('stringRightWords', async () => {
        expect(utils.stringRightWords('this is a test', 3)).toBe('is a test');
    });

    test('stringToNumber', async () => {
        expect(utils.stringToNumber('fg65gf.567', '.')).toBe(65.567);
    });

    test('stringPatternCount', async () => {
        expect(utils.stringPatternCount('this is a test', 'is')).toBe(2);
    });

    test('stringPosition', async () => {
        expect(utils.stringPosition('This is a test', 's', 1, 1)).toBe(4);
    });

    test('stringReplace', async () => {
        expect(utils.stringReplace('these are test 1 and test 2.', 'test', 'cow')).toBe(
            'these are cow 1 and cow 2.',
        );
    });
});
