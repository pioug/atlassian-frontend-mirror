import { Node, Schema } from 'prosemirror-model';

import { WikiMarkupTransformer } from '../../index';

export function parseWithSchema(markup: string, schema: Schema) {
  const transformer = new WikiMarkupTransformer(schema);
  return transformer.parse(markup);
}

export function encode(node: (schema: Schema) => Node, schema: Schema) {
  const transformer = new WikiMarkupTransformer(schema);
  return transformer.encode(node(schema));
}

export function checkParse(
  description: string,
  schema: Schema,
  markups: string[],
  node: (schema: Schema) => Node,
) {
  it(`parses WikiMarkup: ${description}`, () => {
    for (const markup of markups) {
      const actual = parseWithSchema(markup, schema);
      expect(actual).toEqualDocument(node);
    }
  });
}

export function checkEncode(
  description: string,
  schema: Schema,
  markup: string,
  node: (schema: Schema) => Node,
) {
  it(`encodes WikiMarkup: ${description}`, () => {
    const encoded = encode(node, schema);
    expect(encoded).toEqual(markup);
  });
}

export function checkParseEncodeRoundTrips(
  description: string,
  schema: Schema,
  markup: string,
  node: (schema: Schema) => Node,
) {
  checkParse(description, schema, [markup], node);

  // @TODO Uncomment when encoding is implemented
  // checkEncode(description, schema, markup, node);

  // it(`round-trips WikiMarkup: ${description}`, () => {
  //   const roundTripped = parseWithSchema(encode(node, schema), schema);
  //   expect(roundTripped).toEqualDocument(node);
  // });
}

export const adf2wiki = (node: Node) => {
  const transformer = new WikiMarkupTransformer();
  const wiki = transformer.encode(node);
  const adf = transformer.parse(wiki).toJSON();
  expect(adf).toEqual(node.toJSON());
};
export const wiki2adf = (wiki: string) => {
  const transformer = new WikiMarkupTransformer();
  const adf = transformer.parse(wiki);
  const roundtripped = transformer.encode(adf);
  expect(roundtripped).toEqual(wiki);
};
