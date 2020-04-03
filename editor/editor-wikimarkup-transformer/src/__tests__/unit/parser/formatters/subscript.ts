import WikiMarkupTransformer from '../../../..';

describe('WikiMarkup => ADF Formatters - Subscript', () => {
  test('should detect subscript mark at beginning of the line', () => {
    const wiki = '~subscript~ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect subscript mark at end of the line', () => {
    const wiki = `This is a ~subscript~
another line`;

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect subscript mark at end of the input', () => {
    const wiki = 'This is a ~subscript~';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect subscript mark at in between of the line', () => {
    const wiki = 'This is a ~subscript~ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect subscript mark surrounded by non alphanumeric characters', () => {
    const wiki = 'This is a (~subscript~) text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect subscript mark and ignoring the invalid closing symbol', () => {
    const wiki = 'This is a ~subscript~subscript~ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a subscript mark if surrounded by non-latin characters', () => {
    const wiki = 'This is not a 牛~subscript~牛 text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a subscript mark if there is no space before ~', () => {
    const wiki = 'This is not a~subscript~ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a subscript mark if there is a space after opening ~', () => {
    const wiki = 'This is not a ~ subscript~ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a subscript mark if there is a space before closing ~', () => {
    const wiki = 'This is not a ~subscript ~ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a subscript mark if there is not a space after closing ~', () => {
    const wiki = 'This is not a ~subscript~text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a subscript mark if it is escaped', () => {
    const wiki = 'This is not a ~subscript\\~ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should be a subscript mark and not a table if the character is a pipe', () => {
    const wiki = '~|~';
    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });
});
