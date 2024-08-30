import React from 'react';

import {
	Emoji as AtlaskitEmoji,
	defaultEmojiHeight,
	type EmojiDescription,
	EmojiPlaceholder,
} from '@atlaskit/emoji';

export type SimpleEmojiProps = { emojiDescription: EmojiDescription };
export function SimpleEmoji({ emojiDescription }: { emojiDescription: EmojiDescription }) {
	return (
		<AtlaskitEmoji
			emoji={emojiDescription}
			autoWidth={false}
			editorEmoji={true}
			fitToHeight={defaultEmojiHeight}
		/>
	);
}

export type SimpleEmojiPlaceholderProps = { shortName: string };
export function SimpleEmojiPlaceholder({ shortName }: { shortName: string }) {
	return (
		<EmojiPlaceholder shortName={shortName} showTooltip={false} size={defaultEmojiHeight} loading />
	);
}
