import type {
  EmojiProvider,
  EmojiDescription,
  EmojiResourceConfig,
} from '@atlaskit/emoji';

export interface EmojiPluginOptions {
  headless?: boolean;
}

export type EmojiPluginState = {
  emojiProvider?: EmojiProvider;
  emojiResourceConfig?: EmojiResourceConfig;
  asciiMap?: Map<string, EmojiDescription>;
};
