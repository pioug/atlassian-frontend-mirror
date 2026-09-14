/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { EmojiPickerInternal } from './EmojiPickerInternal';
import { emojiPickerLoader } from './emojiPickerLoader';

export const preloadEmojiPicker = (): void => {
	emojiPickerLoader().then((component) => {
		EmojiPickerInternal.AsyncLoadedComponent = component;
	});
};
