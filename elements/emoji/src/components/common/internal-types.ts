import type { EmojiProvider } from '../../api/EmojiResource';

export interface EmojiContext {
  emoji: {
    emojiProvider: EmojiProvider;
  };
}

interface FocusIndexes {
  rowIndex: number;
  columnIndex: number;
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
