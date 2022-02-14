/* eslint-disable import/no-unresolved */
import type { Rule } from 'eslint';
import type { ImportDeclaration } from 'estree';

/**
 * @param {SourceCode} source The eslint source
 * @param {string} path The path specified to find
 * @returns FixerObject
 */
export const removeNamedImport = (
  fixer: Rule.RuleFixer,
  importNode: ImportDeclaration,
  name: string,
) => {
  const filteredSpecifers = importNode.specifiers.filter(
    (node) => node.type === 'ImportSpecifier' && node.imported.name !== name,
  );

  if (filteredSpecifers.length) {
    return fixer.remove(
      importNode.specifiers.find(
        (node) =>
          node.type === 'ImportSpecifier' && node.imported.name === name,
      )!,
    );
  }

  return fixer.remove(importNode);
};
