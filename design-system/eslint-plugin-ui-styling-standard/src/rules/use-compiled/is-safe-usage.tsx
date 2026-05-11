import type { Rule } from 'eslint';
import type * as ESTree from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';
import { findVariable } from '@atlaskit/eslint-utils/find-variable';

import { isSafeCss } from './is-safe-css';
import { isSafeKeyframes } from './is-safe-keyframes';

export function isSafeUsage({
	context,
	specifier,
	supportedImports,
}: {
	context: Rule.RuleContext;
	specifier: ESTree.ImportSpecifier;
	supportedImports: Set<string>;
}): boolean {
	if (!('name' in specifier.imported)) {
		return false;
	}
	const importName = specifier.imported.name;

	if (!supportedImports.has(importName)) {
		return false;
	}

	if (importName === 'css') {
		const css = findVariable({
			identifier: specifier.local,
			sourceCode: getSourceCode(context),
		});
		return css !== null && isSafeCss(css);
	}

	if (importName === 'keyframes') {
		const keyframes = findVariable({
			identifier: specifier.local,
			sourceCode: getSourceCode(context),
		});
		return keyframes !== null && isSafeKeyframes(keyframes);
	}

	return true;
}
