export enum BODY_FORMAT_TYPES {
  adf = 'adf',
  html = 'html',
}

export type AdfDoc = {
  type: string;
  version: number;
  content: { [fieldName: string]: any }[];
};

export type HelpArticle = {
  // Article Title
  title?: string;
  // Article Content
  body?: string | AdfDoc;
  // Format of the body content. The defaut value is "html"
  bodyFormat?: BODY_FORMAT_TYPES;
  // URL used as href value of the Article Title. If is undefined, the title will a regular H2 tag instead of a link
  titleLinkUrl?: string;
  // Function executed when the article rendering begins
  onArticleRenderBegin?(): void;
  // Function executed when the article rendering finishes
  onArticleRenderDone?(): void;
};
