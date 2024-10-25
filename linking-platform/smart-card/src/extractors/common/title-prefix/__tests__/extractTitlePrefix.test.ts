import {
	TEST_DATA_WITH_EMOJI,
	TEST_DATA_WITH_NO_PREFIX,
	TEST_EMOJI_SANITIZED,
} from '../../__mocks__/jsonld';
import { extractTitlePrefix } from '../extractTitlePrefix';

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
