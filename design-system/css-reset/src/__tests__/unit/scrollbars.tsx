import browserFixesStyles from '../../browser-fixes';
import scrollbarStyles from '../../scrollbars';

describe('standalone scrollbar styles', () => {
	it('are composed into the browser fixes used by the full reset', () => {
		expect(browserFixesStyles).toContain(scrollbarStyles);
	});

	it('contain only the attribute-gated scrollbar contract', () => {
		expect(scrollbarStyles).toContain(
			`:root[data-scrollbar-harmonisation] {
  scrollbar-color: var(--ds-border-input, #8C8F97) transparent;
}`,
		);
		expect(scrollbarStyles).toContain(
			`:root[data-scrollbar-harmonisation]::-webkit-scrollbar-track,
:root[data-scrollbar-harmonisation]::-webkit-scrollbar-corner,
:root[data-scrollbar-harmonisation] *::-webkit-scrollbar-track,
:root[data-scrollbar-harmonisation] *::-webkit-scrollbar-corner {
  background-color: transparent;
  border: 0;
}`,
		);
		expect(scrollbarStyles).toContain(
			`@media (forced-colors: active) {
  :root[data-scrollbar-harmonisation] {
    scrollbar-color: auto;
  }`,
		);
		expect(scrollbarStyles).toContain(
			`:root[data-scrollbar-harmonisation] *::-webkit-scrollbar-corner {
    background-color: revert;
    border: revert;
  }`,
		);
		// Colours are inherited from the root rather than declared on every element.
		expect(scrollbarStyles).not.toMatch(/\* \{\s*scrollbar-color/);
		expect(scrollbarStyles).not.toContain('--ds-elevation-surface-current');
		expect(scrollbarStyles).not.toContain('::-webkit-scrollbar-thumb:hover');
		expect(scrollbarStyles).not.toContain('border-radius');
		expect(scrollbarStyles).not.toContain('button {');
	});
});
