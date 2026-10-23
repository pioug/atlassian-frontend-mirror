import type { Rule } from 'eslint';
import type * as ESTree from 'estree';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';
import { findVariable } from '@atlaskit/eslint-utils/find-variable';

import { createLintRule } from '../utils/create-lint-rule';

/**
 * Values at or below this are local ordering within a component (a badge over an avatar,
 * a sticky header cell). Values above it are reaching for a global win.
 */
const MAX_LOCAL_Z_INDEX = 10;

/**
 * Stops runaway resolution of `const a = b; const b = a;` style chains.
 */
const MAX_RESOLVE_DEPTH = 5;

const NUMERIC_STRING = /^\s*([+-]?\d+)\s*(!important)?\s*$/;
const CALC_INFINITY = /^\s*calc\(\s*infinity\s*\)\s*(!important)?\s*$/i;

/**
 * Matches `z-index: <value>` inside a CSS string. The value stops at `;`, `}`, or a new line.
 * The lookbehind keeps the match index on `z-index`, so reports can point at it.
 */
const CSS_Z_INDEX = /(?<=^|[\s;{])z-index\s*:\s*([^;}\n]*)/gi;

type FoundValue = { node: ESTree.Node; value: number; label: string };
type ParsedValue = { value: number; label: string };

/**
 * The static name of a key or string argument: `zIndex`, `'zIndex'`, or `` `zIndex` ``.
 */
const getStaticName = (node: ESTree.Node): string | null => {
	if (node.type === 'Identifier') {
		return node.name;
	}
	if (node.type === 'Literal' && typeof node.value === 'string') {
		return node.value;
	}
	if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
		return node.quasis[0].value.cooked ?? null;
	}
	return null;
};

const isZIndexName = (name: string | null): boolean => name === 'zIndex' || name === 'z-index';

const parseCssValue = (text: string): ParsedValue | null => {
	if (CALC_INFINITY.test(text)) {
		return { value: Infinity, label: 'calc(infinity)' };
	}
	const match = NUMERIC_STRING.exec(text);
	if (!match) {
		return null;
	}
	const value = Number(match[1]);
	return { value, label: String(value) };
};

const getRange = (node: ESTree.Node): [number, number] => {
	const withRange = node as ESTree.Node & {
		range?: [number, number];
		start?: number;
		end?: number;
	};
	return withRange.range ?? [withRange.start ?? 0, withRange.end ?? 0];
};

/**
 * `expect(el).toHaveStyle({ zIndex: 700 })` asserts on a value, it doesn't set one.
 */
const isInExpectCall = (node: Rule.Node): boolean => {
	let outermost: Rule.Node = node;

	while (
		(outermost.parent?.type === 'Property' &&
			outermost.parent.parent?.type === 'ObjectExpression') ||
		outermost.parent?.type === 'ObjectExpression'
	) {
		outermost = outermost.parent;
	}

	const call = outermost.parent;

	if (call?.type !== 'CallExpression' || !call.arguments.includes(outermost as ESTree.Expression)) {
		return false;
	}

	let callee: ESTree.Node = call.callee;

	while (callee.type === 'MemberExpression' || callee.type === 'CallExpression') {
		if (
			callee.type === 'CallExpression' &&
			callee.callee.type === 'Identifier' &&
			callee.callee.name === 'expect'
		) {
			return true;
		}
		callee = callee.type === 'MemberExpression' ? callee.object : callee.callee;
	}

	// `expect.objectContaining({ zIndex: 700 })`
	return callee.type === 'Identifier' && callee.name === 'expect';
};

/**
 * Resolves a node to the numbers it can be, where that is knowable from the file alone.
 * Anything that can't be resolved (imports, function calls, `calc()`) is skipped.
 */
