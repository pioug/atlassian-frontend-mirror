import { TEST_BASE_DATA, TEST_LINK, TEST_URL } from '../../__mocks__/linkingPlatformJsonldMocks';
import { extractLink } from '../extractLink';

describe('extractors.primitives.link', () => {
	afterEach(() => jest.clearAllMocks());

	it('returns raw string', () => {
		expect(extractLink(TEST_BASE_DATA)).toBe(TEST_URL);
	});

	it('returns string inside link - single item', () => {
		const data = { ...TEST_BASE_DATA };
		data.url = TEST_LINK;
		expect(extractLink(TEST_BASE_DATA)).toBe(TEST_URL);
	});

	it('returns string inside link - array', () => {
		const data = { ...TEST_BASE_DATA };
		data.url = [TEST_LINK];
		expect(extractLink(TEST_BASE_DATA)).toBe(TEST_URL);
	});

	it('should return undefined if data is not available', () => {
		// @ts-ignore For testing purpose
		expect(extractLink()).toBeUndefined();
	});
});
