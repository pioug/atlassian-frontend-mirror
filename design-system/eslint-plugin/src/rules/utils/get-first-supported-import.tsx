import type { Rule } from 'eslint';
import { type ImportDeclaration, isNodeOfType, type Program } from 'eslint-codemod-utils';

import { type ImportSource } from '@atlaskit/eslint-utils/is-supported-import';

type RuleContext = Rule.RuleContext;

/**
 * Get the first import declaration in the file that matches any of the packages
 * in `importSources`.
 *
 * @param context Rule context.
 * @param importSources The packages to check import statements for. If importSources
 *                      contains more than one package, the first import statement
 *                      detected in the file that matches any of the packages will be
 *                      returned.
 * @returns The first import declaration found in the file.
 */
export const getFirstSupportedImport = (
	context: RuleContext,
	importSources: ImportSource[],
): ImportDeclaration | undefined => {
	const isSupportedImport = (node: Program['body'][number]): node is ImportDeclaration => {
		return (
			isNodeOfType(node, 'ImportDeclaration') &&
			typeof node.source.value === 'string' &&
			importSources.includes(node.source.value as ImportSource)
		);
	};

	const source = context.getSourceCode();
	const supportedImports = source.ast.body.filter(isSupportedImport);

	if (supportedImports.length) {
		return supportedImports[0];
	}
};
