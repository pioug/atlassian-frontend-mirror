import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { toHTML } from '../../../../../test-helpers';

describe(`${name}/schema confluence-inline-comment mark`, () => {
  it('serializes to the correct HTML', () => {
    const schema = makeSchema();
    const node = schema.text('foo', [
      schema.marks.annotation.create({
        id: 'hash-ref-goes-here',
      }),
    ]);

    const html = toHTML(node, schema);
    expect(html).toContain('data-id="hash-ref-goes-here"');
    expect(html).toContain('data-mark-type="annotation"');
    expect(html).toContain('data-mark-annotation-type="inlineComment"');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text'],
    marks: ['annotation'],
  });
}
