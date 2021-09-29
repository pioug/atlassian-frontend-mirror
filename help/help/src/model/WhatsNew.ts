import { BODY_FORMAT_TYPES } from '@atlaskit/help-article';
import type { AdfDoc } from '@atlaskit/help-article';

export enum WHATS_NEW_ITEM_TYPES {
  NEW_FEATURE = 'Announcement',
  IMPROVEMENT = 'Improvement',
  FIX = 'Fix',
  REMOVED = 'Removed',
  EXPERIMENT = 'Experiment',
}
export interface WhatsNewArticle extends WhatsNewArticleItem {
  description: string | AdfDoc;
  bodyFormat?: BODY_FORMAT_TYPES;
}

export interface WhatsNewArticleItem {
  title?: string;
  changeTargetSchedule?: string;
  type?: WHATS_NEW_ITEM_TYPES;
  status?: string;
  featureRolloutDate?: string;
  relatedExternalLinks?: string;
  communityUrl?: string;
  href?: string;
  id: string;
}

export interface whatsNewSearchResult {
  articles: WhatsNewArticleItem[];
  nextPage: string;
  hasNextPage: boolean;
}
