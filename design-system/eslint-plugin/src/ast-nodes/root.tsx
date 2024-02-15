/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import {
  Directive,
  hasImportDeclaration,
  ImportDeclaration,
  insertImportDeclaration,
  isNodeOfType,
  ModuleDeclaration,
  Statement,
} from 'eslint-codemod-utils';

type ImportData = Parameters<typeof insertImportDeclaration>[1]; // Little bit unreadable, but better than duplicating the type

export const Root = {
  /**
   * Note: This can return multiple ImportDeclarations for cases like:
   * ```
   * import { Stack } from '@atlaskit/primitives'
   * import type { StackProps } from '@atlaskit/primitives'
   * ```
   */
  findImportsByModule(
    root: (Directive | Statement | ModuleDeclaration)[],
    name: string,
  ): ImportDeclaration[] {
    return root.filter((node): node is ImportDeclaration => {
      if (!isNodeOfType(node, 'ImportDeclaration')) {
        return false;
      }

      if (!hasImportDeclaration(node, name)) {
        return false;
      }

      return true;
    });
  },

  insertImport(
    root: (Directive | Statement | ModuleDeclaration)[],
    data: {
      module: string;
      specifiers: ImportData;
    },
    fixer: Rule.RuleFixer,
  ): Rule.Fix {
    return fixer.insertTextBefore(
      root[0],
      `${insertImportDeclaration(data.module, data.specifiers)};\n`,
    );
  },
};
