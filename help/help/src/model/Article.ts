export interface Article extends ArticleItem {
  body: string;
  relatedArticles?: ArticleItem[];
}

export enum ARTICLE_ITEM_TYPES {
  topicInProduct = 'topicInProduct',
  whatsNew = 'whatsNew',
  helpArticle = 'helpArticle',
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
