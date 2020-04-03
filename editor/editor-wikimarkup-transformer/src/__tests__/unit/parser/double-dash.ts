import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Double dash', () => {
  const testCases: Array<[string, string]> = [
    ['should replace double dash with a special symbol', 'foo -- bar'],
    [
      'should not replace with double dashes when sticked with parenthesis or alphanumerical',
      `
        --foo
        bar--
        (--
        --)
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
