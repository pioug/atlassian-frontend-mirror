import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML } from '../../../../../test-helpers';

const schema = makeSchema();

describe(`${name}/schema layout-section node`, () => {
  it('serializes to <div data-layout-section="true"/>', () => {
    const html = toHTML(schema.nodes.layoutSection.create(), schema);
    expect(html).toContain('<div data-layout-section="true">');
  });

  it('matches <div data-layout-section="true" />', () => {
    const doc = fromHTML('<div data-layout-section="true" />', schema);
    const node = doc.firstChild!;
    expect(node.type.name).toEqual('layoutSection');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'layoutSection', 'layoutColumn', 'paragraph', 'text'],
  });
}
