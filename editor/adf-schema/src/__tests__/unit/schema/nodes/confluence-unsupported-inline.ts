import { name } from '../../../../version.json';
import { schema, toDOM, fromHTML } from '../../../../../test-helpers';

describe(`${name}/schema unsupportedInline node`, () => {
  it('should parse unsupported inline nodes', () => {
    const doc = fromHTML(
      '<div data-node-type="confluenceUnsupportedInline" data-confluence-unsupported="inline" data-confluence-unsupported-inline-cxhtml="foobar"/>',
      schema,
    );
    const paragraph = doc.firstChild!;
    const unsupportedInlineNode = paragraph.firstChild!;

    expect(unsupportedInlineNode.type).toEqual(
      schema.nodes.confluenceUnsupportedInline,
    );
    expect(unsupportedInlineNode.attrs.cxhtml).toEqual('foobar');
  });

  it('should encode unsupported inline nodes to html', () => {
    const unsupportedInlineNode = schema.nodes.confluenceUnsupportedInline.create(
      { cxhtml: 'foobar' },
    );
    const domNode = toDOM(unsupportedInlineNode, schema)
      .firstChild as HTMLElement;

    expect(domNode.getAttribute('data-confluence-unsupported')).toEqual(
      'inline',
    );
    expect(
      domNode.getAttribute('data-confluence-unsupported-inline-cxhtml'),
    ).toEqual('foobar');
  });
});
