import { name } from '../../../../version.json';
import { schema, toDOM, fromHTML } from '../../../../../test-helpers';
import { inlineExtension } from '../../../../../src';

describe(`${name}/schema inlineExtension node`, () => {
  describe('parse html', () => {
    it('converts to inlineExtension PM node', () => {
      const doc = fromHTML(
        '<span data-extension-type="com.atlassian.confluence.macro" data-extension-key="status" />',
        schema,
      );
      const node = doc.firstChild!.firstChild!;
      expect(node.type.spec).toEqual(inlineExtension);
    });

    it('gets attributes from html', () => {
      const extensionType = 'com.atlassian.confluence.macro';
      const extensionKey = 'status';
      const parameters = { color: 'yellow', text: 'In progress' };

      const doc = fromHTML(
        `
        <span
          data-extension-type="${extensionType}"
          data-extension-key="${extensionKey}"
          data-parameters='${JSON.stringify(parameters)}'
        />
      `,
        schema,
      );

      const node = doc.firstChild!.firstChild!;
      expect(node.attrs.extensionType).toEqual(extensionType);
      expect(node.attrs.extensionKey).toEqual(extensionKey);
      expect(node.attrs.parameters).toEqual(parameters);
    });
  });

  describe('encode html', () => {
    it('converts html data attributes to node attributes', () => {
      const attrs = {
        extensionType: 'com.atlassian.confluence.macro',
        extensionKey: 'status',
        parameters: {
          macroparams: { color: 'green', text: 'Decided' },
        },
      };
      const dom = toDOM(schema.nodes.inlineExtension.create(attrs), schema)
        .firstChild as HTMLElement;

      expect(dom.getAttribute('data-extension-type')).toEqual(
        attrs.extensionType,
      );
      expect(dom.getAttribute('data-extension-key')).toEqual(
        attrs.extensionKey,
      );
      expect(dom.getAttribute('data-parameters')).toEqual(
        JSON.stringify(attrs.parameters),
      );
    });

    it('encodes and decodes to the same node', () => {
      const attrs = {
        extensionType: 'com.atlassian.confluence.macro',
        extensionKey: 'status',
        parameters: {
          macroparams: { color: 'red', text: 'At risk' },
        },
      };
      const node = schema.nodes.inlineExtension.create(attrs);
      const dom = toDOM(node, schema).firstChild as HTMLElement;
      const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!
        .firstChild!;
      expect(parsedNode).toEqual(node);
    });
  });
});
