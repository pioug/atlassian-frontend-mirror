import React from 'react';

import { render } from '@atlassian/testing-library';

import { Popover } from '../../src/popover';

/**
 * The host zeroes its child's `min-*-size` so the viewport cap can reach a
 * non-scrolling child, and promises that a child's OWN explicit minimum still
 * wins. That is only true if the reset has lower specificity than a class: both
 * are author rules, and Compiled orders its stylesheet by shorthand depth and
 * pseudo order rather than by specificity, so at EQUAL specificity the winner
 * would be whichever module's styles were emitted first.
 *
 * jsdom has no cascade, so this stops at the selector: it reads the injected rules
 * back and checks that the host class is wrapped in `:where()`, which contributes
 * no specificity.
 */
function findInjectedSelectors({ declaration }: { declaration: string }): string[] {
	return Array.from(document.querySelectorAll('style'))
		.flatMap((style) => Array.from(style.sheet?.cssRules ?? []))
		.filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule)
		.filter((rule) => rule.cssText.replace(/\s/g, '').includes(declaration))
		.map((rule) => rule.selectorText);
}

it.each(['min-inline-size:0', 'min-block-size:0', 'flex-grow:1'])(
	'writes the child rule [%s] with a zero-specificity selector, so a class on the child wins',
	(declaration) => {
		render(
			<Popover isOpen>
				<div>content</div>
			</Popover>,
		);

		const selectors = findInjectedSelectors({ declaration });

		expect(selectors.length).toBeGreaterThan(0);
		for (const selector of selectors) {
			// `:where(.<host>) > *`: a class inside `:where()` counts for nothing, and
			// the universal selector counts for nothing.
			expect(selector).toMatch(/^:where\(\.[\w-]+\)\s*>\s*\*$/);
		}
	},
);
