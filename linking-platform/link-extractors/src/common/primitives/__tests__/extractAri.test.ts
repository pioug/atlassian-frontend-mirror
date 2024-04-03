import {
  TEST_ARI,
  TEST_BASE_DATA,
} from '../../__mocks__/linkingPlatformJsonldMocks';
import { extractAri } from '../extractAri';

describe('extractors.primitives.ari', () => {
  it('returns undefined if not present', () => {
    expect(extractAri(TEST_BASE_DATA)).toBe(undefined);
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
