import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Preformatted text', () => {
  const testCases: Array<[string, string]> = [
    [
      '[CS-1470] should NOT convert attachment links inside preformatted text',
      '{{[^test.txt]}}',
    ],
    [
      '[CS-1470] should NOT convert bold formatting inside preformatted text',
      '{{*bold*}}',
    ],
    [
      '[CS-1470] should NOT convert italic formatting inside preformatted text',
      '{{_italic_}}',
    ],
    [
      '[CS-1470] should convert raw link text inside preformatted text',
      '{{http://example.com}}',
    ],
    [
      '[CS-1470] should not convert raw text around links inside preformatted text',
      '{{abc http://google.com abc}}',
    ],
    [
      '[CS-1470] should NOT convert citation inside preformatted text',
      '{{??citation??}}',
    ],
    [
      '[CS-1470] should NOT convert superscript inside preformatted text',
      '{{^superscript^}}',
    ],
    [
      '[CS-1470] should NOT convert strikethrough inside preformatted text',
      '{{-strikethrough-}}',
    ],
    [
      '[CS-1470] should NOT convert subscript inside preformatted text',
      '{{~subscript~}}',
    ],
    [
      '[CS-1470] should NOT convert rulers inside preformatted text',
      '{{-----}}',
    ],
    [
      '[CS-1553] should NOT convert bullet lists inside preformatted text',
      '{{* abc}}',
    ],
    [
      '[CS-1470] should not convert color macro inside preformatted text',
      '{{{color:#59afe1}colour{color}}}',
    ],
    [
      '[CS-1470] should NOT convert wiki-links inside preformatted text',
      '{{[links|http://google.com]}}',
    ],
    ['should NOT convert media inside preformatted text', '{{!image.jpg!}}'],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
