import WikiMarkupTransformer from '../../../..';

describe('WikiMarkup => ADF Formatters - emphasis', () => {
  test('should detect emphasis mark at beginning of the line', () => {
    const wiki = '_emphasis_ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect emphasis mark at end of the line', () => {
    const wiki = `This is a _emphasis_
another line`;

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect emphasis mark at end of the input', () => {
    const wiki = 'This is a _emphasis_';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect emphasis mark at in between of the line', () => {
    const wiki = 'This is a _emphasis_ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect emphasis surrounded by non alphanumeric characters', () => {
    const wiki = 'This is a (_emphasis_) text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect emphasis mark and ignoring the invalid closing symbol', () => {
    const wiki = 'This is a _emphasis_emphasis_ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a emphasis mark if surrounded by non-latin characters', () => {
    const wiki = 'This is not a 牛_emphasis_牛 text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a emphasis mark if there is no space before _', () => {
    const wiki = 'This is not a_emphasis_ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a emphasis mark if there is a space after opening _', () => {
    const wiki = 'This is not a _ emphasis_ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a emphasis mark if there is a space before closing _', () => {
    const wiki = 'This is not a _emphasis _ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a emphasis mark if there is not a space after closing _', () => {
    const wiki = 'This is not a _emphasis_text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a emphasis mark if it is escaped', () => {
    const wiki = 'This is not a _emphasis\\_ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should be an emphasis mark and not a table if the character is a pipe', () => {
    const wiki = '_|_';
    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });
});
