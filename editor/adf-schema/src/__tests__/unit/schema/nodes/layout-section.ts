import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML } from '../../../../../test-helpers';
import {
  unsupportedBlock,
  layoutSection,
  doc,
  layoutColumn,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

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

  describe('when there is multiple unsupportedBlock after some layoutColumn', () => {
    it('should not throw an invalid content exception', () => {
      const documentRaw = doc(
        // prettier-ignore
        layoutSection(
          layoutColumn({ width: 33 })(
            p(''),
          ),
          layoutColumn({ width: 33 })(
            p(''),
          ),
          layoutColumn({ width: 33 })(
            p(''),
          ),

          unsupportedBlock({})(),
        ),
      );

      expect(() => {
        documentRaw(schema);
      }).not.toThrow();
    });
  });

  describe('when there is only one unsupportedBlock inside a layoutSection', () => {
    it('should not throw an invalid content exception', () => {
      const documentRaw = doc(
        // prettier-ignore
        layoutSection(
          unsupportedBlock({})(),
        ),
      );

      expect(() => {
        documentRaw(schema);
      }).not.toThrow();
    });
  });

  describe('when there is only one layoutColumn inside a layoutSection', () => {
    it('should throw an invalid content exception', () => {
      const documentRaw = doc(
        // prettier-ignore
        layoutSection(
          layoutColumn({ width: 100 })(
            p(''),
          ),
        ),
      );

      expect(() => {
        documentRaw(schema);
      }).not.toThrow();
    });
  });
});

function makeSchema() {
  return createSchema({
    nodes: [
      'doc',
      'unsupportedBlock',
      'layoutSection',
      'layoutColumn',
      'paragraph',
      'text',
    ],
  });
}
