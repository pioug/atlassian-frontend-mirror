import { name } from '../../../../version.json';
import { toDOM, fromHTML } from '../../../../../test-helpers';
import { createSchema } from '../../../../schema/create-schema';
import { inlineCard } from '../../../../schema/nodes/inline-card';

describe(`${name}/schema inlineCard node`, () => {
  const schema = createSchema({
    nodes: ['doc', 'paragraph', 'inlineCard', 'text'],
  });

  const url = 'https://product-fabric.atlassian.net/browse/ED-1';
  const data = {
    '@type': 'Document',
    generator: {
      '@type': 'Application',
      name: 'Confluence',
    },
    url:
      'https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424',
    name: 'Founder Update 76: Hello, Trello!',
    summary:
      'Today is a big day for Atlassian – we have entered into an agreement to buy Trello. (boom)',
  };

  describe('inlineCard with "url" attribute', () => {
    describe('parse html', () => {
      it('converts to inlineCard PM node', () => {
        const doc = fromHTML(`<a data-inline-card href="${url}" />`, schema);
        const node = doc.firstChild!.firstChild!;
        expect(node.type.spec).toEqual(inlineCard);
      });

      it('gets attributes from html', () => {
        const doc = fromHTML(`<a data-inline-card href="${url}" />`, schema);

        const node = doc.firstChild!.firstChild!;
        expect(node.attrs.url).toEqual(url);
        expect(node.attrs.data).toEqual(null);
      });
    });

    describe('encode html', () => {
      it('converts html data attributes to node attributes', () => {
        const dom = toDOM(schema.nodes.inlineCard.create({ url }), schema)
          .firstChild as HTMLElement;

        expect(dom.getAttribute('href')).toEqual(url);
      });

      it('encodes and decodes to the same node', () => {
        const node = schema.nodes.inlineCard.create({ url });
        const dom = toDOM(node, schema).firstChild as HTMLElement;
        const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!
          .firstChild!;
        expect(parsedNode).toEqual(node);
      });
    });
  });

  describe('inlineCard with "data" attribute', () => {
    describe('parse html', () => {
      it('converts to inlineCard PM node', () => {
        const doc = fromHTML(
          `<a data-inline-card href="" data-card-data='${JSON.stringify(
            data,
          )}' />`,
          schema,
        );
        const node = doc.firstChild!.firstChild!;
        expect(node.type.spec).toEqual(inlineCard);
      });

      it('gets attributes from html', () => {
        const doc = fromHTML(
          `<a data-inline-card href="" data-card-data='${JSON.stringify(
            data,
          )}' />`,
          schema,
        );

        const node = doc.firstChild!.firstChild!;
        expect(node.attrs.data).toEqual(data);
      });
    });

    describe('encode html', () => {
      it('converts html data attributes to node attributes', () => {
        const dom = toDOM(schema.nodes.inlineCard.create({ data }), schema)
          .firstChild as HTMLElement;

        expect(dom.getAttribute('href')).toEqual('');
        expect(dom.getAttribute('data-card-data')).toEqual(
          JSON.stringify(data),
        );
      });

      it('encodes and decodes to the same node', () => {
        const node = schema.nodes.inlineCard.create({ url });
        const dom = toDOM(node, schema).firstChild as HTMLElement;
        const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!
          .firstChild!;
        expect(parsedNode).toEqual(node);
      });
    });
  });
});
