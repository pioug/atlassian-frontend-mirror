import type { Rule } from 'eslint';
import type { Property } from 'estree';

import { createLintRule } from '../utils/create-lint-rule';

const EASING_KEYWORDS = [
	'ease',
	'ease-in',
	'ease-out',
	'ease-in-out',
	'linear',
	'step-start',
	'step-end',
];
const KEYWORD_VALUES = ['none', 'all', 'inherit', 'initial', 'unset'];

const isDuration = (token: string): boolean => /^(?:0|\d+(?:\.\d+)?m?s)$/.test(token);

const isEasing = (token: string): boolean =>
	EASING_KEYWORDS.includes(token) ||
	token.startsWith('cubic-bezier(') ||
	token.startsWith('steps(');

type TransitionComponents = {
	transitionProperty?: string;
	transitionDuration?: string;
	transitionDelay?: string;
	transitionTimingFunction?: string;
	[key: string]: string | undefined;
};

type AnimationComponents = {
	animationName?: string;
	animationDuration?: string;
	animationDelay?: string;
	animationTimingFunction?: string;
	animationIterationCount?: string;
	animationDirection?: string;
	animationFillMode?: string;
	animationPlayState?: string;
	[key: string]: string | undefined;
};

/**
 * Tokenizes a CSS shorthand value string, respecting function boundaries.
 * e.g. 'opacity 200ms cubic-bezier(0.4, 0, 0, 1) 0ms' →
 *      ['opacity', '200ms', 'cubic-bezier(0.4, 0, 0, 1)', '0ms']
 * Splits on whitespace only when not inside parentheses.
 */
const tokenizeShorthand = (value: string): string[] => {
	const tokens: string[] = [];
	let depth = 0;
	let current = '';

	for (let i = 0; i < value.length; i++) {
		const ch = value[i];
		if (ch === '(') {
			depth++;
			current += ch;
		} else if (ch === ')') {
			depth--;
			current += ch;
		} else if (/\s/.test(ch) && depth === 0) {
			if (current.length > 0) {
				tokens.push(current);
				current = '';
			}
		} else {
			current += ch;
		}
	}
	if (current.length > 0) {
		tokens.push(current);
	}
	return tokens;
};

// Splits on top-level commas (outside function parens) — preserves cubic-bezier(...) commas.
const splitOnTopLevelCommas = (value: string): string[] => {
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
};

const parseTransition = (value: string): TransitionComponents => {
	const parts = tokenizeShorthand(value.trim());
	const result: TransitionComponents = {};
	let durationCount = 0;

	for (const part of parts) {
		if (isDuration(part)) {
			if (durationCount === 0) {
				result.transitionDuration = part;
			} else {
				result.transitionDelay = part;
			}
			durationCount++;
		} else if (isEasing(part)) {
			result.transitionTimingFunction = part;
		} else {
			result.transitionProperty = part;
		}
	}

	return result;
};

const parseAnimation = (value: string): AnimationComponents => {
	const parts = tokenizeShorthand(value.trim());
	const result: AnimationComponents = {};
	let durationCount = 0;

	for (const part of parts) {
		if (isDuration(part)) {
			if (durationCount === 0) {
				result.animationDuration = part;
			} else {
				result.animationDelay = part;
			}
			durationCount++;
		} else if (isEasing(part)) {
			result.animationTimingFunction = part;
		} else if (part === 'infinite' || /^\d+(\.\d+)?$/.test(part)) {
			result.animationIterationCount = part;
		} else if (['normal', 'reverse', 'alternate', 'alternate-reverse'].includes(part)) {
			result.animationDirection = part;
		} else if (['none', 'forwards', 'backwards', 'both'].includes(part)) {
			result.animationFillMode = part;
		} else if (['running', 'paused'].includes(part)) {
			result.animationPlayState = part;
		} else {
			result.animationName = part;
		}
	}

	return result;
};

// Combine sub-property values across comma-separated transitions/animations.
// If no segment explicitly set this sub-property, omit it entirely.
// Otherwise, fill missing slots with the CSS spec default to preserve positional alignment.
const combineSubPropertyValues = <T extends Record<string, string | undefined>>(
	segments: T[],
	subProperty: keyof T,
	defaultValue: string,
): string | undefined => {
	if (segments.every((s) => s[subProperty] === undefined)) {
		return undefined;
	}
	return segments.map((s) => s[subProperty] ?? defaultValue).join(', ');
};

const buildTransitionFix = (segments: TransitionComponents[], indent: string): string => {
	const lines: string[] = [];
	const property = combineSubPropertyValues(segments, 'transitionProperty', 'all');
	const duration = combineSubPropertyValues(segments, 'transitionDuration', '0s');
	const timing = combineSubPropertyValues(segments, 'transitionTimingFunction', 'ease');
	const delay = combineSubPropertyValues(segments, 'transitionDelay', '0s');
	if (property !== undefined) lines.push(`transitionProperty: '${property}'`);
	if (duration !== undefined) lines.push(`transitionDuration: '${duration}'`);
	if (timing !== undefined) lines.push(`transitionTimingFunction: '${timing}'`);
	if (delay !== undefined) lines.push(`transitionDelay: '${delay}'`);
	return lines.join(`,\n${indent}`);
};

