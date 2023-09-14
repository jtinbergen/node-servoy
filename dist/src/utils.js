"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringReplace = exports.stringPosition = exports.stringPatternCount = exports.stringToNumber = exports.stringRightWords = exports.stringMiddleWords = exports.stringLeftWords = exports.stringWordCount = exports.stringTrim = exports.stringRight = exports.stringMiddle = exports.stringLeft = exports.stringInitCap = exports.stringIndexReplace = exports.numberFormat = exports.getUnicodeCharacter = void 0;
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
const stringWordCount = (text) => {
    return (text || '').split(' ').length;
};
exports.stringWordCount = stringWordCount;
const stringLeftWords = (text, numberOfWords) => {
    return text.split(' ').slice(0, numberOfWords).join(' ');
};
exports.stringLeftWords = stringLeftWords;
const stringMiddleWords = (text, start, numberOfWords) => {
    return text
        .split(' ')
        .slice(start - 1, start - 1 + numberOfWords)
        .join(' ');
};
exports.stringMiddleWords = stringMiddleWords;
const stringRightWords = (text, numberOfWords) => {
    return text.split(' ').slice(-numberOfWords).join(' ');
};
exports.stringRightWords = stringRightWords;
const stringToNumber = (textString, decimalSeparator) => {
    return parseFloat((textString || '').replace(/[^0-9.]/g, '').replace('.', decimalSeparator));
};
exports.stringToNumber = stringToNumber;
const stringPatternCount = (text, toSearchFor) => {
    return (text.match(new RegExp(toSearchFor, 'g')) || []).length;
};
exports.stringPatternCount = stringPatternCount;
const stringPosition = (textString, toSearchFor, start, occurrence) => {
    const positions = [];
    let pos = textString.indexOf(toSearchFor, start - 1);
    while (pos !== -1) {
        positions.push(pos);
        pos = textString.indexOf(toSearchFor, pos + 1);
    }
    return positions[occurrence - 1] + 1 || -1;
};
exports.stringPosition = stringPosition;
const stringReplace = (text, searchText, replacementText) => {
    return text.replace(new RegExp(searchText, 'g'), replacementText);
};
exports.stringReplace = stringReplace;
//# sourceMappingURL=utils.js.map