"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JasperPluginRMI = exports.JRColumn = exports.JasperTypeToJavaClass = void 0;
const JSColumn_1 = require("../JSColumn");
const JasperTypeToJavaClass = (type) => {
    let javaClass;
    switch (type) {
        case JSColumn_1.JSColumn.TEXT:
            javaClass = 'java.lang.String';
            break;
        case JSColumn_1.JSColumn.NUMBER:
            javaClass = 'java.lang.Double';
            break;
        case JSColumn_1.JSColumn.INTEGER:
            javaClass = 'java.lang.Integer';
            break;
        case JSColumn_1.JSColumn.DATETIME:
            javaClass = 'java.util.Date';
            break;
        default:
            javaClass = 'java.lang.String';
    }
    return javaClass;
};
exports.JasperTypeToJavaClass = JasperTypeToJavaClass;
class JRColumn {
    constructor(name, columnHeader, jasperColumnType, javaClass, width) {
        this.name = name;
        this.columnHeader = columnHeader;
        this.jasperColumnType = jasperColumnType;
        this.javaClass = javaClass;
        this.estimatedWidth = width;
    }
}
exports.JRColumn = JRColumn;
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
            const json = { rows: [] };
            for (let row = 1; row <= dataset.getMaxRowIndex(); row += 1) {
                const record = {};
                for (let column = 1; column <= dataset.getMaxColumnIndex(); column += 1) {
                    record[dataset.getColumnName(column)] = dataset.getValue(row, column);
                }
                json.rows.push(record);
            }
            job.json = JSON.stringify(json);
            return resolve(job);
        });
    }
    runReport(dataset, filename, args, outputFormat, parameters) {
        throw new Error('Not implemented');
    }
}
exports.JasperPluginRMI = JasperPluginRMI;
//# sourceMappingURL=JasperPluginRMI.js.map