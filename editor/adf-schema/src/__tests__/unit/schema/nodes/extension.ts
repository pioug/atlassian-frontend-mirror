import { name } from '../../../../version.json';
import { schema, toDOM, fromHTML } from '../../../../../test-helpers';
import { extension } from '../../../../../src';

describe(`${name}/schema extension node`, () => {
  describe('parse html', () => {
    it('converts to extension PM node', () => {
      const doc = fromHTML('<div data-node-type="extension" />', schema);
      const node = doc.firstChild!;
      expect(node.type.spec).toEqual(extension);
    });

    it('gets attributes from html', () => {
      const extensionType = 'com.atlassian.confluence.macro.core';
      const extensionKey = 'gallery';
      const parameters = { macroparams: { width: '100px' } };

      const doc = fromHTML(
        `
        <div
          data-node-type="extension"
          data-extension-type="${extensionType}"
          data-extension-key="${extensionKey}"
          data-parameters='${JSON.stringify(parameters)}'
        />
      `,
        schema,
      );

      const node = doc.firstChild!;
      expect(node.attrs.extensionType).toEqual(extensionType);
      expect(node.attrs.extensionKey).toEqual(extensionKey);
      expect(node.attrs.parameters).toEqual(parameters);
    });
  });

  describe('encode html', () => {
    it('converts html data attributes to node attributes', () => {
      const attrs = {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'gallery',
        parameters: { macroparams: { width: '100px' } },
      };
      // extension node can contain no content
      const node = schema.nodes.extension.create(attrs);
      const dom = toDOM(node, schema).firstChild as HTMLElement;

      expect(dom.getAttribute('data-node-type')).toEqual('extension');
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
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'gallery',
        parameters: { macroparams: { width: '100px' } },
      };
      const node = schema.nodes.extension.create(attrs);
      const dom = toDOM(node, schema).firstChild as HTMLElement;
      const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!;
      expect(parsedNode).toEqual(node);
    });
  });
});
