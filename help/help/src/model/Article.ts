import { type BODY_FORMAT_TYPES } from '@atlaskit/help-article';
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
	contentAri?: string;
	description?: string;
	href?: string;
	id: string;
	lastPublished: string;
	productName?: string;
	routes?: {
		routeGroup: string;
		routeName: string;
	}[];
	source?: string;
	title: string;
	topicId?: string;
	trustFactors?: {
		helpfulCount?: number;
		numViews?: number;
	};
	type: ARTICLE_ITEM_TYPES;
}

export interface ArticleFeedback {
	contactMe: boolean;
	feedbackReason: string;
	feedbackReasonText: string;
	wasHelpful: boolean;
}
