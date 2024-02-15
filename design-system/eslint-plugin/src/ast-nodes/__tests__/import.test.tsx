import { Rule } from 'eslint';
import j from 'jscodeshift';

import * as ast from '../index';

describe('Import', () => {
  describe('containsNamedSpecifier', () => {
    it('returns true if specifier exists', () => {
      const root = j(`import { Box } from '@atlaskit/primitives';`);
      const node = root.find(j.ImportDeclaration).get().value;

      const result = ast.Import.containsNamedSpecifier(node, 'Box');
      expect(result).toBe(true);
    });

    it('returns false if specifier exists', () => {
      const root = j(`import { Box } from '@atlaskit/primitives';`);
      const node = root.find(j.ImportDeclaration).get().value;

      const result = ast.Import.containsNamedSpecifier(node, 'xcss');
      expect(result).toBe(false);
    });
  });

  describe('insertNamedSpecifiers', () => {
    it('inserts new specifiers', () => {
      const root = j(`import { Box } from '@atlaskit/primitives';`);
      const node = root.find(j.ImportDeclaration).get().value;
      const fixer = {
        replaceText: jest.fn(),
      } as unknown as Rule.RuleFixer; // Aggressive typing only for testing purposes

      ast.Import.insertNamedSpecifiers(node, ['xcss'], fixer);

      expect(fixer.replaceText).toHaveBeenCalledTimes(1);
    });

    it('makes no modifications if specifier already exists', () => {
      const root = j(`import { Box } from '@atlaskit/primitives';`);
      const node = root.find(j.ImportDeclaration).get().value;
      const fixer = {
        replaceText: jest.fn(),
      } as unknown as Rule.RuleFixer; // Aggressive typing only for testing purposes

      ast.Import.containsNamedSpecifier(node, 'Box');

      expect(fixer.replaceText).not.toHaveBeenCalled();
    });
  });
});
