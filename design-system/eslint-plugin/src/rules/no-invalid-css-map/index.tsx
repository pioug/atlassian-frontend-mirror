import type { Rule } from 'eslint';
import type { CallExpression as ESCallExpression } from 'estree';

import {
	CSS_IN_JS_IMPORTS,
	type ImportSource,
	isCssMap,
} from '@atlaskit/eslint-utils/is-supported-import';

import { checkIfSupportedExport } from '../utils/create-no-exported-rule/check-if-supported-export';
import { createLintRule } from '../utils/create-rule';

import { CssMapObjectChecker, getCssMapObject } from './utils';

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
	const { text } = context.getSourceCode();
	if (IMPORT_SOURCES.every((importSource) => !text.includes(importSource))) {
		return {};
	}

	return {
		CallExpression(node) {
			const references = context.getScope().references;

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
			mustBeTopLevelScope: 'cssMap must only be used in the top-most scope of the module.',
			noNonStaticallyEvaluable:
				'Cannot statically evaluate the value of this variable. Values used in the cssMap function call should have a value evaluable at build time.',
			noExportedCssMap: 'cssMap usages cannot be exported.',
			noInlineFunctions:
				'Cannot use functions as values in cssMap - values must only be statically evaluable values (e.g. strings, numbers).',
			noFunctionCalls:
				'Cannot call external functions in cssMap - values must only be statically evaluable values (e.g. strings, numbers).',
			noSpreadElement: 'Cannot use the spread operator in cssMap.',
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
