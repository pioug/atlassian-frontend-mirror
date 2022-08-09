import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML } from '@atlaskit/editor-test-helpers/adf-schema';

const schema = makeSchema();
const packageName = process.env._PACKAGE_NAME_ as string;

describe(`${packageName}/schema rule node`, () => {
  it('serializes to <hr/>', () => {
    const html = toHTML(schema.nodes.rule.create(), schema);
    expect(html).toContain('<hr>');
  });

  it('matches <hr/>', () => {
    const doc = fromHTML('<hr/>', schema);
    const p = doc.firstChild!;
    expect(p.type.name).toEqual('rule');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'rule', 'text'],
  });
}
