import {
  TEST_BASE_DATA,
  TEST_IMAGE,
  TEST_LINK,
  TEST_URL,
} from '../../__mocks__/linkingPlatformJsonldMocks';
import { extractImage } from '../extractImage';

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
