import {
	emojiPickerListHeight,
	emojiPickerListHeightNew,
	emojiPickerWidth,
} from '../../util/constants';

export const sizes: {
	addEmojiHeight: number;
	categoryHeadingHeight: number;
	emojiPerRow: number;
	emojiRowHeight: number;
	listHeight: number;
	listHeightNew: number;
	listWidth: number;
	loadingRowHeight: number;
	noResultsHeight: number;
	searchHeight: number;
	uploadActionHeight: number;
} = {
	listHeight: emojiPickerListHeight,
	listHeightNew: emojiPickerListHeightNew,
	listWidth: emojiPickerWidth,
	searchHeight: 52, // 32px height + 10px padding top/bottom
	categoryHeadingHeight: 30, // 20px height + 5px padding top/bottom
	emojiRowHeight: 40, // 32px button height + 4px padding top/bottom
	addEmojiHeight: 32, // 32px height
	loadingRowHeight: 150, // Fills remaining space without scrolling when loading.
	noResultsHeight: 300, // illustration (200px) + button + padding + gap
	uploadActionHeight: 40, // 40px height
	emojiPerRow: 8,
};
