import { JSRecord } from './JSRecord';

export class JSRecordMarkers {
    hasErrors: boolean;
    onBeforeInsertFailed: boolean;
    onBeforeUpdateFailed: boolean;
    record: JSRecord;

    constructor(
        hasErrors: boolean,
        onBeforeInsertFailed: boolean,
        onBeforeUpdateFailed: boolean,
        record: JSRecord,
    ) {
        this.hasErrors = hasErrors;
        this.onBeforeInsertFailed = onBeforeInsertFailed;
        this.onBeforeUpdateFailed = onBeforeUpdateFailed;
        this.record = record;
    }

    public getGenericExceptions() {
        throw new Error('Not implemented');
    }

    public getMarkers(level?: number) {
        throw new Error('Not implemented');
    }

    public report(
        message: string,
        dataprovider: string,
        level: number,
        customObject: any,
        messageKeyParams: any[],
    ) {
        throw new Error('Not implemented');
    }
}
