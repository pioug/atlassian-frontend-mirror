describe('prosemirror-model', () => {
	it('should export the same public functions', () => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const wrapper = require('prosemirror-model');
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const original = require('../model');
		const originalPublicFunctions = Object.keys(original)
			.filter((f) => !f.startsWith('__'))
			.sort();
		const wrapperFunctions = Object.keys(wrapper).sort();

		expect(wrapperFunctions).toEqual(originalPublicFunctions);
	});
});
