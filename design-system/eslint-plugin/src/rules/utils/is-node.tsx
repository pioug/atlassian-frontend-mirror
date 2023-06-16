import type { Rule } from 'eslint';
import {
  CallExpression,
  EslintNode,
  Expression,
  isNodeOfType,
  Property,
  TaggedTemplateExpression,
} from 'eslint-codemod-utils';

export const isDecendantOfGlobalToken = (node: EslintNode): boolean => {
  if (
    isNodeOfType(node, 'CallExpression') &&
    isNodeOfType(node.callee, 'Identifier') &&
    (node.callee.name === 'token' || node.callee.name === 'getTokenValue')
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

export const isPropertyKey = (node: Rule.Node): boolean => {
  if (isNodeOfType(node, 'Identifier') && isDecendantOfType(node, 'Property')) {
    const parent = node.parent as Property;
    return node === parent.key || parent.shorthand;
  }
  return false;
};

export const isDecendantOfStyleJsxAttribute = (node: Rule.Node): boolean => {
  if (isNodeOfType(node, 'JSXAttribute')) {
    return true;
  }

  if (node.parent) {
    return isDecendantOfStyleJsxAttribute(node.parent);
  }

  return false;
};

const cssInJsCallees = ['css', 'styled', 'styled2'];

export const isCssInJsTemplateNode = (
  node?: Expression | null,
): node is TaggedTemplateExpression =>
  node?.type === 'TaggedTemplateExpression' &&
  node.tag.type === 'MemberExpression' &&
  node.tag.object.type === 'Identifier' &&
  node.tag.object.name === 'styled';

export const isCssInJsCallNode = (
  node?: Expression | null,
): node is CallExpression =>
  node?.type === 'CallExpression' &&
  node.callee.type === 'Identifier' &&
  cssInJsCallees.includes(node.callee.name);

export const isCssInJsObjectNode = (
  node?: Expression | null,
): node is CallExpression =>
  node?.type === 'CallExpression' &&
  node.callee.type === 'MemberExpression' &&
  node.callee.object.type === 'Identifier' &&
  cssInJsCallees.includes(node.callee.object.name);

export const isDecendantOfStyleBlock = (node: Rule.Node): boolean => {
  if (node.type === 'VariableDeclarator') {
    if (node.id.type !== 'Identifier') {
      return false;
    }

    if (
      // @ts-ignore typeAnnotation is not defined by types
      node.id.typeAnnotation &&
      // @ts-ignore typeAnnotation is not defined by types
      node.id.typeAnnotation.typeAnnotation.type === 'GenericTypeAnnotation' &&
      // @ts-ignore typeAnnotation is not defined by types
      node.id.typeAnnotation.typeAnnotation.id.type === 'Identifier'
    ) {
      // @ts-ignore typeAnnotation is not defined by types
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
    isCssInJsCallNode(node as Expression) ||
    isCssInJsObjectNode(node as Expression) ||
    isCssInJsTemplateNode(node as Expression)
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
  isNodeOfType(node.parent, type);
