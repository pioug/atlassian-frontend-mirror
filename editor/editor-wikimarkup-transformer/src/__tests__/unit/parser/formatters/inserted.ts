import WikiMarkupTransformer from '../../../..';

describe('WikiMarkup => ADF Formatters - inserted', () => {
  test('should detect inserted mark at beginning of the line', () => {
    const wiki = '+inserted+ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect inserted mark at end of the line', () => {
    const wiki = `This is a +inserted+
another line`;

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect inserted mark at end of the input', () => {
    const wiki = 'This is a +inserted+';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect inserted mark at in between of the line', () => {
    const wiki = 'This is a +inserted+ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect inserted surrounded by non alphanumeric characters', () => {
    const wiki = 'This is a (+inserted+) text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect inserted mark and ignoring the invalid closing symbol', () => {
    const wiki = 'This is a +inserted+inserted+ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a inserted mark if surrounded by non-latin characters', () => {
    const wiki = 'This is not a 牛+inserted+牛 text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a inserted mark if there is no space before +', () => {
    const wiki = 'This is not a+inserted+ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a inserted mark if there is a space after opening +', () => {
    const wiki = 'This is not a + inserted+ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a inserted mark if there is a space before closing +', () => {
    const wiki = 'This is not a +inserted + text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a inserted mark if there is not a space after closing +', () => {
    const wiki = 'This is not a +inserted+text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a inserted mark if it is escaped', () => {
    const wiki = 'This is not a +inserted\\+ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should be an inserted mark and not a table if the character is a pipe', () => {
    const wiki = '+|+';
    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });
});
