import { Article, ArticleItem, ArticleFeedback } from './Article';
import { REQUEST_STATE } from './Requests';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

export interface HistoryItem {
  uid: number;
  id: string;
  state: REQUEST_STATE;
  article?: Article;
}

export interface Help {
  // Id of the article to display. This prop is optional, if is not defined the default content will be displayed
  articleId?: string;
  // Setter for the articleId. This prop is optional, if is not defined, the back button will not be visible
  articleIdSetter?(id: string): void;
  // Function used to get an article content. This prop is optional, if is not defined the default content will be displayed
  onGetArticle?(id: string): Promise<Article>;
  // History. This prop is optional
  history?: HistoryItem[];
  // Setter for the history. This prop is optional
  historySetter?(history: HistoryItem[]): void;
  // Event handler fired when the user clicks the "Try Again" button (in the article loading fail screen)
  onArticleLoadingFailTryAgainButtonClick?(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    articleId: string,
  ): void;
  // Function used to get related articles. This prop is optional, if is not defined the related articles will not be displayed
  onGetRelatedArticleOfOpenArticle?(
    routeGroup?: string,
    routeName?: string,
  ): Promise<ArticleItem[]>;
  // Function executed when the user click a related article item
  onRelatedArticlesListItemClick?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    articleData: ArticleItem,
  ) => void;
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
  // External search site URL
  searchExternalUrl?: string;
  // Event handler for the External search site Click. This prop is optional
  onSearchExternalUrlClick?(
    event?: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent?: UIAnalyticsEvent,
  ): void;
  // Event handler for the close button. This prop is optional, if this function is not defined the close button will not be displayed
  onCloseButtonClick?(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
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
  // Event handler for the "Back" button. This prop is optional
  onBackButtonClick?(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ): void;
  // Function executed when the article rendering begins
  onArticleRenderBegin?(): void;
  // Function executed when the article rendering finishes
  onArticleRenderDone?(): void;
  // Footer content. This prop is optional
  footer?: React.ReactNode;
  // Wrapped content
  children?: React.ReactNode;
}
