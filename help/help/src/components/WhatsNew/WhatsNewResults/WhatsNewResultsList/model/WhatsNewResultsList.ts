import { WhatsNewArticleItem } from '../../../../../model/WhatsNew';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

export interface WhatsNewResultsList {
  // Style. This component has two different styles (primary and secondary)
  style?: 'primary' | 'secondary';
  /* List of "What's New" items. This prop is optional */
  whatsNewArticles?: WhatsNewArticleItem[] | null;
  nextPage?: string;
  hasNextPage?: boolean;
  loadingMore?: boolean;
  onWhatsNewResultItemClick?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    articleData: WhatsNewArticleItem,
  ) => void;
  onShowMoreButtonClick?: (
    event: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
}
