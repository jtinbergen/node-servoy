const sqlTextField = (text: string, maxLength: number) => {
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

function format(arg: string) {
    const args = Array.prototype.slice.call(arguments, 1);
    return arg.replace(/{(\d+)}/g, (match, number) =>
        typeof args[number] !== 'undefined' ? args[number] : match,
    );
}

const sql = (query: string, args: any[]) => {
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

export { sqlTextField, format, sql };
