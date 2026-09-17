describe('prosemirror-transform', () => {
	const internalFunctions = [
		// see: https://github.com/ProseMirror/prosemirror-transform/blob/477972474d9fdc8648d1afe3e5a07afe9db5f1bd/src/index.ts#L3
		'TransformError',
	];
	it('should export the same public functions except the separately exposed Step', () => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const original = require('prosemirror-transform');
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const wrapper = require('../transform');
		const originalPublicFunctions = Object.keys(original)
			.filter((f) => !f.startsWith('__'))
			.filter((f) => !internalFunctions.includes(f) && f !== 'Step')
			.sort();
		const wrapperFunctions = Object.keys(wrapper).sort();

		expect(wrapperFunctions).toEqual(originalPublicFunctions);
		expect(wrapper).not.toHaveProperty('Step');
	});

	it('should still initialize metadata preservation without exporting Step', () => {
		jest.isolateModules(() => {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const original = require('prosemirror-transform');
			const originalFromJSON = original.Step.fromJSON;
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			require('../transform');

			expect(original.Step.fromJSON).not.toBe(originalFromJSON);
			const json = {
				stepType: 'replace',
				from: 0,
				to: 0,
				metadata: { source: 'synchrony-reconcile' },
			};
			// An empty replacement needs no schema to deserialize its empty slice.
			expect(original.Step.fromJSON(undefined, json).toJSON()).toEqual(json);
		});
	});
});
