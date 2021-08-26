import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EmojiProvider, EmojiDescription } from '@atlaskit/emoji';

export interface EmojiPluginOptions {
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  allowZeroWidthSpaceAfter?: boolean;
  useInlineWrapper?: boolean;
  headless?: boolean;
}

export type EmojiPluginState = {
  emojiProvider?: EmojiProvider;
  asciiMap?: Map<string, EmojiDescription>;
};
