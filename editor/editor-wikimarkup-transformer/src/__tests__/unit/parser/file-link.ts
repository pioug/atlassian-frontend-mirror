import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - File Link', () => {
  const testCases: Array<[string, string]> = [
    ['should find file link in the text', '[^file.pdf]'],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(
        transformer.parse(markup, {
          conversion: {
            mediaConversion: { 'file.pdf': { transform: 'abc-123' } },
          },
        }),
      ).toMatchSnapshot();
    });
  }
});
