import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '../../../../../test-helpers';
import { Schema } from 'prosemirror-model';

describe(`${name}/schema data-consumer mark`, () => {
  let schema: Schema;
  const firstSourceId = 'first-source-id';
  const secondSourceId = 'second-source-id';
  const dataSourceString = `&quot;${firstSourceId}&quot;,&quot;${secondSourceId}&quot;`;

  beforeEach(() => {
    schema = makeSchema();
  });

  it('serializes to the correct HTML', () => {
    const node = schema.text('foo', [
      schema.marks.dataConsumer.create({
        sources: [firstSourceId, secondSourceId],
      }),
    ]);
    const html = toHTML(node, schema);

    expect(html).toContain(`data-sources="[${dataSourceString}]"`);
    expect(html).toContain('data-mark-type="dataConsumer"');
  });

  it.each(['div', 'span'])(
    'parses annotation correctly from html for %s',
    (wrapperType) => {
      const doc = fromHTML(
        `<${wrapperType} data-mark-type="dataConsumer" data-sources="[${dataSourceString}]">foo</${wrapperType}>`,
        schema,
      );
      const dataConsumerNode = doc.firstChild!;

      expect(dataConsumerNode.marks).toHaveLength(1);
      expect(dataConsumerNode.marks[0].type.name).toBe('dataConsumer');
      expect(dataConsumerNode.marks[0].attrs).toEqual({
        sources: [firstSourceId, secondSourceId],
      });
    },
  );
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text'],
    marks: ['dataConsumer'],
  });
}
