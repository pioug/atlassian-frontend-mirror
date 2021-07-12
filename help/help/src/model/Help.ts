import { Article, ArticleItem, ArticleFeedback } from './Article';
import {
  WhatsNewArticleItem,
  WhatsNewArticle,
  WHATS_NEW_ITEM_TYPES,
  whatsNewSearchResult,
} from './WhatsNew';
import { REQUEST_STATE } from './Requests';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { NotificationLogProvider } from '@atlaskit/notification-log-client';
import type { Props as HelpContentButtonProps } from '../components/HelpContentButton';

export enum ARTICLE_TYPE {
  HELP_ARTICLE = 'HELP_ARTICLE',
  WHATS_NEW = 'WHATS_NEW',
}

export interface HistoryItem {
  uid: number;
  id: string;
  state: REQUEST_STATE;
  type: ARTICLE_TYPE;
  article?: Article | WhatsNewArticle;
}

export interface articleId {
  id: string;
  type: ARTICLE_TYPE;
}

export interface Help {
  header?: {
    // Event handler for the close button. This prop is optional, if this function is not defined the close button will not be displayed
    onCloseButtonClick?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void;
    // Event handler for the "Back" button. This prop is optional
    onBackButtonClick?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void;
  };
  // Footer content. This prop is optional
  footer?: React.ReactNode;

  home?: {
    // Array of options displayed in the home screen of the help component. This prop is optional,
    homeOptions?: HelpContentButtonProps[];
  };

  search?: {
    // Function used to search an article.  This prop is optional, if is not defined search input will be hidden
    onSearch?(value: string): Promise<ArticleItem[]>;
    // Event handler fired when the search input changes
    onSearchInputChanged?(
      event: React.KeyboardEvent<HTMLInputElement>,
      analyticsEvent: UIAnalyticsEvent,
      value: string,
    ): void;
    // Event handler fired when the search input changes
    onSearchInputCleared?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void;
    // Event handler fired when the user clicks an Item in the search result list. This prop is optional
    onSearchResultItemClick?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
      articleData: ArticleItem,
    ): void;
    // Event handler for the external search site link click. This prop is optional
    onSearchExternalUrlClick?(
      event?: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent?: UIAnalyticsEvent,
    ): void;
    // External search site URL
    searchExternalUrl?: string;
  };

  navigation?: {
    // ID of the article to display. This property is requiered (the articleId state is lifted up to the parent component)
    articleId?: articleId;
    // Setter for the articleId. This property is requiered (the articleId state is lifted up to the parent component)
    articleIdSetter?(id: articleId): void;
    // History. This prop is optional
    history?: HistoryItem[];
    // Setter for the history. This prop is optional
    historySetter?(history: HistoryItem[]): void;
  };

  helpArticle?: {
    // Function used to get an article content. This prop is optional, if is not defined the default content will be displayed
    onGetHelpArticle?(articleId: articleId): Promise<Article>;
    // Event handler fired when the user clicks the "Try Again" button in the article loading fail screen.
    onHelpArticleLoadingFailTryAgainButtonClick?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
      articleId: articleId,
    ): void;
    // Event handler for the "Was this helpful" submit button. This prop is optional, if is not defined the "Was this helpful" section will be hidden
    onWasHelpfulSubmit?(
      analyticsEvent: UIAnalyticsEvent,
      articleFeedback: ArticleFeedback,
      articleData: ArticleItem,
    ): Promise<boolean>;
    // Event handler for the "Yes" button of the "Was this helpful" section. This prop is optional
    onWasHelpfulYesButtonClick?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
      ArticleItem: ArticleItem,
    ): void;
    // Event handler for the "No" button of the "Was this helpful" section. This prop is optional
    onWasHelpfulNoButtonClick?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
      ArticleItem: ArticleItem,
    ): void;
  };

  relatedArticles?: {
    routeGroup?: string;
    routeName?: string;
    // Function used to get related articles. This prop is optional, if is not defined the related articles will not be displayed
    onGetRelatedArticles?(
      routeGroup?: string,
      routeName?: string,
    ): Promise<ArticleItem[]>;
    // Function executed when the user clicks the "show more" button of the related articles list. This prop is optional
    onRelatedArticlesShowMoreClick?(
      event: React.MouseEvent<HTMLElement>,
      analyticsEvent: UIAnalyticsEvent,
      isCollapsed: boolean,
    ): void;
    // Function executed when the user click a related article item
    onRelatedArticlesListItemClick?: (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
      articleData: ArticleItem,
    ) => void;
  };

  whatsNew?: {
    // "What's New" notification provider. This prop is optional, if is not defined the "What's new" notification icon will be hidden
    whatsNewGetNotificationProvider?: Promise<NotificationLogProvider>;
    // Event handler fired when the user clicks the "What's new" button. This prop is optional
    onWhatsNewButtonClick?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void;
    // Function used to search "What's New" articles. This prop is optional, if is not defined the "What's new" feature will be hidden
    onSearchWhatsNewArticles?(
      filter?: WHATS_NEW_ITEM_TYPES | '',
      numberOfItems?: number,
      page?: string,
    ): Promise<whatsNewSearchResult>;
    // Event handler fired when the user clicks an Item in the "What's new" result list. This prop is optional
    onWhatsNewResultItemClick?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
      whatsNewArticleData: WhatsNewArticleItem,
    ): void;
    // Function executed when the user clicks the "show more" button of the "What's new" list. This prop is optional
    onSearchWhatsNewShowMoreClick?(
      event: React.MouseEvent<HTMLElement>,
      analyticsEvent: UIAnalyticsEvent,
    ): void;
    // Function used to get a What article content. This prop is optional, if is not defined the "What's new" feature will be hidden
    onGetWhatsNewArticle?(id: articleId): Promise<WhatsNewArticle>;
  };
  // Home screen content
  children?: React.ReactNode;
}
