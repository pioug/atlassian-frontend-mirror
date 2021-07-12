import { ArticleItem } from '../../../model/Article';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

export interface ArticlesList {
  // Style. This component has two different styles (primary and secondary)
  style?: 'primary' | 'secondary';
  /* List of articles. This prop is optional */
  articles?: ArticleItem[] | null;
  /* Minimun number of articles to display. This prop is optional (Default value = 3) */
  minItemsToDisplay?: number;
  /* Minimun number of articles to display. This prop is optional (Default value = number of articles)*/
  maxItemsToDisplay?: number;
  /* Function executed when the user clicks one of the articles */
  onArticlesListItemClick?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    articleData: ArticleItem,
  ) => void;
  /* function executed when the user clicks "Show More" */
  onToggleArticlesList?: (
    event: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
    isCollapsed: boolean,
  ) => void;
}
