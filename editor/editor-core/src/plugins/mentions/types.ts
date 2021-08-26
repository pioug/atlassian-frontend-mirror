import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { MentionDescription, MentionProvider } from '@atlaskit/mention';
import { TeamMentionProvider } from '@atlaskit/mention/resource';
import { ContextIdentifierProvider } from '@atlaskit/editor-common';
import { AnalyticsEventPayload } from '@atlaskit/analytics-next';

export interface TeamInfoAttrAnalytics {
  teamId: String;
  includesYou: boolean;
  memberCount: number;
}

export interface MentionPluginConfig {
  HighlightComponent?: React.ComponentType;
  // flag to indicate display name instead of nick name should be inserted for mentions
  // default: false, which inserts the nick name
  insertDisplayName?: boolean;
}

export interface MentionPluginOptions extends MentionPluginConfig {
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  sanitizePrivateContent?: boolean;
  useInlineWrapper?: boolean;
  allowZeroWidthSpaceAfter?: boolean;
}

export type MentionPluginState = {
  mentionProvider?: MentionProvider | TeamMentionProvider;
  contextIdentifierProvider?: ContextIdentifierProvider;
  mentions?: Array<MentionDescription>;
};

export type FireElementsChannelEvent = <T extends AnalyticsEventPayload>(
  payload: T,
) => void;
