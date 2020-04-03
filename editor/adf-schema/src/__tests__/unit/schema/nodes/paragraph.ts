import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML } from '../../../../../test-helpers';

const schema = makeSchema();

describe(`${name}/schema paragraph node`, () => {
  it('serializes to <p>', () => {
    const html = toHTML(schema.nodes.paragraph.create(), schema);
    expect(html).toContain('<p>');
  });

  it('matches <p>', () => {
    const doc = fromHTML('<p>Hello World</p>', schema);
    const p = doc.firstChild!;
    expect(p.type.name).toEqual('paragraph');
    expect(p.firstChild!.text!).toEqual('Hello World');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text'],
  });
}
