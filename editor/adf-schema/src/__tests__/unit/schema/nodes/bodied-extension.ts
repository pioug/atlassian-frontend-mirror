import { name } from '../../../../version.json';
import {
  schema,
  toDOM,
  fromHTML,
  toContext,
} from '../../../../../test-helpers';
import { bodiedExtension } from '../../../../../src';
import {
  doc,
  bodiedExtension as bodiedExt,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe(`${name}/schema bodiedExtension node`, () => {
  describe('parse html', () => {
    it('converts to extension PM node', () => {
      const doc = fromHTML(
        '<div data-node-type="bodied-extension" data-extension-type="com.example.ext" data-extension-key="ext-007" />',
        schema,
      );
      const node = doc.firstChild!;
      expect(node.type.spec).toEqual(bodiedExtension);
    });

    it('gets attributes from html', () => {
      const extensionType = 'com.atlassian.confluence.macro.core';
      const extensionKey = 'superMacro';
      const parameters = { macroparams: { super: true } };

      const doc = fromHTML(
        `
        <div
          data-node-type="bodied-extension"
          data-extension-type="${extensionType}"
          data-extension-key="${extensionKey}"
          data-parameters='${JSON.stringify(parameters)}'
        ><p>hello</p></div>
      `,
        schema,
      );

      const node = doc.firstChild!;
      expect(node.attrs.extensionType).toEqual(extensionType);
      expect(node.attrs.extensionKey).toEqual(extensionKey);
      expect(node.attrs.parameters).toEqual(parameters);
    });

    it('should not parse extension when pasted inside extension', () => {
      const document = doc(
        bodiedExt({ extensionKey: '', extensionType: '' })(p('{<>}')),
      );
      const context = toContext(document, schema);
      const pmDoc = fromHTML(
        '<div data-node-type="bodied-extension" />',
        schema,
        { context },
      );
      const node = pmDoc.firstChild!;
      expect(node.type.name).toEqual('paragraph');
    });
  });

  describe('encode html', () => {
    it('converts html data attributes to node attributes', () => {
      const attrs = {
        extensionType: 'com.atlassian.confluence.macro',
        extensionKey: 'superMacro',
        parameters: { macroparams: { super: true } },
      };
      const content = schema.nodes.paragraph.create(schema.text('hello'));
      const node = schema.nodes.bodiedExtension.create(attrs, content);
      const dom = toDOM(node, schema).firstChild as HTMLElement;

      expect(dom.getAttribute('data-node-type')).toEqual('bodied-extension');
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
        extensionKey: 'superMacro',
        parameters: { macroparams: { super: true } },
      };
      const content = schema.nodes.paragraph.create(schema.text('hello'));
      const node = schema.nodes.bodiedExtension.create(attrs, content);
      const dom = toDOM(node, schema).firstChild as HTMLElement;
      const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!;
      expect(parsedNode).toEqual(node);
    });
  });
});
