import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - blockquote', () => {
  const testCases: Array<[string, string]> = [
    ['[CS-607] should not need a whitespace', 'bq.this is a blockquote node'],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
