import { extractLink } from '../extractLink';
import { TEST_BASE_DATA, TEST_URL, TEST_LINK } from '../../__mocks__/jsonld';

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
});
