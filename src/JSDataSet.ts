import { JSColumn } from './JSColumn';

export type JSDatasetParameters = {
    rows?: string;
    columns?: string;
};

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

    /**
     * Creates a new instance of the JSDataSet class.
     * @param json Optional JSON object to initialize the dataset with.
     */
    constructor(json?: JSDatasetParameters) {
        if (!(this instanceof JSDataSet)) {
            return new JSDataSet();
        }

        if (json && json.rows && json.columns) {
            this.rows = JSON.parse(json.rows);
            this.columns = JSON.parse(json.columns);
        }
    }

    /**
     * Get the number of rows in the dataset.
     * @returns {number} The maximum row index of the dataset.
     */
    public getMaxRowIndex(): number {
        return this.rows.length;
    }

    /**
     * Get the number of columns in the dataset.
     * @returns {number} The maximum column index of the dataset.
     */
    public getMaxColumnIndex(): number {
        return this.columns.length;
    }

    /**
     * Returns the type of the column at the specified index.
     * @param index The index of the column to get the type of.
     * @returns {JSColumn} The type of the column at the specified index, or null if the index is out of range.
     */
    public getColumnType(index: number): JSColumn {
        return index >= 1 && index <= this.columns.length ? this.columns[index - 1].type : null;
    }

    /**
     * Returns the name of the column at the specified index.
     * @param index The index of the column to retrieve the name for.
     * @returns {string} The name of the column at the specified index, or null if the index is out of range.
     */
    public getColumnName(index: number): string {
        return index >= 1 && index <= this.columns.length ? this.columns[index - 1].name : null;
    }

    /**
     * Returns an array of column names for this dataset.
     * @returns {string[]} An array of column names.
     */
    public getColumnNames(): string[] {
        const names = [];
        for (let i = 0; i < this.getMaxColumnIndex(); i += 1) {
            names.push(this.columns[i].name);
        }

        return names;
    }

    /**
     * Adds a new column to the dataset.
     * @param name The name of the column. If not provided, a default name will be used.
     * @param index The index at which to insert the new column. If not provided, the column will be added to the end of the dataset.
     * @param type The type of the column.
     */
    public addColumn(name?: string, index?: number, type?: JSColumn) {
        const col = new ColumnInfo({ name: name || 'unnamed', type });

        if (index >= 1 && index <= this.columns.length) {
            this.columns.splice(index - 1, 0, col);
            return;
        }

        this.columns.push(col);
    }

    /**
     * Add a row to the dataset.
     * @param index The index at which to insert the new row. If not provided, the row will be added to the end of the dataset.
     * @param array The array of values to add to the row.
     */
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

    /**
     * Removes a row from the dataset at the specified index.
     * @param index The index of the row to remove.
     */
    public removeRow(index: number) {
        if (index >= 1 && index <= this.rows.length) {
            this.rows.splice(index - 1, 1);
        }
    }

    /**
     * Get the dataset as an html table.
     * @param escape_values If true, replaces illegal HTML characters with corresponding valid escape sequences.
     * @param escape_spaces If true, replaces text spaces with non-breaking space tags ( ) and tabs by four non-breaking space tags.
     * @param multi_line_markup If true, multiLineMarkup will enforce new lines that are in the text; single new lines will be replaced by <br>, multiple new lines will be replaced by <p>
     * @param pretty_indent If true, adds indentation for more readable HTML code.
     * @param add_column_names If false, column headers will not be added to the table.
     * @returns {string} The dataset as an HTML table.
     */
    public getAsHTML(
        escape_values: boolean,
        escape_spaces: boolean,
        multi_line_markup: boolean,
        pretty_indent: boolean,
        add_column_names: boolean,
    ): string {
        let html = '';
        html += `<p>Lines: ${this.getMaxRowIndex()}</p>`;
        html += '<table>';
        if (add_column_names) {
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

    /**
     * Returns an array of values for a given column index.
     * @param column The index of the column to retrieve values from.
     * @returns An array of values for the given column index, or null if the column index is out of range.
     */
    public getColumnAsArray(column: number): any[] {
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

    /**
     * Returns the specified row as an array.
     * @param row The index of the row to retrieve (1-based).
     * @returns An array containing the values of the specified row, or null if the row index is out of range.
     */
    public getRowAsArray(row: number): any[] {
        if (row < 1 || row > this.getMaxRowIndex()) {
            return null;
        }

        return [...this.rows[row - 1]];
    }

    /**
     * Returns the value at the specified row and column index.
     * @param row The row index (1-based).
     * @param col The column index (1-based).
     * @returns The value at the specified row and column index, or null if the indexes are out of range.
     */
    public getValue(row: number, col: number): any {
        if (col < 1 || col > this.getMaxColumnIndex()) {
            return null;
        }

        if (row < 1 || row > this.getMaxRowIndex()) {
            return null;
        }

        return this.rows[row - 1][col - 1];
    }

    /**
     * Sets the value of a cell in the dataset.
     * @param row The row index of the cell to set (1-based).
     * @param col The column index of the cell to set (1-based).
     * @param value The value to set in the cell.
     * @returns The value that was set in the cell.
     */
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

    /**
     * Removes a column from the dataset.
     * @param col The index of the column to remove.
     */
    public removeColumn(col: number) {
        if (col < 1 || col > this.getMaxColumnIndex()) {
            return;
        }

        this.columns.splice(col - 1, 1);
        for (let row = 0; row < this.rows.length; row += 1) {
            this.rows[row].splice(col - 1, 1);
        }
    }

    /**
     * Sorts the rows of the dataset based on the values in the specified column.
     * @param col The index of the column to sort by.
     * @param sort_direction If true, sorts the rows in ascending order. If false, sorts the rows in descending order.
     */
    public sort(col: number, sort_direction: boolean) {
        this.rows = this.rows.sort((a, b) => {
            if (a[col - 1] < b[col - 1]) return sort_direction ? -1 : 1;
            if (a[col - 1] > b[col - 1]) return sort_direction ? 1 : -1;
            return 0;
        });
    }
}
