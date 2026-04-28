import type { Rule } from 'eslint';
import { type Directive, type ModuleDeclaration, type Statement } from 'eslint-codemod-utils';

import { Root } from '../../ast-nodes/root';

export function insertTokensImport(
	root: (Directive | Statement | ModuleDeclaration)[],
	fixer: Rule.RuleFixer,
): Rule.Fix {
	return Root.insertImport(
		root,
		{
			module: '@atlaskit/tokens',
			specifiers: ['token'],
		},
		fixer,
	);
}
