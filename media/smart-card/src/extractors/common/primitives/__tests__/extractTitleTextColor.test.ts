import { extractTitleTextColor } from '../extractTitleTextColor';
import { TEST_BASE_DATA, TEST_UNDEFINED_LINK } from '../../__mocks__/jsonld';
import { R500 } from '@atlaskit/theme/colors';

describe('extractors.primitives.titleTextColor', () => {
  it('returns undefined for types that are not undefined links', () => {
    expect(extractTitleTextColor(TEST_BASE_DATA)).toBe(undefined);
  });
  it('returns R500 color for undefined links', () => {
    expect(extractTitleTextColor(TEST_UNDEFINED_LINK)).toBe(R500);
  });
});
