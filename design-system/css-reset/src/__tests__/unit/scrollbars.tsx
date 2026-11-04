import browserFixesStyles from '../../browser-fixes';
import scrollbarStyles from '../../scrollbars';

const selector =
	':where(:root[data-scrollbar-harmonisation], :root[data-scrollbar-harmonisation] *)';

describe('standalone scrollbar styles', () => {
	it('are composed into the full reset', () => {
		expect(browserFixesStyles).toContain(scrollbarStyles);
	});

	it('keep standard scrollbar colours inherited from the gated root', () => {
		expect(scrollbarStyles).toContain(
			'scrollbar-color: var(--ds-background-accent-gray-subtle, #8C8F97) transparent;',
		);
		expect(scrollbarStyles).not.toMatch(/\* \{\s*scrollbar-color/);
		expect(scrollbarStyles).not.toContain('--ds-border-input');
		expect(scrollbarStyles).not.toContain('--ds-elevation-surface-current');
		expect(scrollbarStyles).not.toContain('data-scrollbar-harmonisation-transparent');
	});

	it('declares standard properties only where the WebKit treatment does not apply', () => {
		const standard = `{
  :root[data-scrollbar-harmonisation] {
    scrollbar-color: var(--ds-background-accent-gray-subtle, #8C8F97) transparent;
  }

  ${selector} {
    scrollbar-width: thin;
  }
}`;
		expect(scrollbarStyles).toContain(
			`@media (hover: none), (pointer: coarse), (pointer: none), (any-pointer: coarse) ${standard}`,
		);
		expect(scrollbarStyles).toContain(
			`@supports not selector(::-webkit-scrollbar-thumb:hover) ${standard}`,
		);
	});

	it('limits custom sizing to supported fine-pointer environments', () => {
		const webkit = scrollbarStyles.slice(
			scrollbarStyles.indexOf('@media (hover: hover)'),
			scrollbarStyles.indexOf('@media (forced-colors: active)'),
		);
		expect(webkit).toContain('@media (hover: hover) and (pointer: fine) and (forced-colors: none)');
		expect(webkit).toContain('@media not all and (any-pointer: coarse)');
		expect(webkit).toContain('@supports selector(::-webkit-scrollbar-thumb:hover)');
		expect(webkit).toContain('width: 12px;\n        height: 12px;');
		expect(webkit).toContain('border: 2px solid transparent;');
		expect(webkit).toContain('background-clip: padding-box;');
		// Nothing to undo on this path: every element would otherwise carry two width declarations.
		expect(webkit).not.toMatch(/scrollbar-(?:width|color)/);
	});

	it('uses low-specificity thumb rules and changes only colour on interaction', () => {
		expect(scrollbarStyles).toContain(
			'background-color: var(--ds-background-accent-gray-subtle, #8C8F97);',
		);
		expect(scrollbarStyles).toContain(
			`${selector}::-webkit-scrollbar-thumb:hover,\n      ${selector}::-webkit-scrollbar-thumb:active {\n        background-color: var(--ds-background-accent-gray-bolder, #6B6E76);\n      }`,
		);
		expect(scrollbarStyles).toContain('@layer atlaskit-scrollbar-harmonisation');
		expect(scrollbarStyles).not.toMatch(/transition:|animation:/);
		expect(scrollbarStyles).not.toMatch(/:root\[data-scrollbar-harmonisation\] \*::/);
	});

	it('returns colours and sizing to the browser in forced colours', () => {
		expect(scrollbarStyles).toContain(
			`@media (forced-colors: active) {\n  :root[data-scrollbar-harmonisation] {\n    scrollbar-color: auto;\n  }\n\n  ${selector} {\n    scrollbar-width: auto;\n  }`,
		);
	});
});

// Confluence's static-asset reporter minifies the reset with CSSO, not Lightning CSS.
// CSSO drops media conditions containing nested `(not (...))` syntax.
describe('Confluence scrollbar minification', () => {
	it('preserves custom geometry, colours and capability guards through CSSO', () => {
		const { minify } = jest.requireActual<{
			minify(css: string): { css: string };
		}>('csso');
		const output = minify(scrollbarStyles).css;
		expect(output).toContain('--ds-background-accent-gray-subtle');
		expect(output).toContain('--ds-background-accent-gray-bolder');
		expect(output).toContain('width:12px');
		expect(output).toContain('not all and (any-pointer:coarse)');
		expect(output).toContain('(forced-colors:none)');
		expect(output).toContain('(hover:none),(pointer:coarse),(pointer:none),(any-pointer:coarse)');
		expect(output).toContain('@supports not selector(::-webkit-scrollbar-thumb:hover)');
	});
});
