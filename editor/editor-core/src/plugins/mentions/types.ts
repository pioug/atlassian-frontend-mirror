import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { MentionDescription, MentionProvider } from '@atlaskit/mention';
import { TeamMentionProvider } from '@atlaskit/mention/resource';
import { ContextIdentifierProvider } from '@atlaskit/editor-common';

export interface TeamInfoAttrAnalytics {
  teamId: String;
  includesYou: boolean;
  memberCount: number;
}

export interface MentionPluginOptions {
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  sanitizePrivateContent?: boolean;
  mentionInsertDisplayName?: boolean;
  useInlineWrapper?: boolean;
  allowZeroWidthSpaceAfter?: boolean;
}

export type MentionPluginState = {
  mentionProvider?: MentionProvider | TeamMentionProvider;
  contextIdentifierProvider?: ContextIdentifierProvider;
  mentions?: Array<MentionDescription>;
};
