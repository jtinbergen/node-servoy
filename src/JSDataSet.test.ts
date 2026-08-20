import { JSDataSet } from './JSDataSet';
import { JSColumn } from './JSColumn';

describe('JSDataSet', () => {
    describe('addRow', () => {
        it('does not corrupt existing rows when called with only an index and no array', () => {
            const ds = new JSDataSet();
            ds.addColumn();
            ds.addRow([1]);

            ds.addRow(1);

            expect(ds.getMaxRowIndex()).toBe(1);
            expect(ds.getRowAsArray(1)).toEqual([1]);
        });
    });

    describe('getAsHTML', () => {
        it('renders a numeric zero value instead of leaving the cell blank', () => {
            const ds = new JSDataSet();
            ds.addColumn('amount', undefined, JSColumn.NUMBER);
            ds.addRow([0]);

            const html = ds.getAsHTML(false, false, false, false, false);

            expect(html).toContain('>0<');
        });
    });

    describe('addColumn', () => {
        it('backfills existing rows with a null value when a column is added afterwards', () => {
            const ds = new JSDataSet();
            ds.addColumn();
            ds.addRow([1]);

            ds.addColumn();

            expect(ds.getValue(1, 2)).toBeNull();
        });
    });

    test('sort', async () => {
        const ds = new JSDataSet();
        ds.addColumn();
        ds.addRow(1, [3]);
        ds.addRow(2, [1]);
        ds.addRow(3, [2]);
        expect(ds.getValue(1, 1)).toBe(3);
        expect(ds.getValue(2, 1)).toBe(1);
        expect(ds.getValue(3, 1)).toBe(2);
        ds.sort(1, true);
        expect(ds.getValue(1, 1)).toBe(1);
        expect(ds.getValue(2, 1)).toBe(2);
        expect(ds.getValue(3, 1)).toBe(3);
        ds.sort(1, false);
        expect(ds.getValue(1, 1)).toBe(3);
        expect(ds.getValue(2, 1)).toBe(2);
        expect(ds.getValue(3, 1)).toBe(1);
    });
});
