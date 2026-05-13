import type { Rule } from 'eslint';
import type { Property, ImportDeclaration, CallExpression, Literal } from 'estree';
import tokenDefaultValues from '@atlaskit/tokens/token-default-values';

const DURATION_TOKEN_NAMES = [
	'motion.duration.instant',
	'motion.duration.xxshort',
	'motion.duration.xshort',
	'motion.duration.short',
	'motion.duration.medium',
	'motion.duration.long',
	'motion.duration.xlong',
	'motion.duration.xxlong',
] as const;

function parseDurationMs(value: string): number | null {
	const ms = value.match(/^(\d+(?:\.\d+)?)ms$/);
	if (ms) {
		return parseFloat(ms[1]);
	}
	const s = value.match(/^(\d+(?:\.\d+)?)s$/);
	if (s) {
		return parseFloat(s[1]) * 1000;
	}
	return null;
}

const DURATION_TOKENS: Array<{ ms: number; token: string }> = DURATION_TOKEN_NAMES.map((name) => {
	const rawValue = tokenDefaultValues[name as keyof typeof tokenDefaultValues] as string;
	const ms = parseDurationMs(rawValue);
	if (ms === null) {
		throw new Error(`use-motion-token-values: could not parse duration for token ${name}: ${rawValue}`);
	}
	return { ms, token: name };
}).sort((a, b) => a.ms - b.ms);

const EASING_TOKEN_NAMES = [
	'motion.easing.in.practical',
	'motion.easing.inout.bold',
	'motion.easing.out.practical',
	'motion.easing.out.bold',
] as const;

function parseCubicBezierParams(value: string): number[] | null {
	const match = value.match(/^cubic-bezier\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/);
	if (!match) {
		return null;
	}
	return [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]), parseFloat(match[4])];
}

const EASING_TOKENS: Array<{ value: string; token: string; params: number[] }> = EASING_TOKEN_NAMES.map((name) => {
	const rawValue = tokenDefaultValues[name as keyof typeof tokenDefaultValues] as string;
	const params = parseCubicBezierParams(rawValue);
	if (!params) {
		throw new Error(`use-motion-token-values: could not parse cubic-bezier for token ${name}: ${rawValue}`);
	}
	return { value: rawValue, token: name, params };
});

// Splits on top-level commas (outside function parens) — preserves cubic-bezier(...) commas.
function splitOnTopLevelCommas(value: string): string[] {
	const parts: string[] = [];
	let depth = 0;
	let current = '';
	for (const ch of value) {
		if (ch === '(') {
			depth++;
			current += ch;
		} else if (ch === ')') {
			depth--;
			current += ch;
		} else if (ch === ',' && depth === 0) {
			parts.push(current.trim());
			current = '';
		} else {
			current += ch;
		}
	}
	if (current.trim().length > 0) {
		parts.push(current.trim());
	}
	return parts;
}

const DURATION_PROPERTIES = new Set([
	'transitionDuration',
	'animationDuration',
]);

const EASING_PROPERTIES = new Set([
	'transitionTimingFunction',
	'animationTimingFunction',
]);

// Explicit semantic mappings for CSS keyword easings to motion tokens.
// Pinned by design intent, confirmed with design system team (Alex + Akshay).
const CSS_KEYWORD_EASING_TOKEN_MAP: Record<string, string> = {
	ease: 'motion.easing.out.practical',
	'ease-out': 'motion.easing.out.practical',
	'ease-in': 'motion.easing.in.practical',
	'ease-in-out': 'motion.easing.inout.bold',
	// linear (0,0,1,1) — warn only, no autofix (per Akshay: too generic, no good token match)
};

// Non-curve easing values with no meaningful cubic-bezier representation — skip entirely
const SKIP_EASING_VALUES = new Set([
	'step-start',
	'step-end',
	'inherit',
	'initial',
	'unset',
	'none',
]);

