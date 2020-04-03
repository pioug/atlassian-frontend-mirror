import { name } from '../../../../version.json';
import { fromHTML, toDOM, schema } from '../../../../../test-helpers';

describe(`${name}/schema mediaGroup node`, () => {
  describe('parse html', () => {
    it('gets attributes from html', () => {
      const doc = fromHTML(
        `
        <div
          data-node-type="mediaGroup"
        />
        `,
        schema,
      );

      const mediaGroupNode = doc.firstChild!;

      expect(mediaGroupNode.type).toEqual(schema.nodes.mediaGroup);
    });

    it('auto creates a media node inside mediaSingle node', () => {
      const doc = fromHTML(
        `
        <div
          data-node-type="mediaGroup"
        />
        `,
        schema,
      );

      const mediaGroupNode = doc.firstChild!;

      expect(mediaGroupNode.childCount).toEqual(1);
      expect(mediaGroupNode.child(0)).toEqual(schema.nodes.media.create());
    });
  });

  describe('encode node', () => {
    it('converts attributes to related data attribute in html', () => {
      const mediaGroupNode = schema.nodes.mediaGroup.create();

      const mediaGroupDom = toDOM(mediaGroupNode, schema)
        .firstChild as HTMLElement;
      const nodeType = mediaGroupDom.getAttribute('data-node-type');

      expect(nodeType).toEqual('mediaGroup');
    });
  });

  it('encodes and decodes to the same node', () => {
    const { mediaGroup, media } = schema.nodes;
    const mediaGroupNode = mediaGroup.create({}, media.create());

    const mediaGroupDom = toDOM(mediaGroupNode, schema)
      .firstChild as HTMLElement;

    const parsedMediaGroup = fromHTML(mediaGroupDom.outerHTML, schema)
      .firstChild;

    expect(parsedMediaGroup).toEqual(mediaGroupNode);
  });
});
