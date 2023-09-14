import { JSDataSet } from './JSDataSet';

describe('JSDataSet', () => {
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
