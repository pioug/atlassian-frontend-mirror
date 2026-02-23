import reducedUiPackStyles from '../../index';

describe('styleSheet', () => {
	it('should not have [object Object]', () => {
		expect(reducedUiPackStyles).not.toContain('[object Object]');
	});
	it('should not have [Function', () => {
		expect(reducedUiPackStyles).not.toContain('[Function');
	});
});
