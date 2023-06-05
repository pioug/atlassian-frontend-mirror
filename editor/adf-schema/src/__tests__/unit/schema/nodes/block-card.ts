import { toDOM, fromHTML } from '@atlaskit/editor-test-helpers/adf-schema';
import { createSchema } from '../../../../schema/create-schema';
import { blockCard } from '../../../../schema/nodes/block-card';

const packageName = process.env._PACKAGE_NAME_ as string;

describe(`${packageName}/schema blockCard node`, () => {
  const schema = createSchema({
    nodes: ['doc', 'paragraph', 'blockCard', 'text'],
  });

  const url = 'https://product-fabric.atlassian.net/browse/ED-1';
  const data = {
    '@type': 'Document',
    generator: {
      '@type': 'Application',
      name: 'Confluence',
    },
    url: 'https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424',
    name: 'Founder Update 76: Hello, Trello!',
    summary:
      'Today is a big day for Atlassian – we have entered into an agreement to buy Trello. (boom)',
  };
  const datasource = {
    id: 'datasource-id',
    parameters: { jql: 'EDM=jql', cloudId: 'cloud-id' },
    width: 0,
    layout: 'center',
    views: [{ type: 'table', properties: { columnKeys: ['col1', 'col2'] } }],
  };

  describe('blockCard with "url" attribute', () => {
    describe('parse html', () => {
      it('converts to blockCard PM node', () => {
        const doc = fromHTML(`<a data-block-card href="${url}" />`, schema);
        const node = doc.firstChild!;
        expect(node.type.spec).toEqual(blockCard);
      });

      it('gets attributes from html', () => {
        const doc = fromHTML(`<a data-block-card href="${url}" />`, schema);

        const node = doc.firstChild!;
        expect(node.attrs.url).toEqual(url);
        expect(node.attrs.data).toEqual(null);
      });
    });

    describe('encode html', () => {
      it('converts html data attributes to node attributes', () => {
        const dom = toDOM(schema.nodes.blockCard.create({ url }), schema)
          .firstChild as HTMLElement;

        expect(dom.getAttribute('href')).toEqual(url);
        expect(dom.getAttribute('data-card-data')).toEqual('');
      });

      it('encodes and decodes to the same node', () => {
        const node = schema.nodes.blockCard.create({ url });
        const dom = toDOM(node, schema).firstChild as HTMLElement;
        const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!;
        expect(parsedNode).toEqual(node);
      });
    });
  });

  describe('blockCard with "data" attribute', () => {
    describe('parse html', () => {
      it('converts to blockCard PM node', () => {
        const doc = fromHTML(
          `<a data-block-card href="" data-card-data='${JSON.stringify(
            data,
          )}' />`,
          schema,
        );
        const node = doc.firstChild!;
        expect(node.type.spec).toEqual(blockCard);
      });

      it('gets attributes from html', () => {
        const doc = fromHTML(
          `<a data-block-card href="" data-card-data='${JSON.stringify(
            data,
          )}' />`,
          schema,
        );

        const node = doc.firstChild!;
        expect(node.attrs.data).toEqual(data);
      });
    });

    describe('encode html', () => {
      it('converts html data attributes to node attributes', () => {
        const dom = toDOM(schema.nodes.blockCard.create({ data }), schema)
          .firstChild as HTMLElement;

        expect(dom.getAttribute('href')).toEqual('');
        expect(dom.getAttribute('data-card-data')).toEqual(
          JSON.stringify(data),
        );
      });

      it('encodes and decodes to the same node', () => {
        const node = schema.nodes.blockCard.create({ data });
        const dom = toDOM(node, schema).firstChild as HTMLElement;
        const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!;
        expect(parsedNode).toEqual(node);
      });
    });
  });

  describe('blockCard with "datasource" attribute', () => {
    describe('parse html', () => {
      it('converts to blockCard PM node', () => {
        const doc = fromHTML(
          `<a data-block-card href="" data-datasource='${JSON.stringify(
            datasource,
          )}' />`,
          schema,
        );
        const node = doc.firstChild!;
        expect(node.type.spec).toEqual(blockCard);
      });

      it('gets attributes from html', () => {
        const doc = fromHTML(
          `<a data-block-card href="" data-datasource='${JSON.stringify(
            datasource,
          )}' />`,
          schema,
        );

        const node = doc.firstChild!;
        expect(node.attrs.datasource).toEqual(datasource);
      });
    });

    describe('encode html', () => {
      it('converts html datasource attributes to node attributes', () => {
        const dom = toDOM(schema.nodes.blockCard.create({ datasource }), schema)
          .firstChild as HTMLElement;

        expect(dom.getAttribute('href')).toEqual('');
        expect(dom.getAttribute('data-datasource')).toEqual(
          JSON.stringify(datasource),
        );
      });

      it('encodes and decodes to the same node', () => {
        const node = schema.nodes.blockCard.create({ datasource });
        const dom = toDOM(node, schema).firstChild as HTMLElement;
        const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!;
        expect(parsedNode).toEqual(node);
      });
    });
  });
});
