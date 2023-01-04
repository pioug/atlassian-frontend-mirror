import { schema, toHTML } from '@atlaskit/editor-test-helpers/adf-schema';
const packageName = process.env._PACKAGE_NAME_ as string;

describe(`${packageName}/schema orderedList node`, () => {
  it('should be possible to create an ordered list item with an order attribute', () => {
    const html = toHTML(
      schema.nodes.orderedList.create(
        { order: 6 },
        schema.nodes.listItem.create({}, schema.nodes.paragraph.create()),
      ),
      schema,
    );
    expect(html).toContain('<ol start="6" class="ak-ol"><li><p></p></li></ol>');
  });

  it('should not be possible to have an ordered list starting from a negative number', () => {
    const html = toHTML(
      schema.nodes.orderedList.create(
        { order: -6 },
        schema.nodes.listItem.create({}, schema.nodes.paragraph.create()),
      ),
      schema,
    );
    expect(html).toContain('<ol class="ak-ol"><li><p></p></li></ol>');
  });

  it('should not be possible to have an ordered list with order of a string', () => {
    const html = toHTML(
      schema.nodes.orderedList.create(
        { order: 'string' },
        schema.nodes.listItem.create({}, schema.nodes.paragraph.create()),
      ),
      schema,
    );
    expect(html).toContain('<ol class="ak-ol"><li><p></p></li></ol>');
  });

  it('should not be possible to have an ordered list with order of a decimal number', () => {
    const html = toHTML(
      schema.nodes.orderedList.create(
        { order: 2.9 },
        schema.nodes.listItem.create({}, schema.nodes.paragraph.create()),
      ),
      schema,
    );
    expect(html).toContain('<ol start="2" class="ak-ol"><li><p></p></li></ol>');
  });
});
