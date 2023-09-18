import { JSDataSet } from './JSDataSet';
import { JSFoundSet } from './JSFoundSet';
import { JSRecordMarkers } from './JSRecordMarkers';

type Target = { unsavedChanges: any[]; [key: string]: any };

export class JSRecord {
    exception: string | null;
    foundset: JSFoundSet;
    recordMarkers: JSRecordMarkers;
    unsavedChanges: any[];
    [key: string]: any;

    constructor({
        databaseManager,
        foundset,
        record,
    }: {
        databaseManager: any;
        foundset: JSFoundSet;
        record: any;
    }) {
        this.exception = null;
        this.foundset = foundset;
        this.unsavedChanges = [];
        for (let field in record) {
            this[field] = record[field];
        }

        this.recordMarkers = this.createMarkers();
    }

    public createMarkers(): JSRecordMarkers {
        throw new Error('Not implemented');
    }

    public getChangedData(): JSDataSet {
        throw new Error('Not implemented');
    }

    public getDataSource(): string {
        throw new Error('Not implemented');
    }

    public getPKs(): any[] {
        throw new Error('Not implemented');
    }

    public hasChangedData(): boolean {
        throw new Error('Not implemented');
    }

    public isEditing(): boolean {
        throw new Error('Not implemented');
    }

    public isNew(): boolean {
        throw new Error('Not implemented');
    }

    public isRelatedFoundSetLoaded(relationName: string): boolean {
        throw new Error('Not implemented');
    }

    public revertChanges(): void {
        throw new Error('Not implemented');
    }
}

const isFunction = (functionToCheck: Function) => {
    const getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

export const recordProxyHandler = {
    get: (target: Target, propertyName: string) => {
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
    set: (target: Target, propertyName: string, propertyValue: any) => {
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
