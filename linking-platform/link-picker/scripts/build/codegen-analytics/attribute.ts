import * as ts from 'typescript';

import { AttributeSpec } from './types';

const getEventAttributeBaseType = (attr: AttributeSpec) => {
  /** Handle enum */
  if (Array.isArray(attr.type)) {
    return attr.type.map(t =>
      ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(t)),
    );
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

const getEventAttributeType = (attr: AttributeSpec) => {
  const isOptional = attr.required === false;
  const baseType = getEventAttributeBaseType(attr);

  if (isOptional) {
    return ts.factory.createUnionTypeNode([
      ...(Array.isArray(baseType) ? baseType : [baseType]),
      ts.factory.createLiteralTypeNode(ts.factory.createNull()),
    ]);
  }

  if (Array.isArray(baseType)) {
    return ts.factory.createUnionTypeNode(baseType);
  }

  return baseType;
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
