import { type Rule } from 'eslint';
import { type Directive, type ModuleDeclaration, type Statement } from 'eslint-codemod-utils';
import j from 'jscodeshift';

import * as ast from '../index';

describe('Root', () => {
	describe('findImportsByModule', () => {
		it('returns correct ImportDeclaration', () => {
			const root = j(`import { Box } from '@atlaskit/primitives';`);
			const node = root.paths()[0].value.program.body;

			const result = ast.Root.findImportsByModule(node, '@atlaskit/primitives');

			expect(result).toEqual([
				expect.objectContaining({
					type: 'ImportDeclaration',
				}),
			]);
		});

		it('returns correct ImportDeclaration when multiple exist', () => {
			const root = j(`
        import { Box } from '@atlaskit/primitives';
        import { BoxProps } from '@atlaskit/primitives';
        import { css } from '@emotion/react';
      `);
			const node = root.paths()[0].value.program.body;

			const result = ast.Root.findImportsByModule(node, '@atlaskit/primitives');

			expect(result).toEqual([
				expect.objectContaining({
					type: 'ImportDeclaration',
				}),
				expect.objectContaining({
					type: 'ImportDeclaration',
				}),
			]);
		});
	});

	describe('insertImport', () => {
		it('Successfully inserts import', () => {
			const root = j(``) as unknown as (Directive | Statement | ModuleDeclaration)[]; // Aggressive typing only for testing purposes
			const fixer = {
				insertTextBefore: jest.fn(),
			} as unknown as Rule.RuleFixer; // Aggressive typing only for testing purposes

			ast.Root.insertImport(
				root,
				{
					module: '@atlaskit/primitives',
					specifiers: ['xcss'],
				},
				fixer,
			);

			expect(fixer.insertTextBefore).toHaveBeenCalledTimes(1);
		});
	});
});
