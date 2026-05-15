import { emojiImage, emojiNode, emojiPlaceholder, emojiSprite } from '@atlaskit/emoji';

// Constant variables here has been inlined in css from EditorContentContainer, if you need to make
// update here, please also update packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
export const EmojiSharedCssClassName: {
	EMOJI_CONTAINER: string;
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	EMOJI_IMAGE: string;
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	EMOJI_NODE: string;
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	EMOJI_PLACEHOLDER: string;
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	EMOJI_SPRITE: string;
} = {
	EMOJI_CONTAINER: 'emojiView-content-wrap',
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	EMOJI_NODE: emojiNode,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	EMOJI_SPRITE: emojiSprite,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	EMOJI_IMAGE: emojiImage,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	EMOJI_PLACEHOLDER: emojiPlaceholder,
};
