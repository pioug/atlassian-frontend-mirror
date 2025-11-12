// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export { default as Emoji } from '../ui/Emoji';
export type { EmojiProps } from '../ui/Emoji';
export { EmojiSharedCssClassName } from '../styles/shared/emoji';
export { messages } from './messages';
export {
	defaultEmojiHeight,
	defaultDenseEmojiHeight,
	scaledEmojiHeightH1,
	scaledEmojiHeightH2,
	scaledEmojiHeightH3,
	scaledEmojiHeightH4,
	denseEmojiHeightH1,
	denseEmojiHeightH2,
	denseEmojiHeightH3,
	denseEmojiHeightH4,
} from '@atlaskit/emoji';
