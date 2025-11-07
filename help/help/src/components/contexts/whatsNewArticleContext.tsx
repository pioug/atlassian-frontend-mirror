import React, { useState, useCallback, type PropsWithChildren } from 'react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type NotificationLogProvider } from '@atlaskit/notification-log-client';

import {
	type WhatsNewArticleItem,
	type WhatsNewArticle,
	type whatsNewSearchResult,
} from '../../model/WhatsNew';
import { REQUEST_STATE } from '../../model/Requests';
import { type articleId } from '../../model/Help';
import { type WHATS_NEW_ITEM_TYPES } from '../../model/WhatsNew';
import { createCtx } from '../../util/hooks/ctx';

import { NUMBER_OF_WHATS_NEW_ITEMS_PER_PAGE } from '../constants';

interface WhatsNewArticleSharedInterface {
	// Function used to get a What article content. This prop is optional, if is not defined the "What's new" feature will be hidden
	onGetWhatsNewArticle?(id: articleId): Promise<WhatsNewArticle>;
	// Function executed when the user clicks the "show more" button of the "What's new" list. This prop is optional
	onSearchWhatsNewArticlesShowMoreClick?(
		event: React.MouseEvent<HTMLElement>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
	// Event handler fired when the user clicks the "What's new" button. This prop is optional
	onWhatsNewButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
	// Event handler fired when the user clicks an Item in the "What's new" result list. This prop is optional
	onWhatsNewResultItemClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
		whatsNewArticleData: WhatsNewArticleItem,
	): void;
	// Product name used in the label of the "What's new" button. This prop is optional, if is not defined the "What's new" button label will not include the product name
	productName?: string;
	// "What's New" notification provider. This prop is optional, if is not defined the "What's new" notification icon will be hidden
	whatsNewGetNotificationProvider?: Promise<NotificationLogProvider>;
}

interface WhatsNewArticleContextInterface extends WhatsNewArticleSharedInterface {
	// Function used to search "What's New" articles. This prop is optional, if is not defined the "What's new" feature will be hidden
	onSearchWhatsNewArticles?(
		filter?: WHATS_NEW_ITEM_TYPES | '',
		numberOfItems?: number,
		page?: string,
	): Promise<void>;
	searchWhatsNewArticlesResult: whatsNewSearchResult | null;
	searchWhatsNewArticlesState: REQUEST_STATE;
}

interface WhatsNewArticleProviderInterface extends WhatsNewArticleSharedInterface {
	// Function used to search "What's New" articles. This prop is optional, if is not defined the "What's new" feature will be hidden
	onSearchWhatsNewArticles?(
		filter?: WHATS_NEW_ITEM_TYPES | '',
		numberOfItems?: number,
		page?: string,
	): Promise<whatsNewSearchResult>;
}

const dest = createCtx<WhatsNewArticleContextInterface>();
export const useWhatsNewArticleContext: () => WhatsNewArticleContextInterface = dest[0];
export const CtxProvider: React.Provider<WhatsNewArticleContextInterface | undefined> = dest[1];

export const WhatsNewArticleProvider = ({
	whatsNewGetNotificationProvider,
	onWhatsNewButtonClick,
	onSearchWhatsNewArticles,
	onSearchWhatsNewArticlesShowMoreClick,
	onWhatsNewResultItemClick,
	onGetWhatsNewArticle,
	productName,
	children,
}: PropsWithChildren<WhatsNewArticleProviderInterface>): React.JSX.Element => {
	// What's new
	const [whatsNewSearchType, setWhatsNewSearchType] = useState<
		WHATS_NEW_ITEM_TYPES | '' | undefined
	>(undefined);
	const [searchWhatsNewArticlesResult, setSearchWhatsNewArticlesResult] =
		useState<whatsNewSearchResult | null>(null);
	const [searchWhatsNewArticlesState, setSearchWhatsNewArticlesState] = useState<REQUEST_STATE>(
		REQUEST_STATE.done,
	);

	const searchWhatsNew = useCallback(
		async (
			filter: WHATS_NEW_ITEM_TYPES | '' = '',
			numberOfItems: number = NUMBER_OF_WHATS_NEW_ITEMS_PER_PAGE,
			page: string = '',
		) => {
			setWhatsNewSearchType(filter);
			if (onSearchWhatsNewArticles) {
				try {
					setSearchWhatsNewArticlesState(REQUEST_STATE.loading);
					// If the filter type hasn't change, then we are loading an extra page
					if (filter === whatsNewSearchType && page !== '') {
						const results = await onSearchWhatsNewArticles(filter, numberOfItems, page);
						setSearchWhatsNewArticlesResult({
							articles: [
								...(searchWhatsNewArticlesResult?.articles
									? searchWhatsNewArticlesResult.articles
									: []),
								...results.articles,
							],
							hasNextPage: results.hasNextPage,
							nextPage: results.nextPage,
						});
					} else {
						// new search
						setSearchWhatsNewArticlesResult(null);
						const results = await onSearchWhatsNewArticles(filter, numberOfItems, page);
						setSearchWhatsNewArticlesResult(results);
					}
					setSearchWhatsNewArticlesState(REQUEST_STATE.done);
				} catch (error) {
					setSearchWhatsNewArticlesResult(null);
					setSearchWhatsNewArticlesState(REQUEST_STATE.error);
				}
			} else {
				setSearchWhatsNewArticlesState(REQUEST_STATE.error);
			}
		},
		[onSearchWhatsNewArticles, whatsNewSearchType, searchWhatsNewArticlesResult],
	);

	return (
		<CtxProvider
			value={{
				whatsNewGetNotificationProvider,
				onWhatsNewButtonClick,
				onSearchWhatsNewArticlesShowMoreClick,
				onSearchWhatsNewArticles: searchWhatsNew,
				searchWhatsNewArticlesState,
				searchWhatsNewArticlesResult,
				onWhatsNewResultItemClick,
				onGetWhatsNewArticle,
				productName,
			}}
		>
			{children}
		</CtxProvider>
	);
};
