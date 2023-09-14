"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordProxyHandler = exports.JSRecord = void 0;
class JSRecord {
    constructor({ databaseManager, foundset, record, }) {
        this.exception = null;
        this.foundset = foundset;
        this.unsavedChanges = [];
        for (let field in record) {
            this[field] = record[field];
        }
    }
    createMarkers() {
        throw new Error('Not implemented');
    }
    getChangedData() {
        throw new Error('Not implemented');
    }
    getDataSource() {
        throw new Error('Not implemented');
    }
    getPKs() {
        throw new Error('Not implemented');
    }
    hasChangedData() {
        throw new Error('Not implemented');
    }
    isEditing() {
        throw new Error('Not implemented');
    }
    isNew() {
        throw new Error('Not implemented');
    }
    isRelatedFoundSetLoaded(relationName) {
        throw new Error('Not implemented');
    }
    revertChanges() {
        throw new Error('Not implemented');
    }
}
exports.JSRecord = JSRecord;
const isFunction = (functionToCheck) => {
    const getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};
exports.recordProxyHandler = {
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
        target.unsavedChanges.push(Object.assign({
            modificationDate: new Date(),
            propertyName: propertyName,
            propertyValue: propertyValue,
        }));
        return true;
    },
};
//# sourceMappingURL=JSRecord.js.map