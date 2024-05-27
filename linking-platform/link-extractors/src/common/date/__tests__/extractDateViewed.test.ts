import { type JsonLd } from 'json-ld-types';

import { TEST_BASE_DATA } from '../../__mocks__/linkingPlatformJsonldMocks';
import { extractDateViewed } from '../extractDateViewed';

describe('extractors.date.viewed', () => {
  it('returns undefined if not present', () => {
    expect(extractDateViewed(TEST_BASE_DATA as JsonLd.Data.Document)).toBe(
      undefined,
    );
  });

  it('returns date if present', () => {
    expect(
      extractDateViewed({
        ...(TEST_BASE_DATA as JsonLd.Data.Document),
        'atlassian:dateViewed': 'now',
      }),
    ).toBe('now');
  });
});
