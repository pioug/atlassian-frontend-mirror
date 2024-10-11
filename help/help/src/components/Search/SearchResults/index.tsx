import React, { useCallback } from 'react';
import { Transition } from 'react-transition-group';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { REQUEST_STATE } from '../../../model/Requests';
import { type ArticleItem } from '../../../model/Article';

import {
	FADEIN_OVERLAY_TRANSITION_DURATION_MS,
	type TransitionStatus,
	VIEW,
} from '../../constants';
import { useSearchContext } from '../../contexts/searchContext';
import { useNavigationContext } from '../../contexts/navigationContext';
import { ARTICLE_TYPE } from '../../../model/Help';

import SearchResultsList from './SearchResults';
import SearchExternalSite from './SearchExternalSite';
import SearchResultsEmpty from './SearchResultsEmpty';
import SearchResultsError from './SearchResultsError';
import { SearchResultsContainer } from './styled';

const defaultStyle: Partial<React.CSSProperties> = {
	transition: `opacity ${FADEIN_OVERLAY_TRANSITION_DURATION_MS}ms`,
	opacity: 0,
	visibility: 'hidden',
};

const transitionStyles: { [id: string]: React.CSSProperties } = {
	entering: { opacity: 1, visibility: 'visible' },
	entered: { opacity: 1, visibility: 'visible' },
	exiting: { opacity: 0, visibility: 'visible' },
	exited: { opacity: 0, visibility: 'hidden' },
};

export const SearchResults = () => {
	const {
		searchState,
		searchResult,
		searchExternalUrl,
		isSearchResultVisible,
		onSearch,
		onSearchResultItemClick,
		onSearchExternalUrlClick,
		openExternalSearchUrlInNewTab,
	} = useSearchContext();
	const { openArticle, view } = useNavigationContext();

	const handleOnSearchResultItemClick = useCallback(
		(
			event: React.MouseEvent<HTMLElement, MouseEvent>,
			analyticsEvent: UIAnalyticsEvent,
			articleData: ArticleItem,
		): void => {
			if (!openExternalSearchUrlInNewTab || articleData.href == null) {
				openArticle({
					id: articleData.id,
					type: ARTICLE_TYPE.HELP_ARTICLE,
					contentAri: articleData.contentAri,
				});
			} else {
				window.open(articleData.href, '_blank');
			}

			onSearchResultItemClick(event, analyticsEvent, articleData);
		},
		[onSearchResultItemClick, openArticle, openExternalSearchUrlInNewTab],
	);

	return (
		<Transition
			in={view === VIEW.SEARCH && isSearchResultVisible}
			timeout={FADEIN_OVERLAY_TRANSITION_DURATION_MS}
		>
			{(state: TransitionStatus) => (
				<SearchResultsContainer
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						...defaultStyle,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						...transitionStyles[state],
					}}
				>
					{searchState !== REQUEST_STATE.error &&
						searchResult !== null &&
						searchResult.length > 0 &&
						state !== 'exited' && (
							<>
								<SearchResultsList
									searchResult={searchResult}
									onSearchResultItemClick={handleOnSearchResultItemClick}
								/>
								<SearchExternalSite
									searchExternalUrl={searchExternalUrl}
									onSearchExternalUrlClick={onSearchExternalUrlClick}
								/>
							</>
						)}

					{searchState !== REQUEST_STATE.error &&
						searchResult !== null &&
						searchResult.length === 0 && (
							<SearchResultsEmpty
								searchExternalUrl={searchExternalUrl}
								onSearchExternalUrlClick={onSearchExternalUrlClick}
							/>
						)}

					{searchState === REQUEST_STATE.error && <SearchResultsError onSearch={onSearch} />}
				</SearchResultsContainer>
			)}
		</Transition>
	);
};

export default SearchResults;
