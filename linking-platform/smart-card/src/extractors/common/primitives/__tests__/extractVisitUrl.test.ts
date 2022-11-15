import { extractVisitUrl } from '../extractVisitUrl';
import { TEST_VISIT_URL, TEST_UNDEFINED_LINK } from '../../__mocks__/jsonld';

describe('extractors.primitives.visitUrl', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns raw string', () => {
    expect(extractVisitUrl(TEST_UNDEFINED_LINK)).toBe(TEST_VISIT_URL);
  });
});
