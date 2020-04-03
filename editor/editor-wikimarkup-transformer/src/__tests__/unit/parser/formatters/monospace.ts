import WikiMarkupTransformer from '../../../..';

describe('WikiMarkup => ADF Formatters - monospace', () => {
  test('should detect monospace mark at beginning of the line', () => {
    const wiki = '{{monospace}} text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect monospace mark at end of the line', () => {
    const wiki = `This is a {{monospace}}
another line`;

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect monospace mark at end of the input', () => {
    const wiki = 'This is a {{monospace}}';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect monospace mark at in between of the line', () => {
    const wiki = 'This is a {{monospace}} text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a monospace mark if there is no space before {{', () => {
    const wiki = 'This is not a{{monospace}} text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect monospace mark and ignoring the invalid closing symbol', () => {
    const wiki = 'This is a {{monospace}}monospace}} text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect monospace mark with a table inside, but not render as a table', () => {
    const wiki = '{{|this|is|a|table|}}';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a monospace mark if there is a space after opening {{', () => {
    const wiki = 'This is not a {{ monospace}} text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect monospace mark surrounded by non alphanumeric characters', () => {
    const wiki = 'This is a ({{monospace}}) text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a monospace mark if surrounded by non-latin characters', () => {
    const wiki = 'This is not a 牛{{monospace}}牛 text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a monospace mark if there is a space before closing }}', () => {
    const wiki = 'This is not a {{monospace }} text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a monospace mark if there is not a space after closing }}', () => {
    const wiki = 'This is not a {{monospace}}text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a monospace mark if it is escaped', () => {
    const wiki = 'This is not a {{monospace\\}} text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });
});
