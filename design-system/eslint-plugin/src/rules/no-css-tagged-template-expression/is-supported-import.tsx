// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule, Scope } from 'eslint';

type Definition = Scope.Definition;
type Node = Rule.Node;
type Reference = Scope.Reference;
type SupportedNameChecker = (node: Node, references: Reference[]) => boolean;

export const SUPPORTED_IMPORTS = {
  compiled: '@compiled/react',
  emotionReact: '@emotion/react',
  emotionCore: '@emotion/core',
  styledComponents: 'styled-components',
};

const isImportSpecifierWrapper = (name: string) => {
  return (def: Definition) =>
    def.node.type === 'ImportSpecifier' &&
    def.node.imported.type === 'Identifier' &&
    def.node.imported.name === name &&
    def.parent?.type === 'ImportDeclaration' &&
    (def.parent?.source.value === SUPPORTED_IMPORTS.compiled ||
      def.parent?.source.value === SUPPORTED_IMPORTS.emotionReact ||
      def.parent?.source.value === SUPPORTED_IMPORTS.emotionCore ||
      def.parent?.source.value === SUPPORTED_IMPORTS.styledComponents);
};

export const isSupportedImport = (name: string): SupportedNameChecker => {
  const isImportSpecifier = isImportSpecifierWrapper(name);

  return (node: Node, references: Reference[]) =>
    node.type === 'Identifier' &&
    references.some(
      (reference) =>
        reference.identifier === node &&
        reference.resolved?.defs.some(isImportSpecifier),
    );
};