function euclideanDistance(a: number[], b: number[]): number {
	return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

// Maximum Euclidean distance for easing autofix — beyond this threshold, we report-only
const EASING_AUTOFIX_THRESHOLD = 0.5;

function findClosestEasingToken(
	params: number[],
): { token: string; value: string; dist: number } | null {
	let minDist = Infinity;
	let closest = EASING_TOKENS[0];
	for (const entry of EASING_TOKENS) {
		const dist = euclideanDistance(params, entry.params);
		if (dist < minDist) {
			minDist = dist;
			closest = entry;
		}
	}
	if (minDist > EASING_AUTOFIX_THRESHOLD) {
		return null;
	}
	return { token: closest.token, value: closest.value, dist: minDist };
}

function findClosestDurationTokens(ms: number): Array<{ ms: number; token: string }> {
	const exact = DURATION_TOKENS.find((t) => t.ms === ms);
	if (exact) {
		return [exact];
	}

	let minDist = Infinity;
	for (const entry of DURATION_TOKENS) {
		const dist = Math.abs(entry.ms - ms);
		if (dist < minDist) {
			minDist = dist;
		}
	}

	const closest = DURATION_TOKENS.filter((t) => Math.abs(t.ms - ms) === minDist);
	return closest;
}

export const useMotionTokenValues: Rule.RuleModule = {
	meta: {
		type: 'suggestion',
		hasSuggestions: true,
		docs: {
			url: 'https://bitbucket.org/atlassian/atlassian-frontend-monorepo/src/master/platform/packages/platform/eslint-plugin/src/rules/compiled/use-motion-token-values/',
		},
		messages: {
			useMotionDurationToken:
				"Use a motion duration token instead of the hard-coded value '{{ value }}'.",
			useMotionDurationTokenSuggest: 'Replace with {{ suggestion }}.',
			useMotionDurationTokenNearest:
				"No exact token match for '{{ value }}'. Nearest: {{ suggestion1 }} or {{ suggestion2 }}.",
			useMotionDurationTokenSingleNearest:
				"No exact token match for '{{ value }}'. Nearest: {{ suggestion }}.",
			useMotionEasingToken:
				"Use a motion easing token instead of the hard-coded value '{{ value }}'.",
			useMotionEasingTokenSuggest: 'Replace with {{ suggestion }}.',
			useMotionEasingTokenUnknown:
				"Use a motion easing token from @atlaskit/tokens instead of the hard-coded value '{{ value }}'.",
		},
	},

	create(context) {
		let tokensImportNode: ImportDeclaration | null = null;
		let hasTokenSpecifier = false;

		function buildTokenCall(tokenName: string, fallback: string): string {
			return `token('${tokenName}', '${fallback}')`;
		}

		function getImportFix(fixer: Rule.RuleFixer): Rule.Fix[] {
			if (hasTokenSpecifier) {
				return [];
			}
			if (tokensImportNode) {
				// @atlaskit/tokens is imported but without `token` — add `token` to existing import
				const lastSpecifier =
					tokensImportNode.specifiers[tokensImportNode.specifiers.length - 1];
				if (lastSpecifier) {
					return [fixer.insertTextAfter(lastSpecifier as any, ', token')];
				}
				// Empty import — replace the whole declaration
				return [
					fixer.replaceText(
						tokensImportNode as any,
						`import { token } from '@atlaskit/tokens';`,
					),
				];
			}
			const sourceCode = context.sourceCode ?? (context as any).getSourceCode();
			const programBody = sourceCode.ast.body;
			// Insert after the last existing import, or at top if no imports exist
			const lastImport = [...programBody].reverse().find((n) => n.type === 'ImportDeclaration');
			if (lastImport) {
				return [fixer.insertTextAfter(lastImport as any, `\nimport { token } from '@atlaskit/tokens';`)];
			}
			if (programBody.length > 0) {
				return [
					fixer.insertTextBefore(
						programBody[0] as any,
						`import { token } from '@atlaskit/tokens';\n`,
					),
				];
			}
			return [];
		}

		// Returns autofix string for a single duration value, or null if ambiguous (equidistant)
		function resolveDurationToken(value: string): string | null {
			const ms = parseDurationMs(value);
			if (ms === null) {
				return null;
			}
			const exact = DURATION_TOKENS.find((t) => t.ms === ms);
			if (exact) {
				return buildTokenCall(exact.token, value);
			}
			return null;
		}

		function handleDurationProperty(node: Property, rawValue: string) {
			const segments = splitOnTopLevelCommas(rawValue);

			if (segments.length === 1) {
				const ms = parseDurationMs(rawValue);
				if (ms === null) {
					return;
				}
				const exactMatch = DURATION_TOKENS.find((t) => t.ms === ms);
				if (exactMatch) {
					const suggestion = buildTokenCall(exactMatch.token, rawValue);
					context.report({
						node,
						messageId: 'useMotionDurationToken',
						data: { value: rawValue },
						suggest: [
							{
								messageId: 'useMotionDurationTokenSuggest',
								data: { suggestion },
								fix(fixer) {
									return [
										...getImportFix(fixer),
										fixer.replaceText(node.value, suggestion),
									];
								},
							},
						],
					});
				} else {
					const result = findClosestDurationTokens(ms);
					if (result.length >= 2) {
						const suggestion1 = buildTokenCall(result[0].token, rawValue);
						const suggestion2 = buildTokenCall(result[1].token, rawValue);
						context.report({
							node,
							messageId: 'useMotionDurationTokenNearest',
							data: {
								value: rawValue,
								suggestion1: `${suggestion1} (${result[0].ms}ms)`,
								suggestion2: `${suggestion2} (${result[1].ms}ms)`,
							},
						});
					} else {
						const suggestion = buildTokenCall(result[0].token, rawValue);
						context.report({
							node,
							messageId: 'useMotionDurationTokenSingleNearest',
							data: { value: rawValue, suggestion: `${suggestion} (${result[0].ms}ms)` },
						});
					}
				}
				return;
			}

			const resolved = segments.map(resolveDurationToken);
			if (resolved.some((s) => s === null)) {
				return;
			}
			const templateLiteral = '`' + resolved.map((s) => `\${${s}}`).join(', ') + '`';
			context.report({
				node,
				messageId: 'useMotionDurationToken',
				data: { value: rawValue },
				suggest: [
					{
						messageId: 'useMotionDurationTokenSuggest',
						data: { suggestion: templateLiteral },
						fix(fixer) {
							return [
								...getImportFix(fixer),
								fixer.replaceText(node.value, templateLiteral),
							];
						},
					},
				],
			});
		}

		// Returns autofix string for a single easing value, or null if no token suggestion is possible
		function resolveEasingToken(value: string): string | null {
			const trimmed = value.trim();
			if (SKIP_EASING_VALUES.has(trimmed)) {
				return null;
			}
			if (trimmed in CSS_KEYWORD_EASING_TOKEN_MAP) {
				return buildTokenCall(CSS_KEYWORD_EASING_TOKEN_MAP[trimmed], trimmed);
			}
			// linear has no curve (0,0,1,1) — warn only, no autofix
			if (trimmed === 'linear') {
				return null;
			}
			if (trimmed.startsWith('linear(')) {
				// linear() is used for spring animations — motion.easing.spring is experimental, skip
				return null;
			}
			const params = parseCubicBezierParams(trimmed);
			if (!params) {
				return null;
			}
			const exact = EASING_TOKENS.find((t) => t.value === trimmed);
			if (exact) {
				return buildTokenCall(exact.token, trimmed);
			}
			const closest = findClosestEasingToken(params);
			return closest ? buildTokenCall(closest.token, trimmed) : null;
		}

		function handleEasingProperty(node: Property, rawValue: string) {
			const segments = splitOnTopLevelCommas(rawValue);

			// Multi-value path: resolve each segment, autofix only if all resolve cleanly
			if (segments.length > 1) {
				const resolved = segments.map(resolveEasingToken);
				if (resolved.some((s) => s === null)) {
					return;
				}
				const templateLiteral = '`' + resolved.map((s) => `\${${s}}`).join(', ') + '`';
				context.report({
					node,
					messageId: 'useMotionEasingToken',
					data: { value: rawValue },
					suggest: [
						{
							messageId: 'useMotionEasingTokenSuggest',
							data: { suggestion: templateLiteral },
							fix(fixer) {
								return [
									...getImportFix(fixer),
									fixer.replaceText(node.value, templateLiteral),
								];
							},
						},
					],
				});
				return;
			}

			const trimmed = rawValue.trim();

			if (SKIP_EASING_VALUES.has(trimmed)) {
				return;
			}

			// CSS keyword easings: convert to cubic-bezier equivalent and find closest token
			if (trimmed in CSS_KEYWORD_EASING_TOKEN_MAP) {
				const suggestion = buildTokenCall(CSS_KEYWORD_EASING_TOKEN_MAP[trimmed], trimmed);
				context.report({
					node,
					messageId: 'useMotionEasingToken',
					data: { value: trimmed },
					suggest: [
						{
							messageId: 'useMotionEasingTokenSuggest',
							data: { suggestion },
							fix(fixer) {
								return [...getImportFix(fixer), fixer.replaceText(node.value, suggestion)];
							},
						},
					],
				});
				return;
			}
			// linear has no curve (0,0,1,1) — warn only, no autofix
			if (trimmed === 'linear') {
				context.report({
					node,
					messageId: 'useMotionEasingTokenUnknown',
					data: { value: trimmed },
				});
				return;
			}
			if (trimmed.startsWith('linear(')) {
				// linear() is used for spring animations — motion.easing.spring is experimental, skip
				return;
			}

			const params = parseCubicBezierParams(trimmed);
			if (!params) {
				context.report({
					node,
					messageId: 'useMotionEasingTokenUnknown',
					data: { value: rawValue },
				});
				return;
			}

			const exact = EASING_TOKENS.find((t) => t.value === trimmed);
			if (exact) {
				const suggestion = buildTokenCall(exact.token, rawValue);
				context.report({
					node,
					messageId: 'useMotionEasingToken',
					data: { value: rawValue },
					suggest: [
						{
							messageId: 'useMotionEasingTokenSuggest',
							data: { suggestion },
							fix(fixer) {
								return [...getImportFix(fixer), fixer.replaceText(node.value, suggestion)];
							},
						},
					],
				});
				return;
			}

			const closest = findClosestEasingToken(params);
			if (closest) {
				const suggestion = buildTokenCall(closest.token, rawValue);
				context.report({
					node,
					messageId: 'useMotionEasingToken',
					data: { value: rawValue },
					suggest: [
						{
							messageId: 'useMotionEasingTokenSuggest',
							data: { suggestion },
							fix(fixer) {
								return [...getImportFix(fixer), fixer.replaceText(node.value, suggestion)];
							},
						},
					],
				});
			} else {
				context.report({
					node,
					messageId: 'useMotionEasingTokenUnknown',
					data: { value: rawValue },
				});
			}
		}

		function handleProperty(node: Property) {
			const key = node.key;
			if (key.type !== 'Identifier') {
				return;
			}

			const isDuration = DURATION_PROPERTIES.has(key.name);
			const isEasing = EASING_PROPERTIES.has(key.name);
			if (!isDuration && !isEasing) {
				return;
			}

			const value = node.value;

			if (value.type === 'TemplateLiteral') {
				// Only handle no-interpolation template literals (e.g. `200ms`) — treat as string
				const tl = value as import('estree').TemplateLiteral;
				if (tl.expressions.length === 0 && tl.quasis.length === 1) {
					const rawValue = tl.quasis[0].value.cooked ?? tl.quasis[0].value.raw;
					if (isDuration) {
						handleDurationProperty(node, rawValue);
					} else {
						handleEasingProperty(node, rawValue);
					}
				}
				return;
			}

			if (value.type === 'CallExpression') {
				const ce = value as CallExpression;
				if (ce.callee.type === 'Identifier' && ce.callee.name === 'token') {
					return;
				}
				return;
			}

			if (value.type === 'Literal') {
				const lit = value as Literal;
				let rawValue: string;

				if (typeof lit.value === 'string') {
					rawValue = lit.value;
				} else if (typeof lit.value === 'number') {
					// Treat bare numbers as ms
					rawValue = `${lit.value}ms`;
				} else {
					return;
				}

				if (isDuration) {
					handleDurationProperty(node, rawValue);
				} else {
					handleEasingProperty(node, rawValue);
				}
			}
		}

		return {
			ImportDeclaration(node: ImportDeclaration) {
				if (node.source.value === '@atlaskit/tokens') {
					tokensImportNode = node;
					hasTokenSpecifier = node.specifiers.some(
						(s) => s.type === 'ImportSpecifier' && s.local.name === 'token',
					);
				}
			},
			Property(node: Property) {
				handleProperty(node);
			},
		};
	},
};

export default useMotionTokenValues;
