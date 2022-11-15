import { extractTitlePrefix } from '../extractTitlePrefix';
import {
  TEST_DATA_WITH_EMOJI,
  TEST_EMOJI_SANITIZED,
  TEST_DATA_WITH_NO_PREFIX,
} from '../../__mocks__/jsonld';

describe('extractors.title-prefix.extractTitlePrefix', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns nothing if there is no prefix', () => {
    expect(extractTitlePrefix(TEST_DATA_WITH_NO_PREFIX)).toBe(undefined);
  });

  it('returns emoji component', () => {
    expect(
      extractTitlePrefix(TEST_DATA_WITH_EMOJI, {
        emoji: (emojiId, _) => emojiId,
      }),
    ).toBe(TEST_EMOJI_SANITIZED);
  });
});
