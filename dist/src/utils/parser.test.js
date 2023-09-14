"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
describe('parser', () => {
    test('Parser converts servoy dbi', () => {
        const code = `allowCreationRelatedRecords:true,
allowParentDeleteWhenHavingRelatedRecords:false,
foreignDataSource:"db:/test/test",
items:[
{foreignColumnName:"id",primaryDataProviderID:"id",typeid:23,uuid:"8613CA5A-FEC2-4556-9197-CA7525F9E02D"}
],
joinType:1,
name:"test_to_test",
primaryDataSource:"db:/test/test",
typeid:22,
uuid:"AA0508CB-6A04-46AF-ABA1-8B4F4C2B3B88"`;
        const result = (0, parser_1.read)(code);
        expect(result.allowCreationRelatedRecords).toBe(true);
        expect(result.items.length).toBe(1);
        expect(result.items[0].uuid).toBe('8613CA5A-FEC2-4556-9197-CA7525F9E02D');
    });
});
//# sourceMappingURL=parser.test.js.map