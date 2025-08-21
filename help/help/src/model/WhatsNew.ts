import { type BODY_FORMAT_TYPES } from '@atlaskit/help-article';
import type { AdfDoc } from '@atlaskit/help-article';

export enum WHATS_NEW_ITEM_TYPES {
	NEW_FEATURE = 'Announcement',
	IMPROVEMENT = 'Improvement',
	FIX = 'Fix',
	REMOVED = 'Removed',
	EXPERIMENT = 'Experiment',
}
export interface WhatsNewArticle extends WhatsNewArticleItem {
	bodyFormat?: BODY_FORMAT_TYPES;
	description: string | AdfDoc;
}

export interface WhatsNewArticleItem {
	changeTargetSchedule?: string;
	communityUrl?: string;
	featureRolloutDate?: string;
	href?: string;
	id: string;
	relatedExternalLinks?: string;
	status?: string;
	title?: string;
	type?: WHATS_NEW_ITEM_TYPES;
}

export interface whatsNewSearchResult {
	articles: WhatsNewArticleItem[];
	hasNextPage: boolean;
	nextPage: string;
}
