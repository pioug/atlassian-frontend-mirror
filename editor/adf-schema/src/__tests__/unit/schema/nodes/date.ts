import { name } from '../../../../version.json';
import { schema, toDOM, fromHTML } from '../../../../../test-helpers';
import { date } from '../../../../../src';

describe(`${name}/schema date node`, () => {
  describe('parse html', () => {
    it('converts to date PM node', () => {
      const doc = fromHTML('<span data-node-type="date" />', schema);
      const node = doc.firstChild!.firstChild!;
      expect(node.type.spec).toEqual(date);
    });

    it('gets attributes from html', () => {
      const timestamp = '1515639075805';
      const doc = fromHTML(
        `
        <span
          data-node-type="date"
          data-timestamp="${timestamp}"
        />
      `,
        schema,
      );
      const node = doc.firstChild!.firstChild!;
      expect(node.attrs.timestamp).toEqual(timestamp);
    });
  });

  describe('encode html', () => {
    it('converts html data attributes to node attributes', () => {
      const attrs = { timestamp: '1515639075805' };
      // extension node can contain no content
      const node = schema.nodes.date.create(attrs);
      const dom = toDOM(node, schema).firstChild! as HTMLElement;
      expect(dom.getAttribute('data-node-type')).toEqual('date');
      expect(dom.getAttribute('data-timestamp')).toEqual(attrs.timestamp);
    });

    it('encodes and decodes to the same node', () => {
      const attrs = { timestamp: '1515639075805' };
      const node = schema.nodes.date.create(attrs);
      const dom = toDOM(node, schema).firstChild as HTMLElement;
      const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!
        .firstChild!;
      expect(parsedNode).toEqual(node);
    });
  });
});
