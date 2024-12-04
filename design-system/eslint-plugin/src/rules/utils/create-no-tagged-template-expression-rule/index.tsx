/* eslint-disable @atlassian/tangerine/import/entry-points */

// Original source from Compiled https://github.com/atlassian-labs/compiled/blob/master/packages/eslint-plugin/src/utils/create-no-tagged-template-expression-rule/index.ts

// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import esquery from 'esquery';
import type { JSONSchema4 } from 'json-schema';

import {
	getImportSources,
	isEmotion,
	type SupportedNameChecker,
} from '@atlaskit/eslint-utils/is-supported-import';

import { generate } from './generate';
import { getTaggedTemplateExpressionOffset } from './get-tagged-template-expression-offset';
import { toArguments } from './to-arguments';
import { type Argument, type Block, type DeclarationValue } from './types';

type RuleModule = Rule.RuleModule;
type RuleFixer = Rule.RuleFixer;

export const noTaggedTemplateExpressionRuleSchema: JSONSchema4 = [
	{
		type: 'object',
		properties: {
			importSources: {
				type: 'array',
				items: { type: 'string' },
				uniqueItems: true,
			},
		},
	},
];

/**
 * When true, template strings containing multiline comments are completely skipped over.
 *
 * When false, multiline comments are stripped out. Ideally we would preserve them,
 * but it would add a lot of complexity.
 */
const shouldSkipMultilineComments = false;

export const createNoTaggedTemplateExpressionRule =
	(isUsage: SupportedNameChecker, messageId: string): RuleModule['create'] =>
	(context) => {
		const importSources = getImportSources(context);

		return {
			TaggedTemplateExpression(node) {
				const { references } = context.getScope();

				if (!isUsage(node.tag, references, importSources)) {
					return;
				}

				context.report({
					messageId,
					node,
					*fix(fixer: RuleFixer) {
						const { quasi } = node;
						const source = context.getSourceCode();

						// TODO Eventually handle comments instead of skipping them
						// Skip auto-fixing comments
						if (
							shouldSkipMultilineComments &&
							quasi.quasis
								.map((q) => q.value.raw)
								.join('')
								.match(/\/\*[\s\S]*\*\//g)
						) {
							return;
						}

						const matches = esquery(node, 'ArrowFunctionExpression > BlockStatement');
						if (matches.length) {
							return;
						}

						if (
							!quasi.expressions.length &&
							quasi.quasis.length === 1 &&
							!quasi.quasis[0].value.raw.trim()
						) {
							// Replace empty tagged template expression with the equivalent object call expression
							yield fixer.replaceText(quasi, '({})');
							return;
						}

						const args = toArguments(source, quasi);

						if (args.some(hasNestedSelectorWithMultipleArguments)) {
							/**
							 * We don't want to autofix if we would produce an array value, for example:
							 * ```
							 * styled.div({
							 *  ':hover': [
							 *    mixin,
							 *    {
							 *      color: 'red'
							 *    }
							 *  ]
							 * })
							 * ```
							 *
							 * This should only occur if there is a mixin in a nested selector.
							 *
							 * The array syntax is only supported by emotion.
							 */
							return;
						}

						// Skip invalid CSS
						if (args.length < 1) {
							return;
						}

						const oldCode = source.getText(node);
						// Remove quasi:
						// styled.div<Props>`
						//    color: red;
						// `
						// becomes
						// styled.div<Props>
						const withoutQuasi = oldCode.replace(source.getText(quasi), '');
						const newCode =
							withoutQuasi +
							// Indent the arguments after the tagged template expression range
							generate(args, getTaggedTemplateExpressionOffset(node));

						if (oldCode === newCode) {
							return;
						}

						// For styles like `position: initial !important`,
						// Emotion can give typechecking errors when using object syntax
						// due to csstype being overly strict
						const usesEmotion = isEmotion(node.tag, references, importSources);
						if (usesEmotion && !!newCode.match(/!\s*important/gm)) {
							return;
						}

						if (/\$\{.*:/.test(newCode)) {
							/**
							 * If we find a variable in a property at all, we skip it. There are two reasons:
							 * - `styled-components@3.x` does not support variables in a selector (see the first example).
							 * - We cannot guarantee that the contents of a mixin will ever be valid as a property or selector (which in tagged template expressions don't have to even be called).
							 * - It's not uncommon we just get this parsing wrong altogether…
							 *
							 * // TODO: In this case, we _might_ want to convert this into a suggestion to support manual remediation, some of those code isn't bad, or it can be manually made safe…
							 *
							 * @examples
							 * ```tsx
							 * const Component = styled.div`
							 *   & + ${Button} { color: red; }
							 * `;
							 * ```
							 *
							 * ```tsx
							 * const Component = styled.div`
							 *   ${mixin()} button { color: red; }
							 *   ${mixin} button { color: red; }
							 * `;
							 * ```
							 *
							 * ```tsx
							 * const styles = `&:active { color: blue; }`;
							 * const Component = styled.div`
							 *   ${styles} &:hover {
							 *     color: red;
							 *   }
							 * `;
							 * ```
							 */
							return;
						}

						yield fixer.insertTextBefore(node, newCode);
						yield fixer.remove(node);
					},
				});
			},
		};
	};

type Node = DeclarationValue | Block | Argument;

function hasNestedSelectorWithMultipleArguments(arg: Node) {
	if (arg.type === 'literal' || arg.type === 'expression' || arg.type === 'declaration') {
		return false;
	}

	if (arg.type === 'rule' && arg.declarations.length > 1) {
		return true;
	}

	if (arg.type === 'block') {
		return arg.blocks.some(hasNestedSelectorWithMultipleArguments);
	}

	if (arg.type === 'rule') {
		return arg.declarations.some(hasNestedSelectorWithMultipleArguments);
	}
}
