import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';
import type {
  Identifier,
  ImportDeclaration,
  MemberExpression,
  Program,
} from 'estree';

import type { ImportSource } from '../is-supported-import';

type Node = Rule.Node;
type RuleContext = Rule.RuleContext;

/**
 * Given a list of node, find and return the callee of the first Compiled or styled-components `styled` function call found in the list.
 *
 * For example, given `styled.div({ ... })`, we return the node corresponding to the
 * `styled.div` part. Alternatively, given `styled(button)(style)`, we return the `styled`
 * part.
 *
 * @param nodes
 * @returns The callee of the first `styled` function call found.
 */
const findNode = (nodes: Node[]): MemberExpression | Identifier | undefined => {
  const node = nodes.find(
    (n) => n.type === 'TaggedTemplateExpression' || n.type === 'CallExpression',
  );

  if (!node) {
    return;
  }

  if (node.type === 'CallExpression') {
    // Eg. const Component = styled.button(style)
    if (node.callee.type === 'MemberExpression') {
      return node.callee;
    }

    // Eg. const Component = styled(button)(style)
    if (
      node.callee.type === 'CallExpression' &&
      node.callee.callee.type === 'Identifier'
    ) {
      return node.callee.callee;
    }
  }

  // Eg. const Component = styled.div`${styles}`;
  if (
    node.type === 'TaggedTemplateExpression' &&
    node.tag.type === 'MemberExpression'
  ) {
    return node.tag;
  }

  return;
};

/**
 * Given a rule, return the local name used to import the `styled` API. (for Compiled or styled-components).
 *
 * @param context Rule context.
 * @returns The local name used to import the `styled` API.
 */
const getStyledImportSpecifierName = (
  context: RuleContext,
  importSources: ImportSource[],
): string | undefined => {
  const isSupportedImport = (
    node: Program['body'][number],
  ): node is ImportDeclaration => {
    return (
      isNodeOfType(node, 'ImportDeclaration') &&
      typeof node.source.value === 'string' &&
      importSources.includes(node.source.value as ImportSource)
    );
  };

  const source = context.getSourceCode();
  const supportedImports = source.ast.body.filter(isSupportedImport);

  return supportedImports[0].specifiers.find(
    (spec) =>
      spec.type === 'ImportSpecifier' && spec.imported.name === 'styled',
  )?.local.name;
};

/**
 * Returns whether the node is a usage of the `styled` API in the libraries we support.
 *
 * @param nodes Nodes to check.
 * @param context Rule context.
 * @param importSources A list of libraries we support.
 * @returns Whether the node is a usage of the `styled` API.
 */
export const isStyledComponent = (
  nodes: Node[],
  context: RuleContext,
  importSources: ImportSource[],
): boolean => {
  const node = findNode(nodes);

  if (!node) {
    return false;
  }

  const styledImportSpecifierName = getStyledImportSpecifierName(
    context,
    importSources,
  );

  if (styledImportSpecifierName) {
    if (node.type === 'Identifier') {
      return node.name === styledImportSpecifierName;
    } else {
      return (
        node.object.type === 'Identifier' &&
        node.object.name === styledImportSpecifierName
      );
    }
  }

  return false;
};
