import React, { useRef } from 'react';

import invariant from 'tiny-invariant';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { useAnchoredPopover } from '../../src/internal/use-anchored-popover';
import { Popover } from '../../src/popover';

/**
 * The DEFAULT flip floor has two forms, and the browser picks one. An inline
 * style cannot hold `@supports`, so `useAnchoredPopover` writes the fixed floor
 * to `--ds-popover-flip-floor`, the viewport clamp to
 * `--ds-popover-flip-floor-limit`, and a `min-{axis}-size` that reads
 * `--ds-popover-content-sized-flip-floor` first. `Popover`'s stylesheet defines
 * that property inside `@supports (calc-size())`:
 *
 * - supported (Chrome): the floor is the content's own size up to the clamp,
 *   with no 150px term, so content keeps its size whenever some side can hold
 *   it, and still flips;
 * - not supported (Safari, Firefox): the floor is the fixed one, unchanged.
 *
 * jsdom evaluates neither `@supports` nor `var()`, so this test reads the rules
 * Compiled injects and resolves the `var()` chain itself, once with the
 * `@supports` rule applied and once without. Geometry is covered by
 * `__tests__/playwright/fit-available-space.spec.tsx`.
 */

// JSDOM has no `window.CSS`. Set before the first render, because the
// positioning probe caches its first answer. `true` takes the CSS path, which is
// the only path with a flip floor.
(window as unknown as { CSS: { supports: () => boolean } }).CSS = {
	supports: () => true,
};

const CONTENT_SIZED_FLIP_FLOOR = '--ds-popover-content-sized-flip-floor';
const FLIP_FLOOR = '--ds-popover-flip-floor';
const FLIP_FLOOR_LIMIT = '--ds-popover-flip-floor-limit';

/**
 * The viewport clamp for this fixture: block placement, default gap, and the
 * anchor sized with `anchor-size()`.
 */
const CLAMP =
	'max(0px, calc((100dvh - anchor-size(self-block)) / 2 - var(--ds-space-100, 8px) - 5px))';

function FittingPopover() {
	const anchorRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const placement = { axis: 'block', edge: 'end' } as const;

	useAnchoredPopover({
		anchorRef,
		popoverRef,
		placement,
		isOpen: true,
		blockSize: 'max-available',
	});

	return (
		<>
			<button ref={anchorRef} type="button">
				trigger
			</button>
			<Popover ref={popoverRef} isOpen testId="popover" placement={placement}>
				<div>content</div>
			</Popover>
		</>
	);
}

function removeSpaces(value: string): string {
	return value.split(' ').join('');
}

// Structural, because jsdom does not expose `CSSSupportsRule` as a global.
function isSupportsRule(rule: CSSRule): rule is CSSSupportsRule {
	return 'conditionText' in rule && 'cssRules' in rule;
}

function isStyleRule(rule: CSSRule): rule is CSSStyleRule {
	return 'selectorText' in rule && 'style' in rule;
}

type TInjectedRule = { supports: string | null; rule: CSSStyleRule };

/**
 * Every style rule Compiled injected, with the `@supports` condition it sits in,
 * if any.
 */
function getInjectedRules(): TInjectedRule[] {
	return Array.from(document.querySelectorAll('style')).flatMap((style) =>
		Array.from(style.sheet?.cssRules ?? []).flatMap((rule): TInjectedRule[] => {
			if (isSupportsRule(rule)) {
				return Array.from(rule.cssRules)
					.filter(isStyleRule)
					.map((inner) => ({ supports: rule.conditionText, rule: inner }));
			}
			if (isStyleRule(rule)) {
				return [{ supports: null, rule }];
			}
			return [];
		}),
	);
}

/**
 * The rules that declare `property` AND match `element` through one of its own
 * classes, with `selector` describing how: `'self'` for `.class`, `'child'` for
 * `*:where(.class) > *`.
 */
function getRulesFor({
	element,
	property,
}: {
	element: HTMLElement;
	property: string;
}): { supports: string | null; selector: 'self' | 'child' | 'other'; value: string }[] {
	const classes = Array.from(element.classList);

	function getSelector(selectorText: string): 'self' | 'child' | 'other' {
		const selector = removeSpaces(selectorText);
		if (classes.some((name) => selector === `.${name}`)) {
			return 'self';
		}
		if (classes.some((name) => selector.endsWith(`:where(.${name})>*`))) {
			return 'child';
		}
		return 'other';
	}

	return getInjectedRules()
		.filter(({ rule }) => rule.style.getPropertyValue(property) !== '')
		.map(({ supports, rule }) => ({
			supports,
			selector: getSelector(rule.selectorText),
			value: rule.style.getPropertyValue(property).trim(),
		}))
		.filter(({ selector }) => selector !== 'other');
}

function getDepthChange(character: string): number {
	if (character === '(') {
		return 1;
	}
	if (character === ')') {
		return -1;
	}
	return 0;
}

/**
 * The index of the `)` that closes the `(` at `openIndex`.
 */
