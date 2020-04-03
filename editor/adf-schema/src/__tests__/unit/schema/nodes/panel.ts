import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '../../../../../test-helpers';

const schema = makeSchema();

describe(`${name}/schema panel node`, () => {
  it('should have data-panel-type when serializing to DOM', () => {
    const html = toHTML(
      schema.nodes.panel.create({ panelType: 'info' }),
      schema,
    );
    expect(html).toContain('data-panel-type="info"');
  });

  it('should info panel type by default', () => {
    const html = toHTML(schema.nodes.panel.create(), schema);
    expect(html).toContain('data-panel-type="info"');
  });

  it('should extract the correct values of panelType', () => {
    const doc = fromHTML(
      "<div data-panel-type='tip'><p>testing</p></div>",
      schema,
    );
    const panel = doc.firstChild;
    expect(panel && panel.type.name).toContain('panel');
    expect(panel && panel.attrs['panelType']).toContain('tip');
  });
});

function makeSchema() {
  return createSchema({
    nodes: [
      'doc',
      'paragraph',
      'heading',
      'text',
      'panel',
      'orderedList',
      'bulletList',
      'listItem',
    ],
  });
}
