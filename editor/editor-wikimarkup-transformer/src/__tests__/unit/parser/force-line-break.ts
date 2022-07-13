import WikiMarkupTransformer from '../../..';

describe('WikiMarkup => ADF - force line break', () => {
  test('should detect the force line break correctly', () => {
    const wiki = 'this is a line break \\\\ second line';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect invalid force line break', () => {
    const wiki = 'this is not a line break \\\\\\ not on second line';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect the correct force line break', () => {
    const wiki =
      'this-is-not-line-break\\\\but-this-one-is-line-break\\\\second-line';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect the correct force line break on same line', () => {
    const wiki =
      'this-is-line-break\\\\ and-this-one-is-also-line-break\\\\second-line';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('ESS-2359 should detect hardbreaks in the beginning and end of paragraph', () => {
    const wiki = `\\\\ foo \\\\ bar
    
    foo \\\\`;
    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('ESS-2359 returns empty paragraph if it contains only force-line-breaks', () => {
    // This behaviour differs from JIRA as jira wiki will create a paragraph with only force-line-breaks
    const wiki = `\\\\
    \\\\
    \\\\`;
    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });
});
