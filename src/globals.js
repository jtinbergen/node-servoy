const sqlTextField = (text, maxLength) => {
  let sanitizedText = text
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
  if (maxLength < sanitizedText.length) {
    sanitizedText = sanitizedText.substr(0, maxLength);
  }

  sanitizedText = sanitizedText.replace(/'/g, "''");
  return `'${sanitizedText}'`;
};

const format = (arg) => {
  const args = Array.prototype.slice.call(arguments, 1);
  return arg.replace(/{(\d+)}/g, (match, number) =>
    typeof args[number] !== 'undefined' ? args[number] : match,
  );
};

const sql = (query, args) => {
  while (query.indexOf('?') > -1) {
    let arg = args.shift();
    if (typeof arg === 'string') {
      arg = `'${arg}'`;
    }

    query = query.replace('?', arg);
  }

  return query;
};

module.exports = {
  sql,
  format,
};
