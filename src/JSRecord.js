const JSDataSet = require('./JSDataSet').JSDataSet;

class JSRecord {
  constructor({ foundset, databaseManager, record }) {
    this.exception = null;
    this.foundset = foundset;
    this.unsavedChanges = [];
    for (let field in record) {
      this[field] = record[field];
    }
  }

  getChangedData() {
    const dataset = new JSDataSet();
    dataset.addColumn('propertyName');
    dataset.addColumn('originalValue');
    dataset.addColumn('changedValue');
    this.unsavedChanges.forEach((change) => {
      dataset.addRow([
        change.propertyName,
        this[change.propertyName],
        change.propertyValue,
      ]);
    });

    return dataset;
  }

  // getDataSource = function () {
  //     // return string
  // }

  // getPKs = function () {
  //     var key = [];
  //     var fields = this.foundset.getPKFields();
  //     fields.forEach(function (field) {
  //         key.push(this[field]);
  //     });

  //     return key;
  // }

  hasChangedData() {
    return this.getChangedData().getMaxRowIndex() > 0;
  }

  isEditing() {
    return this.hasChangedData();
  }

  // isNew() {

  // }

  revertChanges() {
    this.unsavedChanges = [];
  }
}

const isFunction = (functionToCheck) => {
  const getType = {};
  return (
    functionToCheck &&
    getType.toString.call(functionToCheck) === '[object Function]'
  );
};

const recordProxyHandler = {
  get: (target, propertyName) => {
    let propertyValue = target[propertyName];
    target.unsavedChanges.forEach((change) => {
      if (change.propertyName === propertyName) {
        propertyValue = change.propertyValue;
      }
    });

    if (isFunction(propertyValue)) {
      propertyValue = propertyValue.bind(target);
    }

    return propertyValue;
  },
  set: (target, propertyName, propertyValue) => {
    target.unsavedChanges.push(
      Object.assign({
        modificationDate: new Date(),
        propertyName: propertyName,
        propertyValue: propertyValue,
      }),
    );
    return true;
  },
};

module.exports = {
  recordProxyHandler,
  JSRecord,
};
