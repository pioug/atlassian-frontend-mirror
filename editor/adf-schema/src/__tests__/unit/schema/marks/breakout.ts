import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { toHTML } from '../../../../../test-helpers';

describe(`${name}/schema breakout mark`, () => {
  it('serializes to the correct HTML', () => {
    const schema = makeSchema();
    const node = schema.nodes.codeBlock.create(
      {},
      [],
      [schema.marks.breakout.create({ mode: 'wide' })],
    );
    const html = toHTML(node, schema);
    expect(html).toContain('data-mode="wide"');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text', 'codeBlock'],
    marks: ['breakout'],
  });
}