const buildAnimationFix = (segments: AnimationComponents[], indent: string): string => {
	const lines: string[] = [];
	const name = combineSubPropertyValues(segments, 'animationName', 'none');
	const duration = combineSubPropertyValues(segments, 'animationDuration', '0s');
	const timing = combineSubPropertyValues(segments, 'animationTimingFunction', 'ease');
	const delay = combineSubPropertyValues(segments, 'animationDelay', '0s');
	const iter = combineSubPropertyValues(segments, 'animationIterationCount', '1');
	const direction = combineSubPropertyValues(segments, 'animationDirection', 'normal');
	const fill = combineSubPropertyValues(segments, 'animationFillMode', 'none');
	const playState = combineSubPropertyValues(segments, 'animationPlayState', 'running');
	if (name !== undefined) lines.push(`animationName: '${name}'`);
	if (duration !== undefined) lines.push(`animationDuration: '${duration}'`);
	if (timing !== undefined) lines.push(`animationTimingFunction: '${timing}'`);
	if (delay !== undefined) lines.push(`animationDelay: '${delay}'`);
	if (iter !== undefined) lines.push(`animationIterationCount: '${iter}'`);
	if (direction !== undefined) lines.push(`animationDirection: '${direction}'`);
	if (fill !== undefined) lines.push(`animationFillMode: '${fill}'`);
	if (playState !== undefined) lines.push(`animationPlayState: '${playState}'`);
	return lines.join(`,\n${indent}`);
};

const TRANSITION_SUB_PROPERTIES = [
	'transitionProperty',
	'transitionDuration',
	'transitionTimingFunction',
	'transitionDelay',
];

const ANIMATION_SUB_PROPERTIES = [
	'animationName',
	'animationDuration',
	'animationTimingFunction',
	'animationDelay',
	'animationIterationCount',
	'animationDirection',
	'animationFillMode',
	'animationPlayState',
];

const executeExpandTransitionRule = (
	context: Rule.RuleContext,
	node: Property,
	property: 'transition' | 'animation',
) => {
	if (node.value.type === 'CallExpression') {
		return;
	}

	if (node.value.type === 'TemplateLiteral') {
		return;
	}

	if (node.value.type !== 'Literal' || typeof node.value.value !== 'string') {
		return;
	}

	const rawValue = node.value.value;

	if (KEYWORD_VALUES.includes(rawValue)) {
		return;
	}

	const subProperties =
		property === 'transition' ? TRANSITION_SUB_PROPERTIES : ANIMATION_SUB_PROPERTIES;

	// Extract leading whitespace to preserve indentation style (tabs vs spaces)
	const sourceCode = context.sourceCode ?? (context as any).getSourceCode();
	const nodeStart = node.loc?.start;
	let indent = '\t';
	if (nodeStart) {
		const lineText = sourceCode.lines[nodeStart.line - 1] ?? '';
		const leadingWhitespace = lineText.match(/^(\s*)/);
		if (leadingWhitespace) {
			indent = leadingWhitespace[1];
		}
	}

	const segmentStrings = splitOnTopLevelCommas(rawValue);

	if (property === 'transition') {
		const segments = segmentStrings.map(parseTransition);
		const fixText = buildTransitionFix(segments, indent);
		context.report({
			node,
			messageId: 'expandTransitionShorthand',
			data: {
				property,
				subProperties: subProperties.join(', '),
			},
			fix(fixer) {
				return fixer.replaceText(node, fixText);
			},
		});
	} else {
		const segments = segmentStrings.map(parseAnimation);
		const fixText = buildAnimationFix(segments, indent);
		context.report({
			node,
			messageId: 'expandTransitionShorthand',
			data: {
				property,
				subProperties: subProperties.join(', '),
			},
			fix(fixer) {
				return fixer.replaceText(node, fixText);
			},
		});
	}
};

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'expand-motion-shorthand',
		type: 'suggestion',
		fixable: 'code',
		docs: {
			description:
				'Expands `transition` and `animation` CSS shorthand properties into their individual sub-properties, so individual values can be replaced with motion tokens.',
			recommended: false,
			severity: 'warn',
		},
		messages: {
			expandTransitionShorthand:
				"Use {{ subProperties }} instead of the '{{ property }}' shorthand so that individual values can be replaced with motion tokens.",
		},
	},

	create(context) {
		return {
			'Property[key.name="transition"]': function (node: Property) {
				executeExpandTransitionRule(context, node, 'transition');
			},
			'Property[key.name="animation"]': function (node: Property) {
				executeExpandTransitionRule(context, node, 'animation');
			},
		};
	},
});

export default rule;
