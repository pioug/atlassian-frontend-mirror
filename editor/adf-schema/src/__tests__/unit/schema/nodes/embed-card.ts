import { name } from '../../../../version.json';
import { toDOM, fromHTML } from '../../../../../test-helpers';
import { createSchema } from '../../../../schema/create-schema';
import { embedCard } from '../../../../schema/nodes/embed-card';

describe(`${name}/schema embedCard node`, () => {
  const schema = createSchema({
    nodes: ['doc', 'paragraph', 'embedCard', 'text'],
  });

  const url = 'https://product-fabric.atlassian.net/browse/ED-1';

  describe('embedCard with "url" attribute', () => {
    describe('parse html', () => {
      it('converts to embedCard PM node', () => {
        const doc = fromHTML(
          `<meta charset='utf-8'><div data-embed-card="" data-card-url="https://product-fabric.atlassian.net/browse/ED-1" data-layout="center"></div>`,
          schema,
        );
        const node = doc.firstChild!;
        expect(node.type.spec).toEqual(embedCard);
      });

      it('gets attributes from html', () => {
        const doc = fromHTML(
          `<meta charset='utf-8'><div data-embed-card="" data-card-url="https://product-fabric.atlassian.net/browse/ED-1" data-layout="center"></div>`,
          schema,
        );

        const node = doc.firstChild!;
        expect(node.attrs.url).toEqual(url);
      });
    });

    describe('encode html', () => {
      it('converts html data attributes to node attributes', () => {
        const dom = toDOM(
          schema.nodes.embedCard.create({ url, layout: 'center', width: 50 }),
          schema,
        ).firstChild as HTMLElement;

        expect(dom.getAttribute('data-card-url')).toEqual(url);
        expect(dom.getAttribute('data-layout')).toEqual('center');
        expect(dom.getAttribute('data-width')).toEqual('50');
      });

      it('encodes and decodes to the same node', () => {
        const node = schema.nodes.embedCard.create({
          url,
          layout: 'center',
          width: 50,
        });
        const dom = toDOM(node, schema).firstChild as HTMLElement;
        const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!;
        expect(parsedNode).toEqual(node);
      });
    });
  });
});
