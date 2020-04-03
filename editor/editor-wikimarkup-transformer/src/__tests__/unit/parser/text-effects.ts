import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Text effects', () => {
  const testCases: Array<[string, string]> = [
    [
      'should find strong marks in the text',
      'This is a string with a *strong* text',
    ],
    [
      'should divide marks intervals into combination of marks',
      'This is a *string with a {color:red}bold red* text{color}.',
    ],
    [
      'should default unknown color to black #000000',
      'This is a unknown {color:nimabi}color{color}',
    ],
    ['should find monospace text', 'This is a string with {{monospaced text}}'],
    [
      'should not search for monospace text inside code macro',
      'This is a string with {code}mono {{space}} text{code}',
    ],
    ['should process superscript', 'This is a ^superscript^'],
    ['should process subscript', 'This is a ~subscript~'],
    ['should process emphasis', 'This is a _emphasis_'],
    ['should process citation', 'This is a ??citation??'],
    ['should process deleted', 'This is a -deleted-'],
    ['should process inserted', 'This is a +inserted+'],
    [
      'should process string with a wrong order of effects',
      'This is a *strong ^string* with a ~^ bla*~~',
    ],
    [
      'should convert double baskslash to a hardBreak node',
      'this is a text with a\\\\new line in it',
    ],
    [
      'should not fail while applying marks to a string containing double backslash',
      'this is a text *with a\\\\new* line in it',
    ],
    [
      'should not apply marks on separate lines',
      `this is a line with an *asterisk
another one is here and it should* not be applied`,
    ],
    [
      "should use code mark first if it's the inner mark",
      'This is a *bold {{monospace}} thingy*',
    ],
    [
      'should not replace marks in the middle of the word',
      `https://app.datadoghq.com/screen/220506/product-fabric-content-service?tv_mode=true

https://app.datadoghq.com/screen/282018/product-fabric-adf-service?tv_mode=true#close`,
    ],
    [
      'should not double url-encode text links',
      'text http://example.com/query=some%20text%20with%20encoded%20space text',
    ],
    [
      'should not double url-encode text links with a url-encoded comma',
      'text https://example.com/test%2C%20space text',
    ],
    [
      'should not double url-encode text links with raw comma',
      'text https://example.com/test,%20space text',
    ],
    [
      'should differentiate raw comma from url-encoded comma',
      'text https://example.com/test%2C,%20space text',
    ],
    [
      'should differentiate raw comma from url-encoded comma in a mailto:',
      'text mailto:test%2C,%20space@example.com text',
    ],
    [
      '[CS-576] should allow {color} macro in formatters',
      'This is _{color:red}*Strong Red and Italic*{color}_',
    ],
    [
      'should not apply strong when ending line is two strong symbols',
      '*not valid strong **',
    ],
    [
      'should auto-linkify text links with tilde character in it',
      'text prefix https://example.com/~abc/def/^xyz!bang$.#!.bang text suffix',
    ],
    [
      'should NOT auto-linkify monospace formatted text',
      '{{text prefix https://example.com/~abc/def/^xyz!bang$.#!.bang text suffix}}',
    ],
    [
      'should not let auto-links end with a period',
      'text prefix https://example.com. text suffix',
    ],
    [
      'should not let auto-links end with a bang',
      'text prefix https://example.com! text suffix',
    ],
    [
      'should let auto-links end with parenthesis',
      'text prefix https://example.com/abc) text suffix',
    ],
    [
      'should let auto-links end with parenthesis in url hash segment',
      'text prefix https://example.com/abc#abc) text suffix',
    ],
    [
      'should auto-link ftp urls',
      'text prefix ftp://example.com/~abc/ text suffix',
    ],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
