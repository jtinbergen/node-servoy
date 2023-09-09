import { JSColumn } from '../JSColumn';
import { JSDataSet } from '../JSDataSet';

export const JasperTypeToJavaClass = (type: JSColumn) => {
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
};

export class JRColumn {
    name: string;
    columnHeader: string;
    jasperColumnType: JSColumn;
    javaClass: string;
    estimatedWidth: number;

    constructor(
        name: string,
        columnHeader: string,
        jasperColumnType: JSColumn,
        javaClass: string,
        width: number,
    ) {
        this.name = name;
        this.columnHeader = columnHeader;
        this.jasperColumnType = jasperColumnType;
        this.javaClass = javaClass;
        this.estimatedWidth = width;
    }
}

type Job = {
    dataset: JSDataSet;
    json?: string;
};

export class JasperPluginRMI {
    OUTPUT_FORMAT: { [key: string]: string };

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

    public convertDatasetToJasperJSON(job: Job) {
        const dataset = job.dataset;
        return new Promise((resolve, reject) => {
            if (!dataset) {
                return reject('Missing argument: dataset');
            }

            const json: any = { rows: [] };

            for (let row = 1; row <= dataset.getMaxRowIndex(); row += 1) {
                const record: { [key: string]: any } = {};
                for (let column = 1; column <= dataset.getMaxColumnIndex(); column += 1) {
                    record[dataset.getColumnName(column)] = dataset.getValue(row, column);
                }

                json.rows.push(record);
            }

            job.json = JSON.stringify(json);
            return resolve(job);
        });
    }

    public runReport(dataset: any, filename: any, args: any, outputFormat: any, parameters: any) {
        throw new Error('Not implemented');
    }
}
