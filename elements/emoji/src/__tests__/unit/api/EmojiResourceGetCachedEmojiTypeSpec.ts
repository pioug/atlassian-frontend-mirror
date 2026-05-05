import 'es6-promise/auto';

import fetchMock from 'fetch-mock/cjs/client';
import type { EmojiId } from '../../../types';
import EmojiResource, { type EmojiResourceConfig } from '../../../api/EmojiResource';
import { standardServiceEmojis, thumbsupEmoji } from '../_test-data';

const p1Url = 'https://p1/standard';

const defaultConfig: EmojiResourceConfig = {
	providers: [{ url: p1Url }],
};

describe('EmojiResource.getCachedEmojiType', () => {
	beforeEach(() => {
		fetchMock.mock({
			matcher: `begin:${p1Url}`,
			response: standardServiceEmojis,
		});
	});

	afterEach(() => {
		fetchMock.restore();
	});

	it('returns undefined when no repository has been initialised (before any fetch)', () => {
		const resource = new EmojiResource(defaultConfig);
		const emojiId: EmojiId = {
			id: thumbsupEmoji.id,
			shortName: thumbsupEmoji.shortName,
		};
		// No emojis loaded yet — repository is not initialised
		expect(resource.getCachedEmojiType(emojiId)).toBeUndefined();
	});

	it('returns the type for a cached emoji after the repository is loaded', async () => {
		const resource = new EmojiResource(defaultConfig);
		await resource.fetchEmojiProvider();

		const emojiId: EmojiId = {
			id: thumbsupEmoji.id,
			shortName: thumbsupEmoji.shortName,
		};
		const type = resource.getCachedEmojiType(emojiId);
		expect(typeof type).toBe('string');
		expect(type).toBeTruthy();
	});

	it('returns undefined for an emoji id that does not exist in the cache', async () => {
		const resource = new EmojiResource(defaultConfig);
		await resource.fetchEmojiProvider();

		const emojiId: EmojiId = {
			id: 'nonexistent-id-12345',
			shortName: ':nonexistent:',
		};
		expect(resource.getCachedEmojiType(emojiId)).toBeUndefined();
	});

	it('returns undefined when emojiId has no id and no shortName match', async () => {
		const resource = new EmojiResource(defaultConfig);
		await resource.fetchEmojiProvider();

		const emojiId: EmojiId = {
			id: undefined,
			shortName: ':totally-unknown-shortname-xyz:',
		};
		expect(resource.getCachedEmojiType(emojiId)).toBeUndefined();
	});
});
