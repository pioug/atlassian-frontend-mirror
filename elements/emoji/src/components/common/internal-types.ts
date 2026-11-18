import type { EmojiProvider } from '../../api/EmojiResource';
import type { GetAICreditStatus } from '../../credit-check';

export interface EmojiContext {
	emoji: {
		emojiProvider: EmojiProvider;
		getAICreditStatus?: GetAICreditStatus;
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
