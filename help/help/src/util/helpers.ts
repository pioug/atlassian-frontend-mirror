import { Article } from '../model/Article';

export const createArticleObject = (algoliaResponse: any): Article => {
  const bodyObject = algoliaResponse.hits[0].body;
  const stylesObject = algoliaResponse.hits[1].body;
  const body = `<div class="content-platform-support">${stylesObject} ${bodyObject}</div>`;

  return { ...algoliaResponse.hits[0], body };
};
