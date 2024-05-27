import { type Article } from '../model/Article';

export enum RESPONSE_TYPE {
  ALGOLIA = 'ALGOLIA',
}

export const createArticleObject = (
  styles: any,
  content: any,
  responseType = RESPONSE_TYPE.ALGOLIA,
): Article => {
  const bodyObject = content.body;
  const stylesObject = styles.body;
  const body = `<div class="content-platform-support">${stylesObject} ${bodyObject}</div>`;

  return { ...content, body };
};
