// const dateFormat = (date, format) => {};

const getUnicodeCharacter = (unicodeCharacterNumber: number) => {
    return String.fromCharCode(unicodeCharacterNumber);
};

// const hasRecords = (foundset) => {};

// const isMondayFirstDayOfWeek = () => {};

const numberFormat = (number: number, digits: number) => {
    return number.toFixed(digits);
};

// const parseDate = (date: Date, format: string) => {};

// const stringEscapeMarkup = (textString, escapeSpaces, convertToHtmlUnicodeEscapes) => {};

// const stringFormat = (textToFormat, parameters) => {};

const stringIndexReplace = (text: string, start: number, size: number, replacementText: string) => {
    return `${text.substring(0, start - 1)}${replacementText}${text.substring(start + size - 1)}`;
};

const stringInitCap = (text: string) => {
    return (text || '').replace(/(?:^|\s)\S/g, (a) => {
        return a.toUpperCase();
    });
};

const stringLeft = (text: string, size: number) => {
    return (text || '').substring(0, size);
};

// const stringLeftWords = (text, numberOfWords) => {};

// const stringMD5HashBase16 = (textString) => {};

// const stringMD5HashBase64 = (textString) => {};

const stringMiddle = (text: string, start: number, size: number) => {
    return (text || '').substring(start - 1, start - 1 + size);
};

const stringRight = (text: string, size: number) => {
    return text.substring(text.length - size);
};

// const stringMiddleWords = (text, start, numberOfWords) => {};

// const stringPBKDF2Hash = (textString, iterations) => {};

// const stringPatternCount = (text, toSearchFor) => {};

// const stringPosition = (textString, toSearchFor, start, occurrence) => {};

// const stringReplace = (text, searchText, replacementText) => {};

// const stringReplaceTags = (text, scriptable) => {};

// const dateForstringRightmat = (text, size) => {};

// const stringRightWords = (text, numberOfWords) => {};

// const stringToNumber = (textString, decimalSeparator) => {};

const stringTrim = (textString: string) => {
    return (textString || '').trim();
};

// const stringWordCount = (text) => {};

// const timestampToDate = (date) => {};

// const validatePBKDF2Hash = (password, hash) => {};

export {
    // dateFormat,
    getUnicodeCharacter,
    // hasRecords,
    // isMondayFirstDayOfWeek,
    numberFormat,
    // parseDate,
    // stringEscapeMarkup,
    // stringFormat,
    stringIndexReplace,
    stringInitCap,
    stringLeft,
    // stringLeftWords,
    // stringMD5HashBase16,
    // stringMD5HashBase64,
    stringMiddle,
    stringRight,
    // stringMiddleWords,
    // stringPBKDF2Hash,
    // stringPatternCount,
    // stringPosition,
    // stringReplace,
    // stringReplaceTags,
    // dateForstringRightmat,
    // stringRightWords,
    // stringToNumber,
    stringTrim,
    // stringWordCount,
    // timestampToDate,
    // validatePBKDF2Hash,
};
