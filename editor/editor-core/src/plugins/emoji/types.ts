import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EmojiDescription, EmojiProvider } from '@atlaskit/emoji';

export interface EmojiPluginOptions {
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  allowZeroWidthSpaceAfter?: boolean;
  useInlineWrapper?: boolean;
  headless?: boolean;
}

export type EmojiPluginState = {
  emojiProvider?: EmojiProvider;
  emojis?: Array<EmojiDescription>;
};
