import { EmojiProvider } from '../../api/EmojiResource';

export interface EmojiContext {
  emoji: {
    emojiProvider: EmojiProvider;
  };
}

export enum UploadStatus {
  Waiting,
  Uploading,
  Error,
}
