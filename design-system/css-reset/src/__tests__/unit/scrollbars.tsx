import browserFixesStyles from '../../browser-fixes';
import scrollbarStyles from '../../scrollbars';

describe('standalone scrollbar styles', () => {
	it('are composed into the full reset', () => {
		expect(browserFixesStyles).toContain(scrollbarStyles);
	});

	it('set the subtle thumb color and a transparent track once on the gated root', () => {
		expect(scrollbarStyles).toContain(
			':root[data-scrollbar-harmonisation] {\n  scrollbar-color: var(--ds-background-accent-gray-subtle, #8C8F97) transparent;\n}',
		);
		expect(scrollbarStyles).not.toMatch(/\* \{\s*scrollbar-color/);
		expect(scrollbarStyles).toContain('@layer atlaskit-scrollbar-harmonisation');
	});

	it('leave size, visibility and overlay behavior to the browser', () => {
		// Custom WebKit scrollbars are never overlays, so any of these would override the
		// operating system preference (for example macOS "When scrolling").
		expect(scrollbarStyles).not.toContain('::-webkit-scrollbar');
		expect(scrollbarStyles).not.toContain('scrollbar-width');
		expect(scrollbarStyles).not.toContain('scrollbar-gutter');
	});

	it('returns colors to the browser in forced colors', () => {
		expect(scrollbarStyles).toContain(
			'@media (forced-colors: active) {\n  :root[data-scrollbar-harmonisation] {\n    scrollbar-color: auto;\n  }\n}',
		);
	});
});

// Confluence's static-asset reporter minifies the reset with CSSO, not Lightning CSS.
describe('Confluence scrollbar minification', () => {
	it('preserves the colors and forced-colors reset through CSSO', () => {
		const { minify } = jest.requireActual<{
			minify(css: string): { css: string };
		}>('csso');
		const output = minify(scrollbarStyles).css;
		expect(output).toContain('--ds-background-accent-gray-subtle');
		expect(output).toContain('(forced-colors:active)');
		expect(output).toContain('scrollbar-color:auto');
	});
});
