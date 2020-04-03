import { name } from '../../../../version.json';
import { schema, toDOM, fromHTML } from '../../../../../test-helpers';

describe(`${name}/schema unsupportedBlock node`, () => {
  const originalValue = {
    type: 'invalidNode',
    content: [
      {
        type: 'text',
        text: 'foo',
      },
    ],
  };

  it('should parse unsupported block nodes', () => {
    const doc = fromHTML(
      `<div
        data-node-type="unsupportedBlock"
        data-original-value='${JSON.stringify(originalValue)}'
      />`,
      schema,
    );
    const unsupportedBlockNode = doc.firstChild!;
    expect(unsupportedBlockNode.type).toEqual(schema.nodes.unsupportedBlock);
    expect(unsupportedBlockNode.attrs.originalValue).toEqual(originalValue);
  });

  it('should encode unsupported block nodes to html', () => {
    const unsupportedBlockNode = schema.nodes.unsupportedBlock.create({
      originalValue,
    });
    const domNode = toDOM(unsupportedBlockNode, schema)
      .firstChild as HTMLElement;

    expect(domNode.getAttribute('data-original-value')).toEqual(
      JSON.stringify(originalValue),
    );
  });
});
