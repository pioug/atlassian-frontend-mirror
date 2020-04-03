import WikiMarkupTransformer from '../../../..';

describe('WikiMarkup => ADF Formatters - deleted', () => {
  test('should detect deleted mark at beginning of the line', () => {
    const wiki = '-deleted- text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect deleted mark at end of the line', () => {
    const wiki = `This is a -deleted-
another line`;

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect deleted mark at end of the input', () => {
    const wiki = 'This is a -deleted-';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect deleted mark at in between of the line', () => {
    const wiki = 'This is a -deleted- text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect deleted mark surrounded by non alphanumeric characters', () => {
    const wiki = 'This is a (-deleted-) text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect deleted mark and ignoring the invalid closing symbol', () => {
    const wiki = 'This is a -deleted-deleted- text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a deleted mark surrounded by non-latin characters', () => {
    const wiki = 'This is not a 牛-deleted-牛 text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a deleted mark if there is no space before -', () => {
    const wiki = 'This is not a-deleted- text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a deleted mark if there is a space after opening -', () => {
    const wiki = 'This is not a - deleted- text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a deleted mark if there is a space before closing -', () => {
    const wiki = 'This is not a -deleted - text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a deleted mark if there is not a space after closing -', () => {
    const wiki = 'This is not a -deleted-text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a deleted mark if it is escaped', () => {
    const wiki = 'This is not a -deleted\\- text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a deleted mark if the - is in a link format', () => {
    const wiki = 'This is not a -[link|https://www.atlass-ian.com]';
    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should be a deleted mark and not a table if the character is a pipe', () => {
    const wiki = '-|-';
    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });
});
