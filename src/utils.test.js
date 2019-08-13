const utils = require("./utils");

test("utils.stringMiddle", async () => {
  const TESTDATA = "Test data";
  expect(utils.stringMiddle(TESTDATA, 2, 4)).toBe("est ");
});

test("utils.stringLeft", async () => {
  const TESTDATA = "Test data";
  expect(utils.stringLeft(TESTDATA, 4)).toBe("Test");
});

test("utils.stringTrim", async () => {
  const TESTDATA = "\t  Test data  ";
  expect(utils.stringTrim(TESTDATA)).toBe("Test data");
});
