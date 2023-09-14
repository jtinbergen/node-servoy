"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.read = exports.tokenToString = void 0;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["IDENTIFIER"] = 1] = "IDENTIFIER";
    TokenType[TokenType["BRACKET_OPEN"] = 2] = "BRACKET_OPEN";
    TokenType[TokenType["BRACKET_CLOSE"] = 3] = "BRACKET_CLOSE";
    TokenType[TokenType["CURLY_OPEN"] = 4] = "CURLY_OPEN";
    TokenType[TokenType["CURLY_CLOSE"] = 5] = "CURLY_CLOSE";
    TokenType[TokenType["DOUBLEQUOTE"] = 6] = "DOUBLEQUOTE";
    TokenType[TokenType["COMMA"] = 7] = "COMMA";
    TokenType[TokenType["COLON"] = 8] = "COLON";
    TokenType[TokenType["NUMBER"] = 9] = "NUMBER";
    TokenType[TokenType["CARRIAGERETURN"] = 10] = "CARRIAGERETURN";
    TokenType[TokenType["LINEFEED"] = 11] = "LINEFEED";
    TokenType[TokenType["STRING"] = 12] = "STRING";
    TokenType[TokenType["BOOLEAN"] = 13] = "BOOLEAN";
    TokenType[TokenType["NULL"] = 14] = "NULL";
    TokenType[TokenType["WHITESPACE"] = 15] = "WHITESPACE";
})(TokenType || (TokenType = {}));
const tokenizer = (code) => {
    const tokens = [];
    let pos = 0;
    const parseIdentifier = () => {
        let value = '';
        while (/[a-zA-Z\-_0-9]/.test(code[pos]) && pos < code.length) {
            value += code[pos];
            pos += 1;
        }
        if (value === 'true' || value === 'false') {
            tokens.push({
                type: TokenType.BOOLEAN,
                value: value === 'true',
            });
            return;
        }
        if (value === 'null') {
            tokens.push({
                type: TokenType.NULL,
            });
            return;
        }
        tokens.push({
            type: TokenType.IDENTIFIER,
            value,
        });
    };
    const parseNumber = () => {
        let value = '';
        while (/[-0-9]/.test(code[pos]) && pos < code.length) {
            value += code[pos];
            pos += 1;
        }
        tokens.push({
            type: TokenType.NUMBER,
            value: parseFloat(value),
        });
    };
    const stringValue = () => {
        let value = '';
        pos += 1;
        while (code[pos] !== '"' && pos < code.length) {
            if (code[pos] === '\\') {
                pos += 1;
            }
            value += code[pos];
            pos += 1;
        }
        pos += 1;
        tokens.push({
            type: TokenType.STRING,
            value,
        });
    };
    const matchCharacter = (character, type, optional) => {
        if (code[pos] === character) {
            tokens.push({
                type,
            });
            pos += 1;
            return;
        }
        if (!optional) {
            throw new Error(`Expected character ${character}`);
        }
    };
    let counter = 0;
    while (pos < code.length) {
        counter += 1;
        while (code.charCodeAt(pos) === 32 || code.charCodeAt(pos) === 9) {
            tokens.push({
                type: TokenType.WHITESPACE,
            });
            pos += 1;
        }
        matchCharacter('\r', TokenType.CARRIAGERETURN, true);
        matchCharacter('\n', TokenType.LINEFEED, true);
        matchCharacter('[', TokenType.BRACKET_OPEN, true);
        matchCharacter(']', TokenType.BRACKET_CLOSE, true);
        matchCharacter('{', TokenType.CURLY_OPEN, true);
        matchCharacter('}', TokenType.CURLY_CLOSE, true);
        matchCharacter(',', TokenType.COMMA, true);
        matchCharacter(':', TokenType.COLON, true);
        if (code[pos] === '"') {
            stringValue();
            continue;
        }
        if (/[a-zA-Z]/.test(code[pos])) {
            parseIdentifier();
            continue;
        }
        if (/[-0-9]/.test(code[pos])) {
            parseNumber();
            continue;
        }
        if (counter > code.length) {
            throw new Error(`Stuck tokenizing: position ${pos} (${code.charCodeAt(pos)})`);
        }
    }
    return tokens;
};
const tokenToString = (token) => {
    if (token.type === TokenType.IDENTIFIER) {
        return token.value;
    }
    if (token.type === TokenType.NUMBER) {
        return token.value;
    }
    if (token.type === TokenType.STRING) {
        return `"${token.value}"`;
    }
    if (token.type === TokenType.COLON) {
        return ':';
    }
    if (token.type === TokenType.COMMA) {
        return ',';
    }
    if (token.type === TokenType.BRACKET_OPEN) {
        return '[';
    }
    if (token.type === TokenType.BRACKET_CLOSE) {
        return ']';
    }
    if (token.type === TokenType.CURLY_OPEN) {
        return '{';
    }
    if (token.type === TokenType.CURLY_CLOSE) {
        return '}';
    }
    if (token.type === TokenType.DOUBLEQUOTE) {
        return '"';
    }
    if (token.type === TokenType.CARRIAGERETURN) {
        return '\r';
    }
    if (token.type === TokenType.LINEFEED) {
        return '\n';
    }
    if (token.type === TokenType.BOOLEAN) {
        return token.value;
    }
    if (token.type === TokenType.NULL) {
        return '"null"';
    }
    return '';
};
exports.tokenToString = tokenToString;
const expectIdentifier = (state) => {
    if (state.tokens[state.pos].type !== TokenType.IDENTIFIER) {
        throw new Error('Expected identifier');
    }
    return state.tokens[state.pos++].value;
};
const expectType = (state, type) => {
    if (state.tokens[state.pos].type !== type) {
        throw new Error(`Expected type ${type} but got ${state.tokens[state.pos].type}`);
    }
    state.pos++;
};
const nextIs = (state, type) => state.pos < state.tokens.length && state.tokens[state.pos].type === type;
const eatWhitespace = (state) => {
    while (nextIs(state, TokenType.WHITESPACE)) {
        expectType(state, TokenType.WHITESPACE);
    }
};
const expectValue = (state) => {
    if (nextIs(state, TokenType.BRACKET_OPEN)) {
        expectType(state, TokenType.BRACKET_OPEN);
        const array = [];
        let continueLoop = true;
        while (continueLoop && !nextIs(state, TokenType.BRACKET_CLOSE)) {
            array.push(expectValue(state));
            continueLoop = nextIs(state, TokenType.COMMA);
            if (continueLoop) {
                expectType(state, TokenType.COMMA);
            }
        }
        expectType(state, TokenType.BRACKET_CLOSE);
        return array;
    }
    if (nextIs(state, TokenType.CURLY_OPEN)) {
        const obj = expectObject(state);
        return obj;
    }
    if (state.tokens[state.pos].type !== TokenType.NULL &&
        state.tokens[state.pos].type !== TokenType.BOOLEAN &&
        state.tokens[state.pos].type !== TokenType.NUMBER &&
        state.tokens[state.pos].type !== TokenType.STRING) {
        throw new Error(`Expected value but got ${state.tokens[state.pos].type}`);
    }
    return state.tokens[state.pos++].value;
};
const expectObject = (state) => {
    expectType(state, TokenType.CURLY_OPEN);
    const object = {};
    let continueLoop = true;
    while (continueLoop && !nextIs(state, TokenType.CURLY_CLOSE)) {
        const propertyName = expectIdentifier(state);
        eatWhitespace(state);
        expectType(state, TokenType.COLON);
        eatWhitespace(state);
        object[propertyName] = expectValue(state);
        if (nextIs(state, TokenType.COMMA)) {
            expectType(state, TokenType.COMMA);
        }
        else {
            continueLoop = false;
        }
    }
    expectType(state, TokenType.CURLY_CLOSE);
    return object;
};
const parser = (tokens) => {
    const state = {
        pos: 0,
        tokens: tokens
            .filter((token) => token.type !== TokenType.LINEFEED)
            .filter((token) => token.type !== TokenType.CARRIAGERETURN),
    };
    const object = {};
    let continueLoop = true;
    if (nextIs(state, TokenType.DOUBLEQUOTE)) {
        expectType(state, TokenType.DOUBLEQUOTE);
    }
    while (continueLoop) {
        const propertyName = expectIdentifier(state);
        eatWhitespace(state);
        expectType(state, TokenType.COLON);
        eatWhitespace(state);
        object[propertyName] = expectValue(state);
        if (nextIs(state, TokenType.COMMA)) {
            expectType(state, TokenType.COMMA);
        }
        else {
            continueLoop = false;
        }
    }
    if (nextIs(state, TokenType.DOUBLEQUOTE)) {
        expectType(state, TokenType.DOUBLEQUOTE);
    }
    return object;
};
const read = (code) => {
    const tokens = tokenizer(code);
    return parser(tokens);
};
exports.read = read;
//# sourceMappingURL=parser.js.map