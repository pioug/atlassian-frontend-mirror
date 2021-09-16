import type { Rule } from 'eslint';

export const isDecendantOfGlobalToken = (node: Rule.Node): boolean => {
  if (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'token'
  ) {
    return true;
  }

  if (node.parent) {
    return isDecendantOfGlobalToken(node.parent);
  }

  return false;
};

export const isDecendantOfType = (
  node: Rule.Node,
  type: Rule.Node['type'],
  skipNode = true,
): boolean => {
  if (!skipNode && node.type === type) {
    return true;
  }

  if (node.parent) {
    return isDecendantOfType(node.parent, type, false);
  }

  return false;
};

export const isDecendantOfStyleJsxAttribute = (node: Rule.Node): boolean => {
  // @ts-ignore
  if (node.type === 'JSXAttribute') {
    return true;
  }

  if (node.parent) {
    return isDecendantOfStyleJsxAttribute(node.parent);
  }

  return false;
};

export const isDecendantOfStyleBlock = (node: Rule.Node): boolean => {
  if (node.type === 'VariableDeclarator') {
    if (node.id.type !== 'Identifier') {
      return false;
    }

    if (
      // @ts-ignore typeAnnotation is not defined by types
      node.id.typeAnnotation &&
      // @ts-ignore typeAnnotation is not defined by types
      node.id.typeAnnotation.typeAnnotation.type === 'GenericTypeAnnotation'
    ) {
      // @ts-ignore Name is not defined by types
      const typeName = node.id.typeAnnotation.typeAnnotation.id.name;
      const hasCSSType = ['CSSProperties', 'CSSObject'].some((el) =>
        typeName.includes(el),
      );

      if (hasCSSType) {
        return true;
      }
    }

    // @ts-ignore Name is not defined in types
    const varName = node.id.name.toLowerCase();

    return ['style', 'css', 'theme'].some((el) => varName.includes(el));
  }

  if (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'css'
  ) {
    return true;
  }

  if (
    node.type === 'TaggedTemplateExpression' &&
    node.tag.type === 'MemberExpression' &&
    node.tag.object.type === 'Identifier' &&
    node.tag.object.name === 'styled'
  ) {
    return true;
  }

  if (
    node.type === 'TaggedTemplateExpression' &&
    node.tag.type === 'Identifier' &&
    node.tag.name === 'css'
  ) {
    return true;
  }

  if (node.parent) {
    return isDecendantOfStyleBlock(node.parent);
  }

  return false;
};

export const isChildOfType = (node: Rule.Node, type: Rule.Node['type']) =>
  node.parent.type === type;
