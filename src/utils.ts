/**
 * Returns a string containing the character for the unicode number.
 * @param unicodeCharacterNumber The number indicating the unicode character.
 * @returns {string} A string containing the unicode character.
 */
const getUnicodeCharacter = (unicodeCharacterNumber: number): string => {
    return String.fromCharCode(unicodeCharacterNumber);
};

/**
 * Format a number to have a defined fraction.
 * @param number The number to format.
 * @param digits Number of digits.
 * @returns {string} The resulting number in text.
 */
const numberFormat = (number: number, digits: number): string => {
    return number.toFixed(digits);
};

/**
 * Replaces a portion of a string with replacement text from a specified index.
 * @param text The text to process.
 * @param start The start index to work from.
 * @param size The size of the text to replace.
 * @param replacementText The replacement text.
 * @returns {string} The changed text.
 */
const stringIndexReplace = (
    text: string,
    start: number,
    size: number,
    replacementText: string,
): string => {
    return `${text.substring(0, start - 1)}${replacementText}${text.substring(start + size - 1)}`;
};

/**
 * Returns all words starting with capital chars.
 * @param text The text to process.
 * @returns {string} The changed text.
 */
const stringInitCap = (text: string): string => {
    return (text || '').replace(/(?:^|\s)\S/g, (a) => {
        return a.toUpperCase();
    });
};

/**
 * Returns a string with the requested number of characters, starting from the left.
 * @param text The text to process.
 * @param size The size of the text to return.
 * @returns {string} The resulting text.
 */
const stringLeft = (text: string, size: number): string => {
    return (text || '').substring(0, size);
};

/**
 * Returns a substring from the original string.
 * @param text The text to process.
 * @param start The start index to work from.
 * @param size The size of the text to return.
 * @returns {string} The resulting text.
 */
const stringMiddle = (text: string, start: number, size: number): string => {
    return (text || '').substring(start - 1, start - 1 + size);
};

/**
 * Returns a string with the requested number of characters, starting from the right.
 * @param text The text to process.
 * @param size The size of the text to return.
 * @returns {string} The resulting text.
 */
const stringRight = (text: string, size: number): string => {
    return text.substring(text.length - size);
};

/**
 * Returns the string without leading or trailing spaces.
 * @param textString The text to process.
 * @returns {string} The resulting trimmed string.
 */
const stringTrim = (textString: string): string => {
    return (textString || '').trim();
};

/**
 * Returns the number of words in the text string.
 * @param text The text to process
 * @returns {number} The word count.
 */
const stringWordCount = (text: string): number => {
    return (text || '').split(' ').length;
};

/**
 * Returns the number of words, starting from the left.
 * @param text The text to process.
 * @param numberOfWords The number of words to return.
 * @returns {string} The string with number of words from the left.
 */
const stringLeftWords = (text: string, numberOfWords: number): string => {
    return text.split(' ').slice(0, numberOfWords).join(' ');
};

/**
 * Returns a substring from the original string.
 * @param text The text to process.
 * @param start The start index to work from.
 * @param numberOfWords The number of words to return.
 * @returns {string} The resulting text.
 */
const stringMiddleWords = (text: string, start: number, numberOfWords: number): string => {
    return text
        .split(' ')
        .slice(start - 1, start - 1 + numberOfWords)
        .join(' ');
};

/**
 * Returns the number of words, starting from the right.
 * @param text The text to process.
 * @param numberOfWords The number of words to return.
 * @returns {string} The string with number of words from the right.
 */
const stringRightWords = (text: string, numberOfWords: number): string => {
    return text.split(' ').slice(-numberOfWords).join(' ');
};

/**
 * Filters characters out of from a string and leaves digits, returns the number. Decimal separator is specified as parameter.
 * @param textString The text to process.
 * @param decimalSeparator Decimal separator.
 * @returns {number} The resulting number.
 */
const stringToNumber = (textString: string, decimalSeparator: string): number => {
    return parseFloat((textString || '').replace(/[^0-9.]/g, '').replace('.', decimalSeparator));
};

/**
 * Returns the number of times searchString appears in textString.
 * @param text The text to process.
 * @param toSearchFor The string to search for.
 * @returns {number} The number of times the search string is found in the text.
 */
const stringPatternCount = (text: string, toSearchFor: string): number => {
    return (text.match(new RegExp(toSearchFor, 'g')) || []).length;
};

/**
 * Returns the position of the string to search for, from a certain start position and occurrence.
 * @param textString The text to process.
 * @param toSearchFor The string to search.
 * @param start The start index to search from.
 * @param occurrence The occurence.
 * @returns {number} The position of the string to search for.
 */
const stringPosition = (
    textString: string,
    toSearchFor: string,
    start: number,
    occurrence: number,
): number => {
    const positions = [];
    let pos = textString.indexOf(toSearchFor, start - 1);
    while (pos !== -1) {
        positions.push(pos);
        pos = textString.indexOf(toSearchFor, pos + 1);
    }

    return positions[occurrence - 1] + 1 || -1;
};

/**
 * Replaces a portion of a string with replacement text.
 * @param text The text to process.
 * @param searchText The string to search.
 * @param replacementText The replacement text.
 * @returns {string} The changed text.
 */
const stringReplace = (text: string, searchText: string, replacementText: string): string => {
    return text.replace(new RegExp(searchText, 'g'), replacementText);
};

export {
    getUnicodeCharacter,
    numberFormat,
    stringIndexReplace,
    stringInitCap,
    stringLeft,
    stringMiddle,
    stringRight,
    stringTrim,
    stringWordCount,
    stringLeftWords,
    stringMiddleWords,
    stringRightWords,
    stringToNumber,
    stringPatternCount,
    stringPosition,
    stringReplace,
};
