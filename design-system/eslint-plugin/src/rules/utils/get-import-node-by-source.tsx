// eslint-disable-next-line import/no-extraneous-dependencies
import type { SourceCode } from 'eslint';
import type { ImportDeclaration } from 'eslint-codemod-utils';

/**
 * @param {SourceCode} source The eslint source
 * @param {string} path The path specified to find
 * @returns {ImportDeclaration}
 */
export const getImportedNodeBySource = (source: SourceCode, path: string) => {
  return source.ast.body
    .filter(
      (node): node is ImportDeclaration => node.type === 'ImportDeclaration',
    )
    .find((node) => node.source.value === path);
};
