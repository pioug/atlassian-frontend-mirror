import { type Rule } from 'eslint';
import type * as ESTree from 'estree';

import {
	type AnalyzeOptions,
	analyzeRegExpForLookaheadAndLookbehind,
	type CheckableExpression,
} from '../helpers/analyzeRegExpForLookaheadAndLookbehind';
import { isBinaryExpression, isRegExpLiteral, isStringLiteralRegExp } from '../helpers/ast';
import { collectBrowserTargets, collectUnsupportedTargets } from '../helpers/caniuse';
import { createContextReport } from '../helpers/createReport';

export const DEFAULT_OPTIONS: AnalyzeOptions['rules'] = {
	'no-lookahead': 1,
	'no-lookbehind': 1,
	'no-negative-lookahead': 1,
	'no-negative-lookbehind': 1,
};

export const DEFAULT_CONF: AnalyzeOptions['config'] = {
	browserslist: false,
};

function isPlainObject(obj: any) {
	return Object.prototype.toString.call(obj) === '[object Object]';
}

export const getExpressionsToCheckFromConfiguration = (
	options: Rule.RuleContext['options'],
): { rules: AnalyzeOptions['rules']; config: AnalyzeOptions['config'] } => {
	if (!options.length) {
		return { rules: DEFAULT_OPTIONS, config: DEFAULT_CONF };
	}
	let rules: CheckableExpression[] = options;
	let config: AnalyzeOptions['config'] = {};

	if (isPlainObject(options[options.length - 1])) {
		rules = options.slice(0, -1);
		config = options[options.length - 1];
	}

	const validOptions: CheckableExpression[] = rules.filter((option: unknown) => {
		if (typeof option !== 'string') {
			return false;
		}
		return DEFAULT_OPTIONS[option as keyof typeof DEFAULT_OPTIONS];
	});

	if (!validOptions.length) {
		return { rules: DEFAULT_OPTIONS, config };
	}

	const expressions = validOptions.reduce<AnalyzeOptions['rules']>(
		(acc: AnalyzeOptions['rules'], opt) => {
			acc[opt as keyof typeof DEFAULT_OPTIONS] = 1;
			return acc;
		},
		{
			'no-lookahead': 0,
			'no-lookbehind': 0,
			'no-negative-lookahead': 0,
			'no-negative-lookbehind': 0,
		},
	);
	return {
		rules: expressions,
		config,
	};
};

const noLookaheadLookbehindRegexp: Rule.RuleModule = {
	meta: {
		docs: {
			description:
				'disallow the use of lookahead and lookbehind regular expressions if unsupported by browser',
			category: 'Compatibility',
			recommended: true,
		},
		type: 'problem',
	},
	create(context: Rule.RuleContext) {
		const browsers = context.settings.browsers || context.settings.targets;
		const { targets, hasConfig } = collectBrowserTargets(context.getFilename(), browsers);
		// Lookahead assertions are part of JavaScript's original regular expression support and are thus supported in all browsers.
		const unsupportedTargets = collectUnsupportedTargets('js-regexp-lookbehind', targets);
		const { rules, config } = getExpressionsToCheckFromConfiguration(context.options);

		// If there are no unsupported targets resolved from the browserlist config, then we can skip this rule
		if (!unsupportedTargets.length && hasConfig) {
			return {};
		}

		return {
			TemplateLiteral(node: ESTree.TemplateLiteral & Rule.NodeParentExtension): void {
				for (let quasi of node.quasis) {
					if (typeof quasi.value.raw === 'string') {
						const unsupportedGroups = analyzeRegExpForLookaheadAndLookbehind(
							quasi.value.raw,
							rules, // For string literals, we need to pass the raw value which includes escape characters.
						);

						if (unsupportedGroups.length > 0) {
							createContextReport(node, context, unsupportedGroups, unsupportedTargets, config);
						}
					}
				}
			},
			Literal(node: ESTree.Literal & Rule.NodeParentExtension): void {
				if (
					(isStringLiteralRegExp(node) || isBinaryExpression(node)) &&
					typeof node.raw === 'string'
				) {
					const unsupportedGroups = analyzeRegExpForLookaheadAndLookbehind(
						node.raw,
						rules, // For string literals, we need to pass the raw value which includes escape characters.
					);
					if (unsupportedGroups.length > 0) {
						createContextReport(node, context, unsupportedGroups, unsupportedTargets, config);
					}
				} else if (isRegExpLiteral(node)) {
					const unsupportedGroups = analyzeRegExpForLookaheadAndLookbehind(
						node.regex.pattern,
						rules,
					);
					if (unsupportedGroups.length > 0) {
						createContextReport(node, context, unsupportedGroups, unsupportedTargets, config);
					}
				}
			},
		};
	},
};

export { noLookaheadLookbehindRegexp };
