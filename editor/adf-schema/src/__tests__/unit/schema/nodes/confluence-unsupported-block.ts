import { name } from '../../../../version.json';
import { schema, toDOM, fromHTML } from '../../../../../test-helpers';

describe(`${name}/schema unsupportedBlock node`, () => {
  it('should parse unsupported block nodes', () => {
    const doc = fromHTML(
      '<div data-node-type="confluenceUnsupportedBlock" data-confluence-unsupported="block" data-confluence-unsupported-block-cxhtml="foobar"/>',
      schema,
    );
    const unsupportedBlockNode = doc.firstChild!;
    expect(unsupportedBlockNode.type).toEqual(
      schema.nodes.confluenceUnsupportedBlock,
    );
    expect(unsupportedBlockNode.attrs.cxhtml).toEqual('foobar');
  });

  it('should encode unsupported block nodes to html', () => {
    const unsupportedBlockNode = schema.nodes.confluenceUnsupportedBlock.create(
      { cxhtml: 'foobar' },
    );
    const domNode = toDOM(unsupportedBlockNode, schema)
      .firstChild as HTMLElement;

    expect(domNode.getAttribute('data-confluence-unsupported')).toEqual(
      'block',
    );
    expect(
      domNode.getAttribute('data-confluence-unsupported-block-cxhtml'),
    ).toEqual('foobar');
  });
});
