import type { EmojiDescription } from '../types';

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

	return hasHiddenMetadataTag(emoji);
};

export const filterHiddenEmojis = <Emoji extends EmojiDescription>(emojis: Emoji[]): Emoji[] =>
	emojis.filter((emoji) => !isHiddenEmoji(emoji));
