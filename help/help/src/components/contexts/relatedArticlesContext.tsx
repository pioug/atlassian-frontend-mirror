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

export const [useRelatedArticlesContext, CtxProvider] =
	createCtx<RelatedArticlesContextInterface>();

export const RelatedArticlesContextProvider = ({
	routeGroup,
	routeName,
	onGetRelatedArticles,
	onRelatedArticlesShowMoreClick,
	onRelatedArticlesListItemClick,
	children,
}: PropsWithChildren<RelatedArticlesContextInterface>) => {
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
