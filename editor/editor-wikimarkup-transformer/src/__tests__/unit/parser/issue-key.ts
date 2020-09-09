import WikiMarkupTransformer from '../../../index';
import { Context } from '../../../interfaces';

describe('JIRA wiki markup - Issue key (smart card)', () => {
  const testCases: Array<[string, string]> = [
    ['should parse issue inside a paragraph', 'this ABC-10 is a smart card'],
    [
      'should parse more than one issue inside a paragraph',
      'ABC-10 and ABC-20 are smart cards',
    ],
    ['should parse issue inside brackets', 'this [ABC-10] is a smart card'],
    ['should parse issue inside a h1', 'h1. smart card in the title ABC-10'],
    ['should parse issue inside a h2', 'h2. smart card in the title ABC-10'],
    ['should parse issue inside a h3', 'h3. smart card in the title ABC-10'],
    ['should parse issue inside a h4', 'h4. smart card in the title ABC-10'],
    ['should parse issue inside a h5', 'h5. smart card in the title ABC-10'],
    ['should parse issue inside a h6', 'h6. smart card in the title ABC-10'],
    [
      'should parse issue inside a quote macro',
      'this {quote}ABC-10{quote} is a smart card',
    ],
    [
      'should parse issue inside a panel macro',
      'this {panel}ABC-10{panel} is a smart card',
    ],
    ['should parse issue inside a list item', '- this ABC-10 is a smart card'],
    ['should parse issue inside a table cell', '|foo|ABC-10|'],
    ['should not parse issue key mixed in a text', 'YXZABC-10'],
    ['should not parse issue inside single quotes', `'ABC-10'`],
    ['should not parse issue inside double quotes', '"ABC-10"'],
    [
      'should not parse issue inside a bold',
      '*this ABC-10 is an important smart card*',
    ],
    [
      'should not parse issues not present in the context',
      `this issue wasn't provided in the context XYZ-99`,
    ],
    ['should not parse issues inside a media', 'this is a media !ABC-10!'],
    [
      'should not parse issues inside a noformat macro',
      'this {noformat}ABC-10{noformat} is not a smart card',
    ],
    [
      'should not parse issues inside a color macro',
      'this {color:red}ABC-10{color} is not a smart card',
    ],
    [
      'should not parse issues inside a code macro',
      'this {code:java}ABC-10{code} is not a smart card',
    ],
    ['should parse issues inside parentheses', 'this (ABC-10) is a smart card'],
    [
      'should parse issues inside exclaimation mark',
      'this !ABC-10 ! is a smart card',
    ],
    [
      'should parse issues after an exclaimation mark',
      'this !ABC-10 is a smart card',
    ],
    [
      'should parse issues in between exclaimation mark',
      'this !ABC-10 !ABC-20 are smart cards',
    ],
  ];

  const context: Context = {
    conversion: {
      inlineCardConversion: {
        'ABC-10': 'https://instance.atlassian.net/browse/ABC-10',
        'ABC-20': 'https://instance.atlassian.net/browse/ABC-20',
      },
      mediaConversion: { 'ABC-10': { transform: 'abc-123', embed: true } },
    },
  };

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup, context)).toMatchSnapshot();
    });
  }

  it('should not parse issues if context is not provided', () => {
    const markup = 'this ABC-10 is not a smart card';
    const transformer = new WikiMarkupTransformer();

    expect(transformer.parse(markup)).toMatchSnapshot();
  });
});
