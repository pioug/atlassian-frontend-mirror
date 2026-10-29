import type { Rule } from 'eslint';
import type { CallExpression as ESCallExpression } from 'estree';

import { getScope, getSourceCode } from '@atlaskit/eslint-utils/context-compat';
import {
	CSS_IN_JS_IMPORTS,
	type ImportSource,
	isCssMap,
} from '@atlaskit/eslint-utils/is-supported-import';

import { createLintRule } from '../utils/create-lint-rule';
import { checkIfSupportedExport } from '../utils/create-no-exported-rule/check-if-supported-export';
import { getCssMapObject } from './get-css-map-object';
import { CssMapObjectChecker } from './utils';

type CallExpression = ESCallExpression & Rule.NodeParentExtension;

const IMPORT_SOURCES: ImportSource[] = [CSS_IN_JS_IMPORTS.compiled, CSS_IN_JS_IMPORTS.atlaskitCss];

const reportIfExported = (node: CallExpression, context: Rule.RuleContext) => {
	const state = checkIfSupportedExport(context, node, IMPORT_SOURCES);
	if (!state.isExport) {
		return;
	}

	context.report({
		messageId: 'noExportedCssMap',
		node: state.node,
	});
};

const reportIfNotTopLevelScope = (node: CallExpression, context: Rule.RuleContext) => {
	// Treat `export` keyword as valid because the reportIfExported function already handles those
	const validTypes: Readonly<Rule.Node['type'][]> = [
		'ExportDefaultDeclaration',
		'ExportNamedDeclaration',
		'Program',
		'VariableDeclaration',
		'VariableDeclarator',
	] as const;

	let parentNode = node.parent;
	while (parentNode) {
		if (!validTypes.includes(parentNode.type)) {
			context.report({ node: node, messageId: 'mustBeTopLevelScope' });
			return;
		}
		parentNode = parentNode.parent;
	}
};

const createCssMapRule = (context: Rule.RuleContext): Rule.RuleListener => {
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

			reportIfExported(node, context);
			reportIfNotTopLevelScope(node, context);

			const cssMapObject = getCssMapObject(node);
			if (!cssMapObject) {
				return;
			}

			const cssMapObjectChecker = new CssMapObjectChecker(cssMapObject, context);
			cssMapObjectChecker.run();
		},
	};
};

const noInvalidCssMapRule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-invalid-css-map',
		docs: {
			description:
				"Checks the validity of a CSS map created through cssMap. This is intended to be used alongside TypeScript's type-checking.",
			recommended: true,
			severity: 'error',
			pluginConfig: {
				allowedFunctionCalls: [['@atlaskit/tokens', 'token']],
			},
		},
		messages: {
			mustBeTopLevelScope:
				'Move this cssMap() declaration to module scope, outside components and callbacks; select its static variants when rendering.',
			noNonStaticallyEvaluable:
				'Replace this cssMap value with a local build-time constant or literal. Use a static variant lookup for finite choices, or the style prop for runtime-only values.',
			noExportedCssMap:
				'Remove the cssMap export and keep its declaration beside its usage. Export a component if styling must be shared across files.',
			noInlineFunctions:
				'Replace the function inside cssMap with static variants selected in JSX, or pass runtime-only values through the style prop.',
			noFunctionCalls:
				'Replace this function call inside cssMap with a build-time literal or an allowed token() call. Pass runtime-only values through the style prop.',
			noSpreadElement:
				'Declare cssMap variant properties directly. Compose local variants where they are applied with css={[a, b]} or xcss={cx(a, b)} instead of spreading styles.',
		},
		schema: [
			{
				type: 'object',
				properties: {
					allowedFunctionCalls: {
						type: 'array',
						items: {
							type: 'array',
							minItems: 2,
							maxItems: 2,
							items: [{ type: 'string' }, { type: 'string' }],
						},
						uniqueItems: true,
					},
				},
				additionalProperties: false,
			},
		],
		type: 'problem',
	},
	create: createCssMapRule,
});

export default noInvalidCssMapRule;
