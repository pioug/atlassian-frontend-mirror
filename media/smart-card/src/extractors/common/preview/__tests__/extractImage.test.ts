import { extractImage } from '../extractImage';
import {
  TEST_BASE_DATA,
  TEST_URL,
  TEST_LINK,
  TEST_IMAGE,
} from '../../__mocks__/jsonld';

describe('extractors.preview.image', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns raw string', () => {
    expect(extractImage(TEST_BASE_DATA)).toBe(TEST_URL);
  });

  it('returns image url from link', () => {
    const data = { ...TEST_BASE_DATA };
    data.image = TEST_LINK;
    expect(extractImage(data)).toBe(TEST_URL);
  });

  it('returns image url from image', () => {
    const data = { ...TEST_BASE_DATA };
    data.image = TEST_IMAGE;
    expect(extractImage(data)).toBe(TEST_URL);
  });
});
