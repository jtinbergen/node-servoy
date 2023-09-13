"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql = exports.format = exports.sqlTextField = void 0;
const sqlTextField = (text, maxLength) => {
    let sanitizedText = text
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
    if (maxLength < sanitizedText.length) {
        sanitizedText = sanitizedText.substring(0, maxLength);
    }
    sanitizedText = sanitizedText.replace(/'/g, "''");
    return `'${sanitizedText}'`;
};
exports.sqlTextField = sqlTextField;
function format(arg) {
    const args = Array.prototype.slice.call(arguments, 1);
    return arg.replace(/{(\d+)}/g, (match, number) => typeof args[number] !== 'undefined' ? args[number] : match);
}
exports.format = format;
const sql = (query, args) => {
    let result = query;
    while (result.indexOf('?') > -1) {
        let arg = args.shift();
        if (typeof arg === 'string') {
            arg = `'${arg}'`;
        }
        result = result.replace('?', arg);
    }
    return result;
};
exports.sql = sql;
//# sourceMappingURL=globals.js.map