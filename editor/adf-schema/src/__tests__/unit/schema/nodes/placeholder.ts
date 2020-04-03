import { name } from '../../../../version.json';
import { schema, toDOM, fromHTML } from '../../../../../test-helpers';
import { placeholder } from '../../../../../src';

describe(`${name}/schema placeholder node`, () => {
  describe('parse html', () => {
    it('converts to date PM node', () => {
      const doc = fromHTML(
        '<span data-placeholder="Type something..." />',
        schema,
      );
      const node = doc.firstChild!.firstChild!;
      expect(node.type.spec).toEqual(placeholder);
    });

    it('gets attributes from html', () => {
      const doc = fromHTML(
        '<span data-placeholder="Type something..." />',
        schema,
      );
      const node = doc.firstChild!.firstChild!;
      expect(node.attrs.text).toEqual('Type something...');
    });
  });

  describe('encode html', () => {
    it('converts html data attributes to node attributes', () => {
      const attrs = { text: 'Type something...' };
      // extension node can contain no content
      const node = schema.nodes.placeholder.createChecked(attrs);
      const dom = toDOM(node, schema).firstChild! as HTMLElement;
      expect(dom.getAttribute('data-placeholder')).toEqual('Type something...');
    });

    it('encodes and decodes to the same node', () => {
      const attrs = { text: 'Type something...' };
      const node = schema.nodes.placeholder.createChecked(attrs);
      const dom = toDOM(node, schema).firstChild as HTMLElement;
      const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!
        .firstChild!;
      expect(parsedNode).toEqual(node);
    });
  });
});
