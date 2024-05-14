import type { Rule } from 'eslint';

import type * as ESTree from 'eslint-codemod-utils';

export function getFirstImportFromSource(
  context: Rule.RuleContext,
  source: string,
): ESTree.ImportDeclaration | undefined {
  return context
    .getSourceCode()
    .ast.body.filter(isImportDeclaration)
    .find((node) => node.source.value === source);
}

function isImportDeclaration(
  node: ESTree.Node,
): node is ESTree.ImportDeclaration {
  return node.type === 'ImportDeclaration';
}

export function isImportSpecifier(
  specifier: ESTree.Node,
): specifier is ESTree.ImportSpecifier {
  return specifier.type === 'ImportSpecifier';
}

export function isImportDefaultSpecifier(
  specifier: ESTree.Node,
): specifier is ESTree.ImportDefaultSpecifier {
  return specifier.type === 'ImportDefaultSpecifier';
}

export function isImportNamespaceSpecifier(
  specifier: ESTree.Node,
): specifier is ESTree.ImportNamespaceSpecifier {
  return specifier.type === 'ImportNamespaceSpecifier';
}
