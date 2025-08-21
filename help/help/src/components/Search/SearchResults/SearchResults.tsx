import React from 'react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';

import ArticlesList from '../../ArticlesList';
import { type ArticleItem } from '../../../model/Article';

export interface Props {
	onSearchResultItemClick(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
		articleData: ArticleItem,
	): void;
	searchResult?: ArticleItem[] | null;
}

export const SearchResults: React.FC<Props> = ({ searchResult = [], onSearchResultItemClick }) => (
	<ArticlesList
		minItemsToDisplay={100}
		maxItemsToDisplay={100}
		articles={searchResult}
		onArticlesListItemClick={onSearchResultItemClick}
	/>
);

export default SearchResults;
