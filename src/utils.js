const dateFormat = (date, format) => {};
const getUnicodeCharacter = (unicodeCharacterNumber) => {};
const hasRecords = (foundset) => {};
const isMondayFirstDayOfWeek = () => {};
const numberFormat = (number, digits) => {};
const parseDate = (date, format) => {};
const stringEscapeMarkup = (
  textString,
  escapeSpaces,
  convertToHtmlUnicodeEscapes,
) => {};
const stringFormat = (textToFormat, parameters) => {};
const stringIndexReplace = (text, start, size, replacementText) => {};
const stringInitCap = (text) => {};
const stringLeft = (text, size) => (text || '').substr(0, size);
const stringLeftWords = (text, numberOfWords) => {};
const stringMD5HashBase16 = (textString) => {};
const stringMD5HashBase64 = (textString) => {};
const stringMiddle = (text, start, size) =>
  (text || '').substr(start - 1, size);
const stringMiddleWords = (text, start, numberOfWords) => {};
const stringPBKDF2Hash = (textString, iterations) => {};
const stringPatternCount = (text, toSearchFor) => {};
const stringPosition = (textString, toSearchFor, start, occurrence) => {};
const stringReplace = (text, searchText, replacementText) => {};
const stringReplaceTags = (text, scriptable) => {};
const dateForstringRightmat = (text, size) => {};
const stringRightWords = (text, numberOfWords) => {};
const stringToNumber = (textString, decimalSeparator) => {};
const stringTrim = (textString) => (textString || '').trim();
const stringWordCount = (text) => {};
const timestampToDate = (date) => {};
const validatePBKDF2Hash = (password, hash) => {};

module.exports = {
  dateFormat,
  getUnicodeCharacter,
  hasRecords,
  isMondayFirstDayOfWeek,
  numberFormat,
  parseDate,
  stringEscapeMarkup,
  stringFormat,
  stringIndexReplace,
  stringInitCap,
  stringLeft,
  stringLeftWords,
  stringMD5HashBase16,
  stringMD5HashBase64,
  stringMiddle,
  stringMiddleWords,
  stringPBKDF2Hash,
  stringPatternCount,
  stringPosition,
  stringReplace,
  stringReplaceTags,
  dateForstringRightmat,
  stringRightWords,
  stringToNumber,
  stringTrim,
  stringWordCount,
  timestampToDate,
  validatePBKDF2Hash,
};
