import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML } from '@atlaskit/editor-test-helpers/adf-schema';

const schema = makeSchema();
const packageName = process.env._PACKAGE_NAME_ as string;

describe(`${packageName}/schema paragraph node`, () => {
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
