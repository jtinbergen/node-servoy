enum TokenType {
    IDENTIFIER = 1,
    BRACKET_OPEN = 2,
    BRACKET_CLOSE = 3,
    CURLY_OPEN = 4,
    CURLY_CLOSE = 5,
    DOUBLEQUOTE = 6,
    COMMA = 7,
    COLON = 8,
    NUMBER = 9,
    CARRIAGERETURN = 10,
    LINEFEED = 11,
    STRING = 12,
    BOOLEAN = 13,
    NULL = 14,
    WHITESPACE = 15,
}

type Token = {
    type: TokenType;
    value?: any;
};

type State = {
    tokens: Token[];
    pos: number;
};

const tokenizer = (code: string) => {
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

    const matchCharacter = (character: string, type: TokenType, optional: boolean) => {
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

const tokenToString = (token: Token) => {
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

const expectIdentifier = (state: State) => {
    if (state.tokens[state.pos].type !== TokenType.IDENTIFIER) {
        throw new Error('Expected identifier');
    }

    return state.tokens[state.pos++].value;
};

const expectType = (state: State, type: TokenType) => {
    if (state.tokens[state.pos].type !== type) {
        throw new Error(`Expected type ${type} but got ${state.tokens[state.pos].type}`);
    }

    state.pos++;
};

const nextIs = (state: State, type: TokenType) =>
    state.pos < state.tokens.length && state.tokens[state.pos].type === type;

const eatWhitespace = (state: State) => {
    while (nextIs(state, TokenType.WHITESPACE)) {
        expectType(state, TokenType.WHITESPACE);
    }
};

const expectValue = (state: State): any => {
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

    if (
        state.tokens[state.pos].type !== TokenType.NULL &&
        state.tokens[state.pos].type !== TokenType.BOOLEAN &&
        state.tokens[state.pos].type !== TokenType.NUMBER &&
        state.tokens[state.pos].type !== TokenType.STRING
    ) {
        throw new Error(`Expected value but got ${state.tokens[state.pos].type}`);
    }

    return state.tokens[state.pos++].value;
};

const expectObject = (state: State) => {
    expectType(state, TokenType.CURLY_OPEN);
    const object: any = {};
    let continueLoop = true;
    while (continueLoop && !nextIs(state, TokenType.CURLY_CLOSE)) {
        const propertyName = expectIdentifier(state);
        eatWhitespace(state);
        expectType(state, TokenType.COLON);
        eatWhitespace(state);
        object[propertyName] = expectValue(state);
        if (nextIs(state, TokenType.COMMA)) {
            expectType(state, TokenType.COMMA);
        } else {
            continueLoop = false;
        }
    }
    expectType(state, TokenType.CURLY_CLOSE);
    return object;
};

const parser = (tokens: Token[]) => {
    const state = {
        pos: 0,
        tokens: tokens
            .filter((token: Token) => token.type !== TokenType.LINEFEED)
            .filter((token: Token) => token.type !== TokenType.CARRIAGERETURN),
    };
    const object: any = {};
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
        } else {
            continueLoop = false;
        }
    }
    if (nextIs(state, TokenType.DOUBLEQUOTE)) {
        expectType(state, TokenType.DOUBLEQUOTE);
    }
    return object;
};

const read = (code: string): any => {
    const tokens = tokenizer(code);
    return parser(tokens);
};

export { tokenToString, read };
