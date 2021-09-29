import { ARTICLE_ITEM_TYPES, Article, ArticleItem } from '../../model/Article';
import {
  WHATS_NEW_ITEM_TYPES,
  WhatsNewArticleItem,
} from '../../model/WhatsNew';

// Help article data
export const getMockArticle = (
  id: string,
  routeName: string = '',
  routeGroup: string = '',
  productName: string = '',
  href: string = '',
): Article => {
  return {
    description: 'mockArticle description',
    id,
    lastPublished: '2020-04-29T06:05:02.426Z',
    title: 'mockArticle title',
    type: ARTICLE_ITEM_TYPES.topicInProduct,
    routeName,
    routeGroup,
    topicId: 'mock-topic',
    productName,
    href,
    body: 'mockArticle body',
    relatedArticles: getMockArticleItemList(10),
  };
};

export const getMockArticleItem = (
  id: string,
  routeName: string = '',
  routeGroup: string = '',
  productName: string = '',
  href: string = '',
): ArticleItem => {
  return {
    description: 'mockArticle description',
    id,
    lastPublished: '2020-04-29T06:05:02.426Z',
    title: 'mockArticle title',
    type: ARTICLE_ITEM_TYPES.topicInProduct,
    routeName,
    routeGroup,
    topicId: 'mock-topic',
    productName,
    href,
  };
};

export const getMockArticleItemList = (
  numberOfItems: number,
): ArticleItem[] => {
  const articleItemList = [];
  for (var i = 0; i < numberOfItems; i++) {
    articleItemList.push(getMockArticleItem(i.toString()));
  }

  return articleItemList;
};

// What's New article data
export const getMockWhatsNewArticle = (
  id: string,
  routeName: string = '',
  routeGroup: string = '',
  productName: string = '',
  href: string = '',
): Article => {
  return {
    description: 'mock article description',
    id,
    lastPublished: '2020-04-29T06:05:02.426Z',
    title: 'mock article title',
    type: ARTICLE_ITEM_TYPES.topicInProduct,
    routeName,
    routeGroup,
    topicId: 'mock-topic',
    productName,
    href,
    body: 'mockArticle body',
    relatedArticles: getMockArticleItemList(10),
  };
};

export const getMockWhatsNewArticleItem = (
  id: string,
  type?: WHATS_NEW_ITEM_TYPES,
  title: string = `Mock What's New article title`,
  description: string = '',
  changeTargetSchedule: string = '',
  status: string = '',
  featureRolloutDate: string = '01-01-2022',
  href: string = '',
): WhatsNewArticleItem => {
  return {
    title,
    changeTargetSchedule,
    type,
    status,
    href,
    featureRolloutDate,
    id,
  };
};

export const getMockWhatsNewArticleItemList = (
  numberOfItems: number,
): WhatsNewArticleItem[] => {
  const articleItemList = [];
  for (var i = 0; i < numberOfItems; i++) {
    articleItemList.push(getMockWhatsNewArticleItem(i.toString()));
  }

  return articleItemList;
};
