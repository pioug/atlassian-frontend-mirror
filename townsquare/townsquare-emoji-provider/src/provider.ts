import { EmojiResource, type EmojiResourceConfig } from '@atlaskit/emoji/resource';

import { withSelectedToneEmitter } from './withSelectedToneEmitter';

const EMOJI_URL = '/gateway/api/emoji';

const DEFAULT_EMOJI_CONFIG: EmojiResourceConfig = {
	providers: [{ url: `${EMOJI_URL}/standard` }],
};

export const emojiResource = new EmojiResource(DEFAULT_EMOJI_CONFIG);
export const emojiProvider = withSelectedToneEmitter(emojiResource.getEmojiProvider());

const resources = new Map<string, EmojiResource>();

export const getEmojiProviderForCloudId = (
	cloudId: string,
	userId: string,
	disableUpload?: boolean,
) => {
	const resourceKey = `${cloudId}::${userId}::${disableUpload ? 'no-upload' : 'with-upload'}`;

	let resource = resources.get(resourceKey);
	if (resource) {
		return withSelectedToneEmitter(resource.getEmojiProvider());
	}

	const emojiConfig: EmojiResourceConfig = {
		providers: [
			...DEFAULT_EMOJI_CONFIG.providers,
			{
				url: `${EMOJI_URL}/atlassian`,
			},
			{
				url: `${EMOJI_URL}/${cloudId}/site`,
			},
		],
		allowUpload: disableUpload ? false : true,
		currentUser: {
			id: userId,
		},
	};

	resource = new EmojiResource(emojiConfig);
	resources.set(resourceKey, resource);
	return withSelectedToneEmitter(resource.getEmojiProvider());
};
