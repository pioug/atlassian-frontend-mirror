import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '../../../../../test-helpers';

const schema = makeSchema();

describe(`${name}/schema decisionList node`, () => {
  it('serializes to <ol> with proper data-attributes', () => {
    const html = toHTML(
      schema.nodes.decisionList.create({ localId: 'cheese' }),
      schema,
    );
    expect(html).toContain('<ol');
    expect(html).toContain('data-decision-list-local-id="cheese"');
  });

  it('matches <ol data-decision-list-local-id>', () => {
    const doc = fromHTML(
      '<ol data-node-type="decisionList" data-decision-list-local-id>',
      schema,
    );
    const decisionList = doc.firstChild!;
    expect(decisionList.type.name).toEqual('decisionList');
    expect(decisionList.attrs.localId).not.toEqual(undefined);
  });

  it('does not match <ol>', () => {
    const doc = fromHTML('<ol>', schema);
    const orderedList = doc.firstChild!;
    expect(orderedList.type.name).toEqual('orderedList');
  });

  it('decisionList requires defining to be true', () => {
    expect(schema.nodes.decisionList.spec.defining).toBe(true);
  });
});

function makeSchema() {
  return createSchema({
    nodes: [
      'doc',
      'paragraph',
      'heading',
      'text',
      'decisionList',
      'decisionItem',
      'orderedList',
      'bulletList',
      'listItem',
    ],
  });
}
