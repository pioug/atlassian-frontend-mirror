/** @jest-environment node */

jest.mock('hash-wasm', () => {
	throw new Error('Exposure hashing must not load the multi-algorithm bundle');
});

it('initializes XXH3 without loading the multi-algorithm bundle', async () => {
	const { initializeExposureHash, exposureDigest } = await import('../exposure/digest');
	await initializeExposureHash();
	expect(exposureDigest('identity')).toBe('ffp-exp-v1:a98202858f0967e0');
});
