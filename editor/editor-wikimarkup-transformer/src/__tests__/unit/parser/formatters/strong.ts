import WikiMarkupTransformer from '../../../..';

describe('WikiMarkup => ADF Formatters - Strong', () => {
  test('should detect strong mark at beginning of the line', () => {
    const wiki = '*strong* text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect strong mark at end of the line', () => {
    const wiki = `This is a *strong*
another line`;

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect strong mark at end of the input', () => {
    const wiki = 'This is a *strong*';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect strong mark at in between of the line', () => {
    const wiki = 'This is a *strong* text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect strong mark surrounded by non alphanumeric characters', () => {
    const wiki = 'This is a (*strong*) text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect strong mark and ignoring the invalid closing symbol', () => {
    const wiki = 'This is a *strong*strong* text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a strong mark if surrounded by non-latin characters', () => {
    const wiki = 'This is not a 牛*strong*牛 text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a strong mark if there is no space before *', () => {
    const wiki = 'This is not a*strong* text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a strong mark if there is a space after opening *', () => {
    const wiki = 'This is not a * strong* text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a strong mark if there is a space before closing *', () => {
    const wiki = 'This is not a *strong * text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a strong mark if there is not a space after closing *', () => {
    const wiki = 'This is not a *strong*text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a strong mark if it is escaped', () => {
    const wiki = 'This is not a *strong\\* text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should be a strong mark and not a table if the character is a pipe', () => {
    const wiki = '*|*';
    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });
});
