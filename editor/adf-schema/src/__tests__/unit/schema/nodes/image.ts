import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML } from '../../../../../test-helpers';

const schema = makeSchema();
const src = 'http://test.com';
const srcDataURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAY)';

describe(`${name}/schema image node`, () => {
  it('serializes to <img>', () => {
    const html = toHTML(schema.nodes.image.create({ src }), schema);
    expect(html).toContain(`<img src="${src}">`);
  });

  it('matches <img src="...">', () => {
    const doc = fromHTML(`<img src="${src}" />`, schema);
    const img = doc.firstChild!.firstChild!;
    expect(img.type.name).toEqual('image');
  });

  it('does not match <img src="data:image/...">', () => {
    const doc = fromHTML(`<img src="${srcDataURI}" />`, schema);
    const img = doc.firstChild!.firstChild!;
    expect(img).toBeNull();
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text', 'image'],
  });
}
