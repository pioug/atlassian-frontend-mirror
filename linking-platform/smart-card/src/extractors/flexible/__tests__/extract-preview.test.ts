import { MediaType } from '../../../constants';
import { TEST_BASE_DATA, TEST_URL } from '../../common/__mocks__/jsonld';
import extractPreview from '../extract-preview';

describe('extractPreview', () => {
	it('returns preview type and url', () => {
		const data = extractPreview(TEST_BASE_DATA);
		expect(data).toEqual({ type: MediaType.Image, url: TEST_URL });
	});

	it('returns undefined when image url is not provided', () => {
		const data = extractPreview({ ...TEST_BASE_DATA, image: undefined });
		expect(data).toBeUndefined();
	});
});
