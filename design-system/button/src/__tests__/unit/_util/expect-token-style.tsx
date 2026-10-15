/**
 * Assert the semantic CSS variable, independently of Compiled's minified fallback.
 */
export function expectTokenStyle(
	element: HTMLElement,
	property: string,
	tokenName: string,
	target = '',
): void {
	const variable = `--ds-${tokenName.replace(/^color\./, '').replace(/\./g, '-')}`;
	const targets = target.startsWith('::') ? [target, target.slice(1)] : [target];
	const selectors = Array.from(element.classList).flatMap((name) =>
		targets.map((pseudo) => `.${name}${pseudo}`),
	);
	const values = Array.from(document.styleSheets).flatMap((sheet) =>
		Array.from(sheet.cssRules)
			.filter((rule): rule is CSSStyleRule => 'selectorText' in rule)
			.filter((rule) => selectors.includes(rule.selectorText))
			.map((rule) => rule.style.getPropertyValue(property).trim()),
	);
	expect(
		values.some((value) => value.startsWith(`var(${variable},`) || value === `var(${variable})`),
	).toBe(true);
}
