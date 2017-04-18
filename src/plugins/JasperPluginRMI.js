const JSColumn = require('../JSDataSet');

function JasperTypeToJavaClass(type) {
    let javaClass;
    switch (type) {
    case JSColumn.TEXT:
        javaClass = 'java.lang.String';
        break;
    case JSColumn.NUMBER:
        javaClass = 'java.lang.Double';
        break;
    case JSColumn.INTEGER:
        javaClass = 'java.lang.Integer';
        break;
    case JSColumn.DATETIME:
        javaClass = 'java.util.Date';
        break;
    default:
        javaClass = 'java.lang.String';
    }

    return javaClass;
}

function JRColumn(_name, _columnHeader, _jasperColumnType, _javaClass, _width) {
    this.name = _name || '';
    this.columnHeader = _columnHeader || this.name;
    this.jasperColumnType = _jasperColumnType || JSColumn.TEXT;
    this.javaClass = _javaClass || JasperTypeToJavaClass(this.jasperColumnType);
    this.estimatedWidth = _width || 50;
}

class JasperPluginRMI {
    constructor() {
        this.OUTPUT_FORMAT = {
            PDF: 'pdf',
            EXCEL: 'excel',
            RTF: 'rtf',
            DOCX: 'docx',
            CSV: 'csv',
            HTML: 'html',
        };
    }

    convertDatasetToJasperJSON(job) {
        const dataset = job.dataset;
        return new Promise((resolve, reject) => {
            if (!dataset) {
                return reject('Missing argument: dataset');
            }

            const json = {
                rows: [],
            };

            for (let row = 1; row <= this.dataset.getMaxRowIndex(); row += 1) {
                const record = {};
                for (let column = 1; column <= this.dataset.getMaxColumnIndex(); column += 1) {
                    record[this.dataset.getColumnName(column)] = this.dataset.getValue(row, column);
                }

                json.rows.push(record);
            }

            job.json = JSON.stringify(json);
            return resolve(job);
        });
    }

    runReport(dataset, filename, args, outputFormat, parameters) {
    }
}

module.exports = JasperPluginRMI;
