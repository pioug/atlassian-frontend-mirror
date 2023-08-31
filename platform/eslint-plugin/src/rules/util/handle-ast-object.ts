import type {
  ObjectExpression,
  SimpleLiteral,
  RegExpLiteral,
  BigIntLiteral,
} from 'estree';

export const getObjectPropertyAsLiteral = (
  node: ObjectExpression,
  property: string,
): SimpleLiteral['value'] | RegExpLiteral['value'] | BigIntLiteral['value'] => {
  const prop = node.properties.find(
    (p) =>
      p.type === 'Property' &&
      p.key.type === 'Literal' &&
      p.key.value === property,
  );

  // double check for property is to make typescript happy
  if (prop?.type === 'Property' && prop?.value.type === 'Literal') {
    return prop.value.value ?? null;
  }

  return null;
};

export const getObjectPropertyAsObject = (
  node: ObjectExpression,
  property: string,
): ObjectExpression | null => {
  const prop = node.properties.find(
    (p) =>
      p.type === 'Property' &&
      p.key.type === 'Literal' &&
      p.key.value === property,
  );

  // double check for property is to make typescript happy
  if (prop?.type === 'Property' && prop?.value.type === 'ObjectExpression') {
    return prop.value ?? null;
  }

  return null;
};
