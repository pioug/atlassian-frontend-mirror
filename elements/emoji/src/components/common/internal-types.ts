import type { EmojiProvider } from '../../api/EmojiResource';

export interface EmojiContext {
	emoji: {
		emojiProvider: EmojiProvider;
	};
}

interface FocusIndexes {
	columnIndex: number;
	rowIndex: number;
}

export interface EmojiPickerListContextType {
	currentEmojisFocus: FocusIndexes;
	setEmojisFocus: (indexes: FocusIndexes) => void;
}

export enum UploadStatus {
	Waiting,
	Uploading,
	Error,
}
