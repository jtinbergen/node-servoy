const JSColumn = require('./JSColumn');

function ColumnInfo() {
  if (!(this instanceof ColumnInfo)) {
    return new ColumnInfo();
  }

  this.name = '?column?';
  this.type = JSColumn.TEXT;
}

function JSDataSet(json) {
  if (!(this instanceof JSDataSet)) {
    return new JSDataSet();
  }

  let rowIndex = 0;
  this.rows = [];
  this.columns = [];

  Object.defineProperty(this, 'rowIndex', {
    get() {
      return rowIndex;
    },
    set(value) {
      rowIndex = value;
    },
  });

  if (json && json.rows && json.columns) {
    this.rows = JSON.parse(json.rows);
    this.columns = JSON.parse(json.columns);
  }
}

JSDataSet.prototype.addColumn = function addColumn(name, index, type) {
  const col = new ColumnInfo();
  col.name = name || 'unnamed';
  col.type = type !== undefined ? type : JSColumn.TEXT;

  if (index >= 1 && index <= this.columns.length) {
    this.columns.splice(index - 1, 0, col);
    return;
  }

  this.columns.push(col);
};

/**
 * @param {Number} index The rowindex where the new row should be inserted.
 * @param {Array} array The row data to be added.
 */
JSDataSet.prototype.addRow = function addRow(index, array) {
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
        array[i] && typeof array[i] !== 'number'
          ? parseFloat(array[i])
          : array[i];
    }
  }

  this.rows.push(array);
};

JSDataSet.prototype.removeRow = function removeRow(index) {
  if (index >= 1 && index <= this.rows.length) {
    this.rows.splice(index - 1, 1);
  }
};

/**
 * @param {Boolean} escape_values
 * @param {Boolean} escape_spaces
 * @param {Boolean} allowMultiLine
 * @param {Boolean} useIndent
 * @param {Boolean} addColumnInformation
 */
JSDataSet.prototype.getAsHTML = function getAsHTML(
  escape_values,
  escape_spaces,
  allowMultiLine,
  useIndent,
  addColumnInformation,
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
};

JSDataSet.prototype.getColumnAsArray = function getColumnAsArray(index) {
  const values = [];
  if (index < 1 || index > this.getMaxColumnIndex()) {
    return null;
  }

  for (let i = 0; i < this.rows.length; i += 1) {
    if (index >= 1 && index <= this.columns.length + 1) {
      values.push(this.rows[i][index - 1]);
    }
  }

  return values;
};

JSDataSet.prototype.getColumnName = function getColumnName(index) {
  return index >= 1 && index <= this.columns.length
    ? this.columns[index - 1].name
    : null;
};

JSDataSet.prototype.getColumnType = function getColumnType(index) {
  return index >= 1 && index <= this.columns.length
    ? this.columns[index - 1].type
    : null;
};

JSDataSet.prototype.getColumnNames = function getColumnNames() {
  const names = [];
  for (let i = 0; i < this.getMaxColumnIndex(); i += 1) {
    names.push(this.columns[i].name);
  }

  return names;
};

JSDataSet.prototype.getRowAsArray = function getRowAsArray(row) {
  if (row < 1 || row > this.getMaxRowIndex()) {
    return null;
  }

  return [...this.rows[row - 1]];
};

JSDataSet.prototype.getMaxRowIndex = function getMaxRowIndex() {
  return this.rows.length;
};

JSDataSet.prototype.getMaxColumnIndex = function getMaxColumnIndex() {
  return this.columns.length;
};

JSDataSet.prototype.getValue = function getValue(row, col) {
  if (col < 1 || col > this.getMaxColumnIndex) {
    return null;
  }

  if (row < 1 || row > this.getMaxRowIndex()) {
    return null;
  }

  return this.rows[row - 1][col - 1];
};

JSDataSet.prototype.setValue = function setValue(row, col, value) {
  if (col < 1 || col > this.getMaxColumnIndex()) {
    return null;
  }

  if (row < 1 || row > this.getMaxRowIndex()) {
    return null;
  }

  this.rows[row - 1][col - 1] = value;
  return value;
};

JSDataSet.prototype.removeColumn = function removeColumn(col) {
  if (col < 1 || col > this.getMaxColumnIndex()) {
    return;
  }

  this.columns.splice(col - 1, 1);
  for (let row = 0; row < this.rows.length; row += 1) {
    this.rows[row].splice(col - 1, 1);
  }
};

module.exports = JSDataSet;
