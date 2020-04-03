import { name } from '../../../../version.json';
import { schema, toDOM, fromHTML } from '../../../../../test-helpers';

describe(`${name}/schema mediaSingle node`, () => {
  describe('parse html', () => {
    it('gets attributes from html', () => {
      const doc = fromHTML(
        `
        <div
          data-node-type="mediaSingle"
          data-layout="wrap-right"
          data-width="32.3"
        />
        `,
        schema,
      );

      const mediaSingleNode = doc.firstChild!;

      expect(mediaSingleNode.type).toEqual(schema.nodes.mediaSingle);
      expect(mediaSingleNode.attrs.layout).toEqual('wrap-right');
      expect(mediaSingleNode.attrs.width).toEqual(32.3);
    });

    it('defaults to align center', () => {
      const doc = fromHTML(
        `
        <div
          data-node-type="mediaSingle"
        />
        `,
        schema,
      );

      const mediaSingleNode = doc.firstChild!;

      expect(mediaSingleNode.type).toEqual(schema.nodes.mediaSingle);
      expect(mediaSingleNode.attrs.layout).toEqual('center');
      expect(mediaSingleNode.attrs.width).toBeNull();
    });

    it('auto creates a media node inside mediaSingle node', () => {
      const doc = fromHTML(
        `
        <div
          data-node-type="mediaSingle"
          data-alignment="left"
          data-display="block"
        />
        `,
        schema,
      );

      const mediaSingleNode = doc.firstChild!;

      expect(mediaSingleNode.childCount).toEqual(1);
      expect(mediaSingleNode.child(0)).toEqual(schema.nodes.media.create());
    });
  });

  describe('encode node', () => {
    it('converts layout and nodetype to html data attribute', () => {
      const mediaSingleNode = schema.nodes.mediaSingle.create({
        layout: 'center',
      });

      const mediaSingleDom = toDOM(mediaSingleNode, schema)
        .firstChild as HTMLElement;
      const layout = mediaSingleDom.getAttribute('data-layout');
      const nodeType = mediaSingleDom.getAttribute('data-node-type');

      expect(layout).toEqual('center');
      expect(nodeType).toEqual('mediaSingle');
    });
  });

  it('converts attributes to related data attribute in html with', () => {
    const mediaSingleNode = schema.nodes.mediaSingle.create({
      layout: 'center',
      width: 64.333333,
    });

    const mediaSingleDom = toDOM(mediaSingleNode, schema)
      .firstChild as HTMLElement;
    const layout = mediaSingleDom.getAttribute('data-layout');
    const width = mediaSingleDom.getAttribute('data-width');

    expect(layout).toEqual('center');
    expect(width).toEqual('64.33');
  });

  it('converts attributes with integer width', () => {
    const mediaSingleNode = schema.nodes.mediaSingle.create({
      layout: 'center',
      width: 64,
    });

    const mediaSingleDom = toDOM(mediaSingleNode, schema)
      .firstChild as HTMLElement;
    const layout = mediaSingleDom.getAttribute('data-layout');
    const width = mediaSingleDom.getAttribute('data-width');

    expect(layout).toEqual('center');
    expect(width).toEqual('64');
  });

  it('encodes and decodes wide mediaSingle to the same node', () => {
    const { mediaSingle, media } = schema.nodes;
    const mediaSingleNode = mediaSingle.create(
      {
        layout: 'wide',
      },
      media.create(),
    );

    const mediaSingleDom = toDOM(mediaSingleNode, schema)
      .firstChild as HTMLElement;

    const parsedMediaSingle = fromHTML(mediaSingleDom.outerHTML, schema)
      .firstChild;

    expect(parsedMediaSingle).toEqual(mediaSingleNode);
  });

  it('encodes and decodes mediaSingle with width to the same node', () => {
    const { mediaSingle, media } = schema.nodes;
    const mediaSingleNode = mediaSingle.create(
      {
        layout: 'center',
        width: 32.5,
      },
      media.create(),
    );

    const mediaSingleDom = toDOM(mediaSingleNode, schema)
      .firstChild as HTMLElement;

    const parsedMediaSingle = fromHTML(mediaSingleDom.outerHTML, schema)
      .firstChild;

    expect(parsedMediaSingle).toEqual(mediaSingleNode);
  });
});
