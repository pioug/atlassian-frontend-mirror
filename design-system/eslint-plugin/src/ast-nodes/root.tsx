/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import {
	type Directive,
	hasImportDeclaration,
	type ImportDeclaration,
	insertImportDeclaration,
	isNodeOfType,
	type ModuleDeclaration,
	type Statement,
} from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import { Import } from './import';

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
		name: string | string[],
	): ImportDeclaration[] {
		return root.filter((node): node is ImportDeclaration => {
			if (!isNodeOfType(node, 'ImportDeclaration')) {
				return false;
			}

			let names = typeof name === 'string' ? [name] : name;
			if (!names.some((name) => hasImportDeclaration(node, name))) {
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

	upsertNamedImportDeclaration(
		{
			module,
			specifiers,
		}: {
			module: string;
			specifiers: string[];
		},
		context: Rule.RuleContext,
		fixer: Rule.RuleFixer,
	): Rule.Fix | undefined {
		// Find any imports that match the packageName
		const root = getSourceCode(context).ast.body;
		const importDeclarations = this.findImportsByModule(root, module);

		// The named import doesn't exist yet, we can just insert a whole new one
		if (importDeclarations.length === 0) {
			return this.insertImport(root, { module, specifiers }, fixer);
		}

		// The import exists so, modify the existing one
		return Import.insertNamedSpecifiers(importDeclarations[0], specifiers, fixer);
	},

	upsertDefaultImportDeclaration(
		{
			module,
			localName,
		}: {
			module: string;
			localName: string;
		},
		context: Rule.RuleContext,
		fixer: Rule.RuleFixer,
	) {
		// Find any imports that match the packageName
		const root = getSourceCode(context).ast.body;
		const importDeclarations = this.findImportsByModule(root, module);

		// The import already exist exist
		if (importDeclarations.length > 0) {
			return undefined;
		}

		return fixer.insertTextBefore(root[0], `import ${localName} from '${module}';\n`);
	},
};
