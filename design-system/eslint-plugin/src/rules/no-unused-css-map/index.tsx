import type { Rule } from 'eslint';

import { getScope, getSourceCode } from '@atlaskit/eslint-utils/context-compat';
import {
	CSS_IN_JS_IMPORTS,
	type ImportSource,
	isCssMap,
} from '@atlaskit/eslint-utils/is-supported-import';

import { createLintRule } from '../utils/create-rule';

import { getCssMapObject, UnusedCssMapChecker } from './utils';

const IMPORT_SOURCES: ImportSource[] = [CSS_IN_JS_IMPORTS.compiled, CSS_IN_JS_IMPORTS.atlaskitCss];

const createUnusedCssMapRule = (context: Rule.RuleContext): Rule.RuleListener => {
	const { text } = getSourceCode(context);
	if (IMPORT_SOURCES.every((importSource) => !text.includes(importSource))) {
		return {};
	}

	return {
		CallExpression(node) {
			const references = getScope(context, node).references;

			if (!isCssMap(node.callee, references, IMPORT_SOURCES)) {
				return;
			}

			const cssMapObject = getCssMapObject(node);
			if (!cssMapObject) {
				return;
			}

			const unusedCssMapChecker = new UnusedCssMapChecker(cssMapObject, context, node);
			unusedCssMapChecker.run();
		},
	};
};

const noUnusedCssMapRule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-unused-css-map',
		docs: {
			description: 'Detects unused styles in cssMap objects to help keep code clean.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			unusedCssMapStyle:
				'Unused style "{{styleName}}" in cssMap. Consider removing it if not needed.',
		},
		schema: [],
		type: 'suggestion',
	},
	create: createUnusedCssMapRule,
});

export default noUnusedCssMapRule;
