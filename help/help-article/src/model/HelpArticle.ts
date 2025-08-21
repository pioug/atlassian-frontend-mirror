export enum BODY_FORMAT_TYPES {
	adf = 'adf',
	html = 'html',
}

export type AdfDoc = {
	content: { [fieldName: string]: any }[];
	type: string;
	version: number;
};

export type HelpArticle = {
	// Article Content
	body?: string | AdfDoc;
	// Format of the body content. The defaut value is "html"
	bodyFormat?: BODY_FORMAT_TYPES;
	// Function executed when the article rendering begins
	onArticleRenderBegin?(): void;
	// Function executed when the article rendering finishes
	onArticleRenderDone?(): void;
	// Article Title
	title?: string;
	// URL used as href value of the Article Title. If is undefined, the title will a regular H2 tag instead of a link
	titleLinkUrl?: string;
};
