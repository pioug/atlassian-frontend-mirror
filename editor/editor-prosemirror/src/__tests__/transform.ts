describe('prosemirror-transform', () => {
	const internalFunctions = [
		// see: https://github.com/ProseMirror/prosemirror-transform/blob/477972474d9fdc8648d1afe3e5a07afe9db5f1bd/src/index.ts#L3
		'TransformError',
	];
	it('should export the same public functions', () => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const original = require('prosemirror-transform');
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const wrapper = require('../transform');
		const originalPublicFunctions = Object.keys(original)
			.filter((f) => !f.startsWith('__'))
			.filter((f) => !internalFunctions.includes(f))
			.sort();
		const wrapperFunctions = Object.keys(wrapper).sort();

		expect(wrapperFunctions).toEqual(originalPublicFunctions);
	});
});