const resolveValues = (
	node: ESTree.Node,
	context: Rule.RuleContext,
	depth: number = 0,
): FoundValue[] => {
	if (depth > MAX_RESOLVE_DEPTH) {
		return [];
	}

	switch (node.type as string) {
		case 'Literal': {
			const { value } = node as ESTree.Literal;
			if (typeof value === 'number') {
				return [{ node, value, label: String(value) }];
			}
			if (typeof value === 'string') {
				const parsed = parseCssValue(value);
				return parsed ? [{ node, ...parsed }] : [];
			}
			return [];
		}

		case 'TemplateLiteral': {
			const template = node as ESTree.TemplateLiteral;
			if (template.expressions.length > 0) {
				return [];
			}
			const parsed = parseCssValue(template.quasis[0].value.cooked ?? '');
			return parsed ? [{ node, ...parsed }] : [];
		}

		case 'UnaryExpression': {
			const unary = node as ESTree.UnaryExpression;
			if (unary.operator !== '-' && unary.operator !== '+') {
				return [];
			}
			const sign = unary.operator === '-' ? -1 : 1;
			return resolveValues(unary.argument, context, depth + 1).map((found) => {
				const value = sign * found.value;
				return { node, value, label: Number.isFinite(value) ? String(value) : found.label };
			});
		}

		case 'ConditionalExpression': {
			const conditional = node as ESTree.ConditionalExpression;
			return [
				...resolveValues(conditional.consequent, context, depth + 1),
				...resolveValues(conditional.alternate, context, depth + 1),
			];
		}

		case 'LogicalExpression': {
			const logical = node as ESTree.LogicalExpression;
			// `a && 500` can only be 500 (or a falsy `a`, which isn't a z-index)
			if (logical.operator === '&&') {
				return resolveValues(logical.right, context, depth + 1);
			}
			// `options.zIndex ?? 1000` and `options.zIndex || 200` can be either side
			return [
				...resolveValues(logical.left, context, depth + 1),
				...resolveValues(logical.right, context, depth + 1),
			];
		}

		case 'TSAsExpression':
		case 'TSSatisfiesExpression':
		case 'TSNonNullExpression':
		case 'TSTypeAssertion':
			return resolveValues(
				(node as unknown as { expression: ESTree.Node }).expression,
				context,
				depth,
			);

		case 'Identifier': {
			const variable = findVariable({
				identifier: node as ESTree.Identifier,
				sourceCode: getSourceCode(context),
			});
			const definition = variable?.defs.length === 1 ? variable.defs[0] : undefined;

			if (
				!definition ||
				definition.type !== 'Variable' ||
				definition.parent?.kind !== 'const' ||
				definition.node.id.type !== 'Identifier' ||
				!definition.node.init
			) {
				return [];
			}

			// Report on the usage, not the declaration, so the message lands where z-index is set
			return resolveValues(definition.node.init, context, depth + 1).map((found) => ({
				...found,
				node,
			}));
		}

		default:
			return [];
	}
};

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-global-z-index',
		type: 'problem',
		docs: {
			description:
				'Disallow `z-index` values above 10. Global layer ordering is handled by the browser top layer.',
			recommended: false,
			severity: 'warn',
		},
		messages: {
			noGlobalZIndex:
				"`z-index: {{value}}` looks like it competes in the global stack. Top layer surfaces ignore `z-index`, so this ordering won't hold against them. Use a Design System layering component or `@atlaskit/top-layer`. Values of 10 or less are fine for local ordering.",
		},
	},

	create(context) {
		const sourceCode = getSourceCode(context);

		const reportValues = (node: ESTree.Node) => {
			for (const found of resolveValues(node, context)) {
				if (found.value > MAX_LOCAL_Z_INDEX) {
					context.report({
						node: found.node,
						messageId: 'noGlobalZIndex',
						data: { value: found.label },
					});
				}
			}
		};

		return {
			// css({ zIndex: 500 }), styled.div({ zIndex: 500 }), style={{ zIndex: 500 }},
			// react-select `styles` overrides, and any other object style
			Property(node: Rule.Node) {
				if (node.type !== 'Property' || node.parent.type !== 'ObjectExpression') {
					return;
				}

				// Getters and methods named `zIndex` compute a value we can't know
				if (node.kind !== 'init' || node.method) {
					return;
				}

				// `{ [key]: 500 }` is a variable lookup, not a `zIndex` property
				if (node.computed && node.key.type === 'Identifier') {
					return;
				}

				if (!isZIndexName(getStaticName(node.key))) {
					return;
				}

				if (isInExpectCall(node.parent)) {
					return;
				}

				reportValues(node.value);
			},

			// <Portal zIndex={500} />
			JSXAttribute(node: Rule.Node) {
				const attribute = node as unknown as {
					name: { type: string; name: string };
					value: ESTree.Node | null;
				};

				if (attribute.name.type !== 'JSXIdentifier' || attribute.name.name !== 'zIndex') {
					return;
				}

				if (!attribute.value) {
					return;
				}

				if ((attribute.value.type as string) === 'JSXExpressionContainer') {
					reportValues((attribute.value as unknown as { expression: ESTree.Node }).expression);
					return;
				}

				reportValues(attribute.value);
			},

			// element.style.zIndex = '9999'
			AssignmentExpression(node: Rule.Node) {
				if (
					node.type !== 'AssignmentExpression' ||
					node.operator !== '=' ||
					node.left.type !== 'MemberExpression'
				) {
					return;
				}

				const { object, property, computed } = node.left;

				// `style[key]` is a variable lookup, not a `zIndex` property
				if (computed && property.type === 'Identifier') {
					return;
				}

				if (!isZIndexName(getStaticName(property))) {
					return;
				}

				// Only `<something>.style.zIndex`. Other `.zIndex` writes are not CSS.
				if (
					object.type !== 'MemberExpression' ||
					(object.computed && object.property.type === 'Identifier') ||
					getStaticName(object.property) !== 'style'
				) {
					return;
				}

				reportValues(node.right);
			},

			// element.style.setProperty('z-index', '9999')
			CallExpression(node: Rule.Node) {
				if (
					node.type !== 'CallExpression' ||
					node.callee.type !== 'MemberExpression' ||
					node.callee.property.type !== 'Identifier' ||
					node.callee.property.name !== 'setProperty'
				) {
					return;
				}

				const [name, value] = node.arguments;

				if (
					!name ||
					!value ||
					name.type === 'SpreadElement' ||
					value.type === 'SpreadElement' ||
					getStaticName(name) !== 'z-index'
				) {
					return;
				}

				reportValues(value);
			},

			// css`z-index: 500;`, styled.div`z-index: ${Z};`, createGlobalStyle`...`
			TaggedTemplateExpression(node: Rule.Node) {
				if (node.type !== 'TaggedTemplateExpression') {
					return;
				}

				const { quasis, expressions } = node.quasi;

				quasis.forEach((quasi, index) => {
					const text = quasi.value.raw;
					const isLastQuasi = index === quasis.length - 1;

					// Where `text` starts in the file. Parsers differ on whether the quasi's range
					// includes the `` ` ``, `${` and `}` delimiters, so find it in the quasi's own text.
					const [quasiStart] = getRange(quasi);
					const textStart = quasiStart + sourceCode.getText(quasi).indexOf(text);

					for (const match of text.matchAll(CSS_Z_INDEX)) {
						const valueText = match[1];
						const matchIndex = match.index ?? 0;
						const endsQuasi = matchIndex + match[0].length === text.length;

						// `z-index: ${value}` — the value is the next expression
						if (endsQuasi && !isLastQuasi && valueText.trim() === '') {
							reportValues(expressions[index]);
							continue;
						}

						// `z-index: 1${x}` — the value runs into an expression, so we can't know it
						if (endsQuasi && !isLastQuasi) {
							continue;
						}

						const parsed = parseCssValue(valueText);

						if (parsed && parsed.value > MAX_LOCAL_Z_INDEX) {
							const start = textStart + matchIndex;
							const end = start + match[0].trimEnd().length;

							context.report({
								loc: {
									start: sourceCode.getLocFromIndex(start),
									end: sourceCode.getLocFromIndex(end),
								},
								messageId: 'noGlobalZIndex',
								data: { value: parsed.label },
							});
						}
					}
				});
			},
		};
	},
});

export default rule;
