import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '../../../../../test-helpers';

const schema = makeSchema();

describe(`${name}/schema hardBreak node`, () => {
  it('serializes to <br>', () => {
    const html = toHTML(schema.nodes.hardBreak.create(), schema);
    expect(html).toContain('<br>');
  });

  it('matches <br>', () => {
    const doc = fromHTML('<br>', schema);
    const br = doc.firstChild!.firstChild!;
    expect(br.type.name).toEqual('hardBreak');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text', 'hardBreak'],
  });
}
