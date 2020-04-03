import { name } from '../../../../version.json';
import { schema, fromHTML, toHTML } from '../../../../../test-helpers';
import { inlineNodes } from '../../../../schema/inline-nodes';

describe(`${name}/schema unknownBlock node`, () => {
  describe('should be able to parse inline node', () => {
    inlineNodes.forEach(node => {
      if (node === 'image') {
        return;
      }
      it(node, () => {
        let element;

        // schema.nodes.text.create() is not valid
        // https://discuss.prosemirror.net/t/how-i-can-create-text-node-types/759
        if ('text' === node) {
          element = toHTML(schema.text('foo'), schema);
        } else {
          element = toHTML(schema.nodes[node].create(), schema);
        }

        const doc = fromHTML(
          `<div data-node-type="unknownBlock">${element}</div>`,
          schema,
        );
        const span = doc.firstChild!;
        const elementNode = span.firstChild!;

        expect(elementNode).toBeDefined();
        expect(elementNode).toHaveProperty('type');
        expect(elementNode.type).toEqual(schema.nodes[node]);
      });
    });
  });
});
