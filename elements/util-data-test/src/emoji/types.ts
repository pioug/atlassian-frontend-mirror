import type {
  EmojiUpload,
  EmojiDescription,
  User,
} from '@atlaskit/emoji/types';

export interface PromiseBuilder<R> {
  (result: R, context: string): Promise<R>;
}

export interface UploadDetail {
  upload: EmojiUpload;
  emoji: EmojiDescription;
}

export interface MockEmojiResourceConfig {
  promiseBuilder?: PromiseBuilder<any>;
  uploadSupported?: boolean;
  uploadError?: string;
  optimisticRendering?: boolean;
  currentUser?: User;
}
