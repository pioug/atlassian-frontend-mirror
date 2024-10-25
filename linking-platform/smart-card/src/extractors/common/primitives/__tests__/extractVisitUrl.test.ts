import { TEST_UNDEFINED_LINK, TEST_VISIT_URL } from '../../__mocks__/jsonld';
import { extractVisitUrl } from '../extractVisitUrl';

describe('extractors.primitives.visitUrl', () => {
	afterEach(() => jest.clearAllMocks());

	it('returns raw string', () => {
		expect(extractVisitUrl(TEST_UNDEFINED_LINK)).toBe(TEST_VISIT_URL);
	});
});
