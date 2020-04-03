import { name } from '../../../../version.json';
import { schema, toDOM, fromHTML } from '../../../../../test-helpers';
import { expand } from '../../../../../src';

describe(`${name}/schema expand node`, () => {
  describe('parse html', () => {
    it('converts to PM node', () => {
      const doc = fromHTML('<div data-node-type="expand" />', schema);
      const node = doc.firstChild!;
      expect(node.type.spec).toEqual(expand);
    });

    it('gets attributes from html', () => {
      const title = 'Homer Simpson';
      const doc = fromHTML(
        `
        <div
          data-node-type="expand"
          data-title="${title}"
        ><p>hello</p></div>
      `,
        schema,
      );

      const node = doc.firstChild!;
      expect(node.attrs.title).toEqual(title);
    });
  });

  describe('encode html', () => {
    it('converts html data attributes to node attributes', () => {
      const title = 'Homer Simpson';
      const content = schema.nodes.paragraph.create(schema.text('hello'));
      const node = schema.nodes.expand.create({ title }, content);
      const dom = toDOM(node, schema).firstChild as HTMLElement;

      expect(dom.getAttribute('data-node-type')).toEqual('expand');
      expect(dom.getAttribute('data-title')).toEqual(title);
    });

    it('encodes and decodes to the same node', () => {
      const title = 'Homer Simpson';
      const content = schema.nodes.paragraph.create(schema.text('hello'));
      const node = schema.nodes.expand.create({ title }, content);
      const dom = toDOM(node, schema).firstChild as HTMLElement;
      const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!;
      expect(parsedNode).toEqual(node);
    });
  });
});
