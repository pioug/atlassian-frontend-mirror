import { type WhatsNewArticleItem } from '../../../../../model/WhatsNew';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

export interface WhatsNewResultsList {
	hasNextPage?: boolean;
	loadingMore?: boolean;
	nextPage?: string;
	onShowMoreButtonClick?: (
		event: React.MouseEvent<HTMLElement>,
		analyticsEvent: UIAnalyticsEvent,
	) => void;
	onWhatsNewResultItemClick?: (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
		articleData: WhatsNewArticleItem,
	) => void;
	// Style. This component has two different styles (primary and secondary)
	style?: 'primary' | 'secondary';
	/* List of "What's New" items. This prop is optional */
	whatsNewArticles?: WhatsNewArticleItem[] | null;
}
