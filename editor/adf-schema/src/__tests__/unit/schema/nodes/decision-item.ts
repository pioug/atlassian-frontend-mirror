import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '../../../../../test-helpers';

const schema = makeSchema();

describe(`${name}/schema decisionItem node`, () => {
  it('serializes to <li> with proper data-attributes', () => {
    const html = toHTML(schema.nodes.decisionItem.create(), schema);
    expect(html).toContain('<li');
    expect(html).toContain('data-decision-local-id');
    expect(html).toContain('data-decision-state');
  });

  it('matches <li data-decision-local-id>', () => {
    const doc = fromHTML('<li  data-decision-local-id>', schema);
    const decisionItem = doc.firstChild!.firstChild!;
    expect(decisionItem.type.name).toEqual('decisionItem');
  });

  it('does not match <li>', () => {
    const doc = fromHTML('<li>', schema);
    const listItem = doc.firstChild!.firstChild!;
    expect(listItem.type.name).toEqual('listItem');
  });

  it('decisionItem requires defining to be true', () => {
    expect(schema.nodes.decisionItem.spec.defining).toBe(true);
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
