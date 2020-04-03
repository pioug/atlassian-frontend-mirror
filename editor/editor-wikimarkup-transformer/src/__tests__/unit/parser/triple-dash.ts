import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Triple Dash', () => {
  const testCases: Array<[string, string]> = [
    ['should replace triple dash with a special symbol', 'foo --- bar'],
    [
      'should not replace with triple dashes when sticked with parenthesis or alphanumerical',
      `
        ---foo
        bar---
        (---
        ---)
      `,
    ],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
