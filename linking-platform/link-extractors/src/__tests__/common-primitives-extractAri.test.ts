import { TEST_ARI, TEST_BASE_DATA } from '../__mocks__/linkingPlatformJsonldMocks';
import { extractAri } from '../extract-ari';

describe('extractors.primitives.ari', () => {
	it('returns undefined if the JSON-LD data is undefined', () => {
		expect(extractAri(undefined as never)).toBeUndefined();
	});

	it('returns undefined if not present', () => {
		expect(extractAri(TEST_BASE_DATA)).toBe(undefined);
	});

	it('returns undefined if the ARI is undefined', () => {
		expect(extractAri({ ...TEST_BASE_DATA, 'atlassian:ari': undefined })).toBeUndefined();
	});

	it('returns ARI if present', () => {
		expect(
			extractAri({
				...TEST_BASE_DATA,
				'atlassian:ari': TEST_ARI,
			}),
		).toBe(TEST_ARI);
	});
});
