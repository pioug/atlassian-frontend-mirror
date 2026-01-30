import type { Property } from 'estree';
import cssSelectorParser, { isNesting, isPseudo, type Selector } from 'postcss-selector-parser';

import { getScope } from '@atlaskit/eslint-utils/context-compat';
import { importSources } from '@atlaskit/eslint-utils/schema';
import { walkStyleProperties } from '@atlaskit/eslint-utils/walk-style-properties';

import { createLintRuleWithTypedConfig } from '../utils/create-rule-with-typed-config';

const getCssSelector = (key: Property['key']): string | null => {
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

const cssSelectorProcessor = cssSelectorParser();

export const rule: import("eslint").Rule.RuleModule = createLintRuleWithTypedConfig({
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
			CallExpression(node) {
				const { references } = getScope(context, node);

				walkStyleProperties(node, references, importSources, ({ key, value }) => {
					if (value.type !== 'ObjectExpression') {
						// If the value is a CSS object, safe to assume we're at a CSS selector
						return;
					}

					const selectorText = getCssSelector(key);
					if (selectorText === null) {
						return;
					}

					// Ignore at-rules
					if (selectorText.includes('@')) {
						return;
					}

					try {
						const selectorList = cssSelectorProcessor.astSync(selectorText);

						if (!selectorList.nodes.every(isAllowedSelector)) {
							context.report({
								messageId: 'no-nested-selectors',
								node: key,
							});
						}
					} catch (_) {
						// If it is not parsable then `no-unsafe-selectors` will give it an error,
						// we can ignore it here.
					}
				});
			},
		};
	},
});

export default rule;