function findClosingParenthesis({
	value,
	openIndex,
}: {
	value: string;
	openIndex: number;
}): number {
	const result = Array.from(value.slice(openIndex)).reduce<{
		depth: number;
		index: number | null;
	}>(
		(state, character, offset) => {
			if (state.index !== null) {
				return state;
			}
			const depth = state.depth + getDepthChange(character);
			return { depth, index: depth === 0 ? openIndex + offset : null };
		},
		{ depth: 0, index: null },
	);
	invariant(result.index !== null, `unbalanced parentheses in ${value}`);
	return result.index;
}

/**
 * Substitutes `var()` the way the cascade does for one element: a defined custom
 * property wins, otherwise the fallback, otherwise the value is invalid (`null`).
 * Enough for the floor's own shape (nested `var()` with fallbacks); not a general
 * CSS resolver.
 */
function resolveVar({
	value,
	customProperties,
}: {
	value: string;
	customProperties: Record<string, string>;
}): string | null {
	const start = value.indexOf('var(');
	if (start === -1) {
		return value;
	}

	const end = findClosingParenthesis({ value, openIndex: start + 'var'.length });
	const [name, ...fallbackParts] = value.slice(start + 'var('.length, end).split(',');
	const definedValue = customProperties[name.trim()];
	const fallback = fallbackParts.length > 0 ? fallbackParts.join(',').trim() : null;
	const replacement = definedValue ?? fallback;
	if (replacement === null) {
		return null;
	}

	const resolvedReplacement = resolveVar({ value: replacement, customProperties });
	const resolvedRest = resolveVar({ value: value.slice(end + 1), customProperties });
	if (resolvedReplacement === null || resolvedRest === null) {
		return null;
	}
	return `${value.slice(0, start)}${resolvedReplacement}${resolvedRest}`;
}

describe('the content-sized flip floor', () => {
	function renderFittingPopover() {
		render(<FittingPopover />);
		const popover = screen.getByTestId('popover');
		const inlineFloor = popover.style.getPropertyValue(FLIP_FLOOR);
		const inlineLimit = popover.style.getPropertyValue(FLIP_FLOOR_LIMIT);
		const minBlockSize = popover.style.getPropertyValue('min-block-size');
		const supportsRules = getRulesFor({
			element: popover,
			property: CONTENT_SIZED_FLIP_FLOOR,
		}).filter(({ supports }) => supports !== null);
		return { popover, inlineFloor, inlineLimit, minBlockSize, supportsRules };
	}

	it('defines the content-sized floor on the host only where calc-size() is supported', () => {
		const { supportsRules } = renderFittingPopover();

		expect(supportsRules).toHaveLength(1);
		const [rule] = supportsRules;
		expect(rule.selector).toBe('self');
		invariant(rule.supports !== null);
		// The condition is what keeps Safari and Firefox on the plain floor.
		expect(removeSpaces(rule.supports)).toBe('(min-block-size:calc-size(max-content,size))');
		expect(removeSpaces(rule.value)).toBe(
			'calc-size(max-content,min(size,var(--ds-popover-flip-floor-limit)))',
		);
	});

	it('resolves to the fixed floor, exactly as before, where calc-size() is NOT supported', () => {
		// The `@supports` rule does not apply, so only the inline properties exist.
		const { inlineFloor, inlineLimit, minBlockSize } = renderFittingPopover();

		expect(inlineFloor).toBe(`min(150px, ${CLAMP})`);
		// The spacing token in the gap resolves too, on both sides.
		const customProperties = { [FLIP_FLOOR]: inlineFloor, [FLIP_FLOOR_LIMIT]: inlineLimit };
		expect(resolveVar({ value: minBlockSize, customProperties })).toBe(
			resolveVar({ value: inlineFloor, customProperties }),
		);
	});

	it('resolves to the content size, up to the clamp and with no 150px term, where calc-size() IS supported', () => {
		const { inlineFloor, inlineLimit, minBlockSize, supportsRules } = renderFittingPopover();
		const [rule] = supportsRules;
		const customProperties = {
			[FLIP_FLOOR]: inlineFloor,
			[FLIP_FLOOR_LIMIT]: inlineLimit,
			[CONTENT_SIZED_FLIP_FLOOR]: rule.value,
		};

		expect(inlineLimit).toBe(CLAMP);
		const resolved = resolveVar({ value: minBlockSize, customProperties });
		const limit = resolveVar({ value: inlineLimit, customProperties });

		invariant(resolved !== null && limit !== null);
		expect(removeSpaces(resolved)).toBe(
			removeSpaces(`calc-size(max-content, min(size, ${limit}))`),
		);
		expect(resolved).not.toContain('150px');
	});

	it('is not inherited by the host child, so an element further in keeps its own floor', () => {
		// Its value was resolved against THIS host's floor. An element inside that
		// `useAnchoredPopover` sizes without `Popover`'s stylesheet would otherwise
		// read it instead of its own floor.
		const { popover } = renderFittingPopover();

		expect(
			getRulesFor({ element: popover, property: CONTENT_SIZED_FLIP_FLOOR }).filter(
				({ selector }) => selector === 'child',
			),
		).toEqual([{ supports: null, selector: 'child', value: 'initial' }]);
	});
});
