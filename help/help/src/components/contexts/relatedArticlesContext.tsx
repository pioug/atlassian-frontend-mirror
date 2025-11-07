import React, { type PropsWithChildren } from 'react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { type ArticleItem } from '../../model/Article';
import { createCtx } from '../../util/hooks/ctx';

export interface RelatedArticlesContextInterface {
	onGetRelatedArticles?(routeGroup?: string, routeName?: string): Promise<ArticleItem[]>;
	onRelatedArticlesListItemClick?: (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
		articleData: ArticleItem,
	) => void;
	onRelatedArticlesShowMoreClick?(
		event: React.MouseEvent<HTMLElement>,
		analyticsEvent: UIAnalyticsEvent,
		isCollapsed: boolean,
	): void;
	routeGroup?: string;
	routeName?: string;
}

const dest = createCtx<RelatedArticlesContextInterface>();
export const useRelatedArticlesContext: () => RelatedArticlesContextInterface = dest[0];
export const CtxProvider: React.Provider<RelatedArticlesContextInterface | undefined> = dest[1];

export const RelatedArticlesContextProvider = ({
	routeGroup,
	routeName,
	onGetRelatedArticles,
	onRelatedArticlesShowMoreClick,
	onRelatedArticlesListItemClick,
	children,
}: PropsWithChildren<RelatedArticlesContextInterface>): React.JSX.Element => {
	return (
		<CtxProvider
			value={{
				routeGroup,
				routeName,
				onGetRelatedArticles,
				onRelatedArticlesShowMoreClick,
				onRelatedArticlesListItemClick,
			}}
		>
			{children}
		</CtxProvider>
	);
};
