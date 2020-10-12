import { ARTICLE_ITEM_TYPES, Article, ArticleItem } from '../../model/Article';

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
