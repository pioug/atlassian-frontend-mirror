import * as ts from 'typescript';

import { AttributeSpec } from './types';

const getEventAttributeType = (attr: AttributeSpec) => {
  const isOptional = attr.required === false;

  /** Handle enum */
  if (Array.isArray(attr.type)) {
    return ts.factory.createUnionTypeNode([
      ...attr.type.map(t =>
        ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(t)),
      ),
      ...(isOptional
        ? [ts.factory.createLiteralTypeNode(ts.factory.createNull())]
        : []),
    ]);
  }
  switch (attr.type) {
    case 'string':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
    case 'number':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    default:
      throw new Error(`Unsupported attribute type: ${attr.type}`);
  }
};

export const getAttributePropertySignature = ([name, attr]: [
  string,
  AttributeSpec,
]) => {
  return ts.factory.createPropertySignature(
    undefined,
    name,
    undefined,
    getEventAttributeType(attr),
  );
};
