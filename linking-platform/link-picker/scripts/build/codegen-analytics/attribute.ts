import * as ts from 'typescript';

import { AttributeSpec } from './types';

const getEventAttributeType = (type: AttributeSpec['type']) => {
  /** Handle enum */
  if (Array.isArray(type)) {
    return ts.factory.createUnionTypeNode(
      type.map(t =>
        ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(t)),
      ),
    );
  }
  switch (type) {
    case 'string':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
    case 'number':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    default:
      throw new Error(`Unsupported attribute type: ${type}`);
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
    getEventAttributeType(attr.type),
  );
};
