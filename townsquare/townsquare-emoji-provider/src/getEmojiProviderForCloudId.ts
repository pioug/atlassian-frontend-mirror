import EmojiResource, {
	type EmojiProvider,
	type EmojiResourceConfig,
} from '@atlaskit/emoji/emoji-resource';

import { resources } from './resources';
import { withSelectedToneEmitter } from './withSelectedToneEmitter';

const EMOJI_URL = '/gateway/api/emoji';

/**
 * Returns an emoji provider that can resolve the standard, Atlassian and site-specific (custom)
 * emoji sets for the given cloudId. Resources are created lazily on first call and cached per
 * cloudId, user and upload mode.
 */
export const getEmojiProviderForCloudId = (
	cloudId: string,
	userId: string,
	disableUpload?: boolean,
): Promise<EmojiProvider> => {
	const resourceKey = `${cloudId}::${userId}::${disableUpload ? 'no-upload' : 'with-upload'}`;

	let resource = resources.get(resourceKey);
	if (resource) {
		return withSelectedToneEmitter(resource.getEmojiProvider());
	}

	const emojiConfig: EmojiResourceConfig = {
		providers: [
			{
				url: `${EMOJI_URL}/standard`,
			},
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
