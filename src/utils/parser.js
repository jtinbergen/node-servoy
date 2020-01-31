const IDENTIFIER = 1;
const BRACKET_OPEN = 2;
const BRACKET_CLOSE = 3;
const CURLY_OPEN = 4;
const CURLY_CLOSE = 5;
const DOUBLEQUOTE = 6;
const COMMA = 7;
const COLON = 8;
const NUMBER = 9;
const CARRIAGERETURN = 10;
const LINEFEED = 11;
const STRING = 12;
const BOOLEAN = 13;
const NULL = 14;
const WHITESPACE = 15;

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
        type: BOOLEAN,
        value: value === 'true',
      });
      return;
    }

    if (value === 'null') {
      tokens.push({
        type: NULL,
      });
      return;
    }

    tokens.push({
      type: IDENTIFIER,
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
      type: NUMBER,
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
      type: STRING,
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
        type: WHITESPACE,
      });
      pos += 1;
    }
    matchCharacter('\r', CARRIAGERETURN, true);
    matchCharacter('\n', LINEFEED, true);
    matchCharacter('[', BRACKET_OPEN, true);
    matchCharacter(']', BRACKET_CLOSE, true);
    matchCharacter('{', CURLY_OPEN, true);
    matchCharacter('}', CURLY_CLOSE, true);
    matchCharacter(',', COMMA, true);
    matchCharacter(':', COLON, true);
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
      throw new Error(
        `Stuck tokenizing: position ${pos} (${code.charCodeAt(pos)})`,
      );
    }
  }
  return tokens;
};

const tokenToString = (token) => {
  if (token.type === IDENTIFIER) {
    return token.value;
  }

  if (token.type === NUMBER) {
    return token.value;
  }

  if (token.type === STRING) {
    return `"${token.value}"`;
  }

  if (token.type === COLON) {
    return ':';
  }

  if (token.type === COMMA) {
    return ',';
  }

  if (token.type === BRACKET_OPEN) {
    return '[';
  }

  if (token.type === BRACKET_CLOSE) {
    return ']';
  }

  if (token.type === CURLY_OPEN) {
    return '{';
  }

  if (token.type === CURLY_CLOSE) {
    return '}';
  }

  if (token.type === DOUBLEQUOTE) {
    return '"';
  }

  if (token.type === CARRIAGERETURN) {
    return '\r';
  }

  if (token.type === LINEFEED) {
    return '\n';
  }

  if (token.type === BOOLEAN) {
    return token.value;
  }

  if (token.type === NULL) {
    return '"null"';
  }

  return '';
};

const expectIdentifier = (state) => {
  if (state.tokens[state.pos].type !== IDENTIFIER) {
    throw new Error('Expected identifier');
  }

  return state.tokens[state.pos++].value;
};

const expect = (state, type) => {
  if (state.tokens[state.pos].type !== type) {
    throw new Error(
      `Expected type ${type} but got ${state.tokens[state.pos].type}`,
    );
  }

  state.pos++;
};

const nextIs = (state, type) =>
  state.pos < state.tokens.length && state.tokens[state.pos].type === type;

const eatWhitespace = (state) => {
  while (nextIs(state, WHITESPACE)) {
    expect(state, WHITESPACE);
  }
};

const expectValue = (state) => {
  if (nextIs(state, BRACKET_OPEN)) {
    expect(state, BRACKET_OPEN);
    const array = [];
    let continueLoop = true;
    while (continueLoop && !nextIs(state, BRACKET_CLOSE)) {
      array.push(expectValue(state));
      continueLoop = nextIs(state, COMMA);
      if (continueLoop) {
        expect(state, COMMA);
      }
    }
    expect(state, BRACKET_CLOSE);
    return array;
  }

  if (nextIs(state, CURLY_OPEN)) {
    const obj = expectObject(state);
    return obj;
  }

  if (
    state.tokens[state.pos].type !== NULL &&
    state.tokens[state.pos].type !== BOOLEAN &&
    state.tokens[state.pos].type !== NUMBER &&
    state.tokens[state.pos].type !== STRING
  ) {
    throw new Error(`Expected value but got ${state.tokens[state.pos].type}`);
  }

  return state.tokens[state.pos++].value;
};

const expectObject = (state) => {
  expect(state, CURLY_OPEN);
  const object = {};
  let continueLoop = true;
  while (continueLoop && !nextIs(state, CURLY_CLOSE)) {
    const propertyName = expectIdentifier(state);
    eatWhitespace(state);
    expect(state, COLON);
    eatWhitespace(state);
    object[propertyName] = expectValue(state);
    if (nextIs(state, COMMA)) {
      expect(state, COMMA);
    } else {
      continueLoop = false;
    }
  }
  expect(state, CURLY_CLOSE);
  return object;
};

const parser = (tokens) => {
  const state = {
    pos: 0,
    tokens: tokens
      .filter((token) => token.type !== LINEFEED)
      .filter((token) => token.type !== CARRIAGERETURN),
  };
  const object = {};
  let continueLoop = true;
  if (nextIs(state, DOUBLEQUOTE)) {
    expect(state, DOUBLEQUOTE);
  }
  while (continueLoop) {
    const propertyName = expectIdentifier(state);
    eatWhitespace(state);
    expect(state, COLON);
    eatWhitespace(state);
    object[propertyName] = expectValue(state);
    if (nextIs(state, COMMA)) {
      expect(state, COMMA);
    } else {
      continueLoop = false;
    }
  }
  if (nextIs(state, DOUBLEQUOTE)) {
    expect(state, DOUBLEQUOTE);
  }
  return object;
};

module.exports = {
  tokenToString,
  read: (code) => {
    const tokens = tokenizer(code);
    return parser(tokens);
  },
};
