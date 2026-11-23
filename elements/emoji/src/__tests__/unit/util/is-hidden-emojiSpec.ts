import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import type { EmojiDescription } from '../../../types';
import { filterHiddenEmojis } from '../../../util/filter-hidden-emojis';
import { isHiddenEmoji } from '../../../util/is-hidden-emoji';

const createEmoji = (overrides: Partial<EmojiDescription>): EmojiDescription => ({
	id: 'some-id',
	shortName: ':some_emoji:',
	name: 'Some emoji',
	type: 'STANDARD',
	category: 'PEOPLE',
	searchable: true,
	representation: {
		imagePath: 'https://example.com/emoji.png',
		width: 24,
		height: 24,
	},
	...overrides,
});

const atlassianMiddleFinger = createEmoji({
	id: 'atlassian-middle_finger',
	shortName: ':middle_finger:',
	name: 'Middle finger',
	type: 'ATLASSIAN',
	category: 'ATLASSIAN',
});

describe('isHiddenEmoji', () => {
	describe('when platform_teamoji_relentless_suffering is enabled', () => {
		beforeEach(() => {
			passGate('platform_teamoji_relentless_suffering');
		});

		it('hides the ATLASSIAN emoji with id atlassian-middle_finger', () => {
			expect(isHiddenEmoji(atlassianMiddleFinger)).toBe(true);
		});

		it('does not hide an emoji with the same id from a different type', () => {
			expect(isHiddenEmoji({ ...atlassianMiddleFinger, type: 'SITE' })).toBe(false);
		});

		it('does not hide other ATLASSIAN emojis', () => {
			expect(
				isHiddenEmoji({ ...atlassianMiddleFinger, id: 'atlassian-thumbs_up', shortName: ':x:' }),
			).toBe(false);
		});

		it('removes the emoji when filtering a list', () => {
			const other = createEmoji({ id: 'atlassian-yes', type: 'ATLASSIAN' });
			expect(filterHiddenEmojis([atlassianMiddleFinger, other])).toEqual([other]);
		});
	});

	describe('when platform_teamoji_relentless_suffering is disabled', () => {
		beforeEach(() => {
			failGate('platform_teamoji_relentless_suffering');
		});

		it('does not hide the ATLASSIAN emoji with id atlassian-middle_finger', () => {
			expect(isHiddenEmoji(atlassianMiddleFinger)).toBe(false);
		});
	});
});
