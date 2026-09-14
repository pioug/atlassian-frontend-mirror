import browserFixesStyles from '../../browser-fixes';
import scrollbarStyles from '../../scrollbars';

describe('standalone scrollbar styles', () => {
	it('are composed into the browser fixes used by the full reset', () => {
		expect(browserFixesStyles).toContain(scrollbarStyles);
	});

	it('contain only the attribute-gated scrollbar contract', () => {
		expect(scrollbarStyles).toContain(':root[data-scrollbar-harmonisation]');
		expect(scrollbarStyles).toContain(
			`:root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent],
:root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent] * {
  scrollbar-color: var(--ds-border-input, #8C8F97) transparent;
}`,
		);
		expect(scrollbarStyles).toContain(
			`:root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent]::-webkit-scrollbar-track,
:root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent]::-webkit-scrollbar-corner,
:root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent] *::-webkit-scrollbar-track,
:root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent] *::-webkit-scrollbar-corner {
  background-color: transparent;
}`,
		);
		expect(scrollbarStyles).toContain(
			`@media (forced-colors: active) {
  :root[data-scrollbar-harmonisation],
  :root[data-scrollbar-harmonisation] *,
  :root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent],
  :root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent] * {
    scrollbar-color: auto;
  }`,
		);
		expect(scrollbarStyles).toContain(
			`:root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent] *::-webkit-scrollbar-corner {
    background-color: revert;
    border: revert;
  }`,
		);
		expect(scrollbarStyles).toContain('::-webkit-scrollbar-thumb:hover');
		expect(scrollbarStyles).toContain('border-radius:');
		expect(scrollbarStyles).not.toContain('button {');
	});
});
