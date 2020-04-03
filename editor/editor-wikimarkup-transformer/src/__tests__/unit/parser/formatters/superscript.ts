import WikiMarkupTransformer from '../../../..';

describe('WikiMarkup => ADF Formatters - Superscript', () => {
  test('should detect superscript mark at beginning of the line', () => {
    const wiki = '^superscript^ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect superscript mark at end of the line', () => {
    const wiki = `This is a ^superscript^
another line`;

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect superscript mark at end of the input', () => {
    const wiki = 'This is a ^superscript^';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect superscript mark at in between of the line', () => {
    const wiki = 'This is a ^superscript^ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect superscript mark surrounded by non alphanumeric characters', () => {
    const wiki = 'This is a (^superscript^) text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should detect superscript mark at in between of the line', () => {
    const wiki = 'This is a ^superscript^superscript^ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a superscript mark if not surrounded by non-latin characters', () => {
    const wiki = 'This is not a 牛^superscript^牛 text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a superscript mark if there is no space before ^', () => {
    const wiki = 'This is not a^superscript^ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a superscript mark if there is a space after opening ^', () => {
    const wiki = 'This is not a ^ superscript^ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a superscript mark if there is a space before closing ^', () => {
    const wiki = 'This is not a ^superscript ^ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a superscript mark if there is not a space after closing ^', () => {
    const wiki = 'This is not a ^superscript^text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should not be a superscript mark if it is escaped', () => {
    const wiki = 'This is not a ^superscript\\^ text';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('should be a superscript mark and not a table if the character is a pipe', () => {
    const wiki = '^|^';
    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });
});
