import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { EmojiDescription } from '../types';

/**
 * Emoji ids that should never be shown in the picker for a given emoji type.
 * They remain resolvable (e.g. for rendering existing content), but are not offered for selection.
 */
const PICKER_EXCLUDED_EMOJI_IDS_BY_TYPE: Record<string, ReadonlyArray<string>> = {
	ATLASSIAN: ['atlassian-middle_finger'],
};

const isPickerExcludedEmoji = (emoji: EmojiDescription): boolean =>
	!!emoji.id && !!PICKER_EXCLUDED_EMOJI_IDS_BY_TYPE[emoji.type]?.includes(emoji.id);

type EmojiDescriptionWithHiddenMetadata = EmojiDescription & {
	hidden?: boolean;
	metadata?:
		| string
		| string[]
		| {
				tags?: string[];
		  };
	tags?: string[];
};

const hasHiddenTag = (tags?: string[]) => tags?.includes('hidden') ?? false;

const hasHiddenMetadataTag = (emoji: EmojiDescription): boolean => {
	const emojiWithMetadata = emoji as EmojiDescriptionWithHiddenMetadata;
	const { metadata } = emojiWithMetadata;

	if (typeof metadata === 'string') {
		return metadata === 'hidden';
	}

	if (Array.isArray(metadata)) {
		return hasHiddenTag(metadata);
	}

	return hasHiddenTag(metadata?.tags) || hasHiddenTag(emojiWithMetadata.tags);
};

export const isHiddenEmoji = (emoji: EmojiDescription): boolean => {
	const emojiWithMetadata = emoji as EmojiDescriptionWithHiddenMetadata;

	if (emojiWithMetadata.hidden) {
		return true;
	}

	if (fg('platform_teamoji_relentless_suffering') && isPickerExcludedEmoji(emoji)) {
		return true;
	}

	return hasHiddenMetadataTag(emoji);
};
