import { BODY_FORMAT_TYPES } from '@atlaskit/help-article';
import type { AdfDoc } from '@atlaskit/help-article';
export interface Article extends ArticleItem {
  body: string | AdfDoc;
  bodyFormat?: BODY_FORMAT_TYPES;
  relatedArticles?: ArticleItem[];
}

// TODO - Check if we need to delete this
export enum ARTICLE_ITEM_TYPES {
  topicInProduct = 'topicInProduct',
}
export interface ArticleItem {
  description?: string;
  id: string;
  lastPublished: string;
  title: string;
  type: ARTICLE_ITEM_TYPES;
  routeName: string;
  routeGroup: string;
  topicId?: string;
  productName?: string;
  href?: string;
}

export interface ArticleFeedback {
  wasHelpful: boolean;
  feedbackReason: string;
  feedbackReasonText: string;
  contactMe: boolean;
}
