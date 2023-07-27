import {
  schema,
  toDOM,
  fromHTML,
} from '@atlaskit/editor-test-helpers/adf-schema';
import { createSchema } from '../../../../schema';

const packageName = process.env._PACKAGE_NAME_ as string;

function makeSchema() {
  return createSchema({
    nodes: [
      'doc',
      'paragraph',
      'text',
      'mediaSingle',
      'media',
      'caption',
      'unsupportedBlock',
    ],
    marks: ['border', 'link', 'unsupportedMark', 'unsupportedNodeAttribute'],
  });
}

describe(`${packageName}/schema mediaSingle node`, () => {
  describe('parse html', () => {
    it('gets attributes from html', () => {
      const doc = fromHTML(
        `
        <div
          data-node-type="mediaSingle"
          data-layout="wrap-right"
          data-width="32.3"
          data-width-type="percentage"
        />
        `,
        schema,
      );

      const mediaSingleNode = doc.firstChild!;

      expect(mediaSingleNode.type).toEqual(schema.nodes.mediaSingle);
      expect(mediaSingleNode.attrs.layout).toEqual('wrap-right');
      expect(mediaSingleNode.attrs.width).toEqual(32.3);
      expect(mediaSingleNode.attrs.widthType).toEqual('percentage');
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
      expect(mediaSingleNode.attrs.widthType).toBeNull();
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

    it('should discard widthType if widthType is supported', () => {
      const customSchema = makeSchema();
      const doc = fromHTML(
        `
        <div
          data-node-type="mediaSingle"
          data-layout="wrap-right"
          data-width="32.3"
          data-width-type="percentage"
        />
        `,
        customSchema,
      );

      const mediaSingleNode = doc.firstChild!;
      expect(mediaSingleNode.type).toEqual(customSchema.nodes.mediaSingle);
      expect(mediaSingleNode.attrs.layout).toEqual('wrap-right');
      expect(mediaSingleNode.attrs.width).toEqual(32.3);
      expect(mediaSingleNode.attrs.widthType).toBeFalsy();
    });

    it('should discard width attributes if widthType is provided but not supported', () => {
      const customSchema = makeSchema();
      const doc = fromHTML(
        `
        <div
          data-node-type="mediaSingle"
          data-layout="wrap-right"
          data-width="32.3"
          data-width-type="pixel"
        />
        `,
        customSchema,
      );

      const mediaSingleNode = doc.firstChild!;
      expect(mediaSingleNode.type).toEqual(customSchema.nodes.mediaSingle);
      expect(mediaSingleNode.attrs.layout).toEqual('wrap-right');
      expect(mediaSingleNode.attrs.width).toBeFalsy();
      expect(mediaSingleNode.attrs.widthType).toBeFalsy();
    });

    it('should keep width attributes if widthType supported', () => {
      const doc = fromHTML(
        `
        <div
          data-node-type="mediaSingle"
          data-layout="wrap-right"
          data-width="32.3"
          data-width-type="pixel"
        />
        `,
        schema,
      );

      const mediaSingleNode = doc.firstChild!;
      expect(mediaSingleNode.type).toEqual(schema.nodes.mediaSingle);
      expect(mediaSingleNode.attrs.layout).toEqual('wrap-right');
      expect(mediaSingleNode.attrs.width).toEqual(32.3);
      expect(mediaSingleNode.attrs.widthType).toEqual('pixel');
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

  it('converts attributes with widthType', () => {
    const mediaSingleNode = schema.nodes.mediaSingle.create({
      layout: 'center',
      width: 640,
      widthType: 'pixel',
    });

    const mediaSingleDom = toDOM(mediaSingleNode, schema)
      .firstChild as HTMLElement;
    const layout = mediaSingleDom.getAttribute('data-layout');
    const width = mediaSingleDom.getAttribute('data-width');
    const widthType = mediaSingleDom.getAttribute('data-width-type');

    expect(layout).toEqual('center');
    expect(width).toEqual('640');
    expect(widthType).toEqual('pixel');
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

    const parsedMediaSingle = fromHTML(
      mediaSingleDom.outerHTML,
      schema,
    ).firstChild;

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

    const parsedMediaSingle = fromHTML(
      mediaSingleDom.outerHTML,
      schema,
    ).firstChild;

    expect(parsedMediaSingle).toEqual(mediaSingleNode);
  });
});
