import React, { useState, useCallback, type PropsWithChildren } from 'react';
import debounce from 'lodash/debounce';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { type ArticleItem } from '../../model/Article';
import { REQUEST_STATE } from '../../model/Requests';
import { createCtx } from '../../util/hooks/ctx';

import { MIN_CHARACTERS_FOR_SEARCH } from '../constants';

interface SearchSharedInterface {
	onSearchExternalUrlClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
	onSearchInputChanged?(
		event: React.KeyboardEvent<HTMLInputElement>,
		analyticsEvent: UIAnalyticsEvent,
		value: string,
	): void;
	onSearchInputCleared?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
	openExternalSearchUrlInNewTab?: boolean;
	searchExternalUrl?: string;
	searchOnEnterKeyPress?: boolean;
}

export interface SearchContextInterface extends SearchSharedInterface {
	isSearchResultVisible: boolean;
	onSearch?(value?: string): void;
	onSearchResultItemClick(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
		articleData: ArticleItem,
	): void;
	searchResult: ArticleItem[] | null;
	searchState: REQUEST_STATE;
	searchValue: string;
}

export interface SearchProviderInterface extends SearchSharedInterface {
	onSearch?(value: string): Promise<ArticleItem[]>;
	onSearchResultItemClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
		articleData: ArticleItem,
	): void;
}

const dest = createCtx<SearchContextInterface>();
export const useSearchContext: () => SearchContextInterface = dest[0];
export const CtxProvider: React.Provider<SearchContextInterface | undefined> = dest[1];

export const SearchContextProvider = ({
	onSearch,
	onSearchInputChanged,
	onSearchInputCleared,
	onSearchResultItemClick,
	onSearchExternalUrlClick,
	searchExternalUrl,
	children,
	openExternalSearchUrlInNewTab,
	searchOnEnterKeyPress,
}: PropsWithChildren<SearchProviderInterface>): React.JSX.Element => {
	// Search
	const [searchValue, setSearchValue] = useState<string>('');
	const [searchResult, setSearchResult] = useState<ArticleItem[] | null>(null);
	const [searchState, setSearchState] = useState<REQUEST_STATE>(REQUEST_STATE.done);
	const [searchResultsVisible, setSearchResultsVisible] = useState<boolean>(false);

	const doSearch = useCallback(
		async (value: string = '') => {
			if (onSearch) {
				try {
					const results: ArticleItem[] = await onSearch(value);
					setSearchResult(results);
					setSearchState(REQUEST_STATE.done);
				} catch (error) {
					setSearchResult([]);
					setSearchState(REQUEST_STATE.error);
				}
			} else {
				setSearchState(REQUEST_STATE.error);
			}
		},
		[onSearch],
	);

	const debouncedDoSearch = debounce(doSearch, 500);

	const search =
		onSearch &&
		((newSearchValue: string) => {
			if (newSearchValue !== searchValue) {
				if (newSearchValue.length >= MIN_CHARACTERS_FOR_SEARCH && !searchOnEnterKeyPress) {
					try {
						setSearchState(REQUEST_STATE.loading);
						debouncedDoSearch(newSearchValue);
					} catch (error) {
						setSearchState(REQUEST_STATE.error);
						setSearchResult([]);
					}
					setSearchResultsVisible(true);
				} else if (newSearchValue.length === 0) {
					// If the search input is empty, the search results should be empty and
					setSearchState(REQUEST_STATE.done);
					setSearchResult(null);
					setSearchResultsVisible(false);
				}
				setSearchValue(newSearchValue);
			} else {
				setSearchState(REQUEST_STATE.loading);
				debouncedDoSearch(newSearchValue);
				setSearchResultsVisible(true);
			}
		});

	const searchResultItemClick = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
		articleData: ArticleItem,
	): void => {
		if (onSearchResultItemClick) {
			onSearchResultItemClick(event, analyticsEvent, articleData);
		}
	};

	return (
		<CtxProvider
			value={{
				onSearch: search,
				onSearchInputChanged,
				onSearchInputCleared,
				onSearchResultItemClick: searchResultItemClick,
				onSearchExternalUrlClick,
				isSearchResultVisible: searchResultsVisible,
				searchExternalUrl,
				searchResult,
				searchState,
				searchValue,
				openExternalSearchUrlInNewTab,
			}}
		>
			{children}
		</CtxProvider>
	);
};
