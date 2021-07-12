import React from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import ArticlesList from '../../ArticlesList';
import { ArticleItem } from '../../../model/Article';

export interface Props {
  searchResult?: ArticleItem[] | null;
  onSearchResultItemClick(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    articleData: ArticleItem,
  ): void;
}

export const SearchResults: React.FC<Props> = ({
  searchResult = [],
  onSearchResultItemClick,
}) => (
  <ArticlesList
    minItemsToDisplay={100}
    maxItemsToDisplay={100}
    articles={searchResult}
    onArticlesListItemClick={onSearchResultItemClick}
  />
);

export default SearchResults;
