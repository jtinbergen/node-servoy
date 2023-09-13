"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringTrim = exports.stringRight = exports.stringMiddle = exports.stringLeft = exports.stringInitCap = exports.stringIndexReplace = exports.numberFormat = exports.getUnicodeCharacter = void 0;
const getUnicodeCharacter = (unicodeCharacterNumber) => {
    return String.fromCharCode(unicodeCharacterNumber);
};
exports.getUnicodeCharacter = getUnicodeCharacter;
const numberFormat = (number, digits) => {
    return number.toFixed(digits);
};
exports.numberFormat = numberFormat;
const stringIndexReplace = (text, start, size, replacementText) => {
    return `${text.substring(0, start - 1)}${replacementText}${text.substring(start + size - 1)}`;
};
exports.stringIndexReplace = stringIndexReplace;
const stringInitCap = (text) => {
    return (text || '').replace(/(?:^|\s)\S/g, (a) => {
        return a.toUpperCase();
    });
};
exports.stringInitCap = stringInitCap;
const stringLeft = (text, size) => {
    return (text || '').substring(0, size);
};
exports.stringLeft = stringLeft;
const stringMiddle = (text, start, size) => {
    return (text || '').substring(start - 1, start - 1 + size);
};
exports.stringMiddle = stringMiddle;
const stringRight = (text, size) => {
    return text.substring(text.length - size);
};
exports.stringRight = stringRight;
const stringTrim = (textString) => {
    return (textString || '').trim();
};
exports.stringTrim = stringTrim;
//# sourceMappingURL=utils.js.map