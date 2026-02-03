describe('prosemirror-view', () => {
	it('should export the same public functions', () => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const original = require('prosemirror-view');
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const wrapper = require('../view');
		const originalPublicFunctions = [
			...Object.keys(original).filter((f) => !f.startsWith('__')),
			// We are using this private property in Editor code :(
			'__parseFromClipboard',
		].sort();
		const wrapperFunctions = Object.keys(wrapper).sort();

		expect(wrapperFunctions).toEqual(originalPublicFunctions);
	});
});
