import { JsonLd } from 'json-ld-types';
import { extractDateViewed } from '../extractDateViewed';
import { TEST_BASE_DATA } from '../../__mocks__/jsonld';

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
