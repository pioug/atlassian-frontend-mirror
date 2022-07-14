import { extractDateUpdated } from '../extractDateUpdated';
import { LinkTypeCreated } from '../extractDateCreated';
import { TEST_BASE_DATA } from '../../__mocks__/jsonld';

describe('extractors.date.updated', () => {
  it('returns undefined if not present', () => {
    expect(extractDateUpdated(TEST_BASE_DATA as LinkTypeCreated)).toBe(
      undefined,
    );
  });

  it('returns date if present', () => {
    expect(
      extractDateUpdated({
        ...(TEST_BASE_DATA as LinkTypeCreated),
        updated: 'now',
      }),
    ).toBe('now');
  });
});
