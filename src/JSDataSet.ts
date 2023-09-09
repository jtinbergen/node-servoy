import { JSColumn } from './JSColumn';

export class ColumnInfo {
    name: string;
    type: JSColumn;
    position?: any;
    default?: any;
    nullable?: any;
    length?: any;
    primary?: any;

    constructor({ name, type }: { name?: string; type?: JSColumn } = {}) {
        this.name = name || '?column?';
        this.type = type || JSColumn.TEXT;
    }
}

export class JSDataSet {
    rowIndex: number = 0;
    rows: any[] = [];
    columns: any[] = [];

    constructor(json?: any) {
        if (!(this instanceof JSDataSet)) {
            return new JSDataSet();
        }

        if (json && json.rows && json.columns) {
            this.rows = JSON.parse(json.rows);
            this.columns = JSON.parse(json.columns);
        }
    }

    public getMaxRowIndex() {
        return this.rows.length;
    }

    public getMaxColumnIndex() {
        return this.columns.length;
    }

    public getColumnType(index: number) {
        return index >= 1 && index <= this.columns.length ? this.columns[index - 1].type : null;
    }

    public getColumnName(index: number) {
        return index >= 1 && index <= this.columns.length ? this.columns[index - 1].name : null;
    }

    public getColumnNames(): string[] {
        const names = [];
        for (let i = 0; i < this.getMaxColumnIndex(); i += 1) {
            names.push(this.columns[i].name);
        }

        return names;
    }

    public addColumn(name?: string, index?: number, type?: JSColumn) {
        const col = new ColumnInfo({ name: name || 'unnamed', type });

        if (index >= 1 && index <= this.columns.length) {
            this.columns.splice(index - 1, 0, col);
            return;
        }

        this.columns.push(col);
    }

    public addRow(index: number | any[], array?: any[]) {
        if (index instanceof Array) {
            array = index;
            index = -1;
        }

        if (index >= 1 && index <= this.rows.length) {
            this.rows.splice(index - 1, 0, array);
            return;
        }

        for (let i = 0; i < array.length; i += 1) {
            const type = this.getColumnType(i + 1);
            if (type === JSColumn.NUMBER) {
                array[i] =
                    array[i] && typeof array[i] !== 'number' ? parseFloat(array[i]) : array[i];
            }
        }

        this.rows.push(array);
    }

    public removeRow(index: number) {
        if (index >= 1 && index <= this.rows.length) {
            this.rows.splice(index - 1, 1);
        }
    }

    public getAsHTML(
        escape_values: boolean,
        escape_spaces: boolean,
        allowMultiLine: boolean,
        useIndent: boolean,
        addColumnInformation: boolean,
    ) {
        let html = '';
        html += `<p>Lines: ${this.getMaxRowIndex()}</p>`;
        html += '<table>';
        if (addColumnInformation) {
            const columnNames = this.getColumnNames();
            html += '<tr style="background-color: #dddddd">';
            html += '<th style="font-style: italic color: gray">Index</th>';
            for (let i = 0; i < columnNames.length; i++) {
                html += `<th style="text-align: left">${columnNames[i]}</th>`;
            }

            html += '</tr>';
        }

        for (let row = 0; row < this.rows.length; row += 1) {
            html += '<tr>';
            const style = row % 2 === 0 ? 'background-color: #eff3fe' : '';
            html += `<td style="${style} font-style: italic color: gray">${(
                row + 1
            ).toFixed()}</td>`;
            for (let col = 0; col < this.columns.length; col += 1) {
                let value = this.rows[row][col];
                if (!value) value = '';
                html += `<td style="${style}">${value}</td>`;
            }

            html += '</tr>';
        }

        html += '</table>';
        return html;
    }

    public getColumnAsArray(column: number) {
        const values = [];
        if (column < 1 || column > this.getMaxColumnIndex()) {
            return null;
        }

        for (let i = 0; i < this.rows.length; i += 1) {
            if (column >= 1 && column <= this.columns.length + 1) {
                values.push(this.rows[i][column - 1]);
            }
        }

        return values;
    }

    public getRowAsArray(row: number) {
        if (row < 1 || row > this.getMaxRowIndex()) {
            return null;
        }

        return [...this.rows[row - 1]];
    }

    public getValue(row: number, col: number) {
        if (col < 1 || col > this.getMaxColumnIndex()) {
            return null;
        }

        if (row < 1 || row > this.getMaxRowIndex()) {
            return null;
        }

        return this.rows[row - 1][col - 1];
    }

    public setValue(row: number, col: number, value: any) {
        if (col < 1 || col > this.getMaxColumnIndex()) {
            return null;
        }

        if (row < 1 || row > this.getMaxRowIndex()) {
            return null;
        }

        this.rows[row - 1][col - 1] = value;
        return value;
    }

    public removeColumn(col: number) {
        if (col < 1 || col > this.getMaxColumnIndex()) {
            return;
        }

        this.columns.splice(col - 1, 1);
        for (let row = 0; row < this.rows.length; row += 1) {
            this.rows[row].splice(col - 1, 1);
        }
    }

    public sort(columnIndex: number, ascendingOrDescending: boolean) {
        this.rows = this.rows.sort((a, b) => {
            if (a[columnIndex - 1] < b[columnIndex - 1]) return ascendingOrDescending ? -1 : 1;
            if (a[columnIndex - 1] > b[columnIndex - 1]) return ascendingOrDescending ? 1 : -1;
            return 0;
        });
    }
}
