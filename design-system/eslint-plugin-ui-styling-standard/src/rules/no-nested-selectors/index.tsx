import type { Property } from 'estree';
import { isNesting, isPseudo, type Selector } from 'postcss-selector-parser';

import { importSources } from '@atlaskit/eslint-utils/schema';

import { createLintRuleWithTypedConfig } from '../utils/create-rule-with-typed-config';
import { isSimpleSelector } from '../utils/is-simple-selector';
import { parseSelector } from '../utils/parse-selector';
import { getStyleCalls } from '../utils/style-calls';
import { walkStyleCallProperties } from '../utils/walk-style-call-properties';

type TypeScriptExpression = { type: string; expression?: TypeScriptExpression };

/**
 * Strip TypeScript-only wrappers from a computed key so the selector inside is still linted,
 * for example `['.foo' satisfies `.${typeof FOO_CLASS}`]` is checked as `'.foo'`.
 */
const unwrapTypeScriptExpression = (key: Property['key']): Property['key'] => {
	let expression = key as unknown as TypeScriptExpression;
	while (
		(expression.type === 'TSAsExpression' ||
			expression.type === 'TSTypeAssertion' ||
			expression.type === 'TSNonNullExpression' ||
			expression.type === 'TSSatisfiesExpression') &&
		expression.expression
	) {
		expression = expression.expression;
	}
	return expression as unknown as Property['key'];
};

const getCssSelector = (rawKey: Property['key']): string | null => {
	const key = unwrapTypeScriptExpression(rawKey);

	if (key.type === 'Literal' && typeof key.value === 'string') {
		return key.value;
	}

	if (key.type === 'Identifier' && typeof key.name === 'string') {
		return key.name;
	}

	if (key.type === 'TemplateLiteral') {
		return key.quasis.map((quasi) => quasi.value.raw).join(' ');
	}

	return null;
};

function isAllowedSelector(selector: Selector): boolean {
	const [head, ...tail] = selector.nodes;

	// The first node must be a nesting selector (`&`) or pseudo-selector.
	const isHeadAllowed = isNesting(head) || isPseudo(head);

	// All remaining nodes must be pseudo selectors.
	const isTailAllowed = tail.every(isPseudo);

	return isHeadAllowed && isTailAllowed;
}

const rule: import('eslint').Rule.RuleModule = createLintRuleWithTypedConfig({
	meta: {
		name: 'no-nested-selectors',
		docs: {
			description: 'Prevents usage of nested selectors within css styling',
			recommended: true,
			severity: 'error',
		},
		messages: {
			'no-nested-selectors':
				'Please avoid setting styles for child elements or elements that require context from other elements.',
		},
		type: 'problem',
		schema: {
			type: 'object',
			properties: {
				importSources,
			},
		},
	},
	create(context, { importSources }) {
		return {
			Program() {
				for (const styleCall of getStyleCalls(context)) {
					if (!importSources.includes(styleCall.importSource)) {
						continue;
					}
					walkStyleCallProperties(styleCall, ({ key, value }) => {
						if (value.type !== 'ObjectExpression') {
							return;
						}

						const selectorText = getCssSelector(key);
						if (selectorText === null || selectorText.includes('@')) {
							return;
						}
						if (
							isSimpleSelector(selectorText, {
								allowBareNesting: true,
								allowLeadingPseudo: true,
							})
						) {
							return;
						}

						try {
							const selectorList = parseSelector(context, selectorText);

							if (!selectorList.nodes.every(isAllowedSelector)) {
								context.report({
									messageId: 'no-nested-selectors',
									node: key,
								});
							}
						} catch {
							// `no-unsafe-selectors` reports unparsable selectors.
						}
					});
				}
			},
		};
	},
});

export default rule;
