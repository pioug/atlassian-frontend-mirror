import React, { type PropsWithChildren } from 'react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type Article, type ArticleItem, type ArticleFeedback } from '../../model/Article';
import { type articleId } from '../../model/Help';
import { createCtx } from '../../util/hooks/ctx';

export interface HelpArticleContextInterface {
	onGetHelpArticle?(articleId: articleId): Promise<Article>;
	onHelpArticleLoadingFailTryAgainButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
		articleId?: articleId,
	): void;
	onWasHelpfulNoButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
		ArticleItem: ArticleItem,
	): void;
	onWasHelpfulSubmit?(
		analyticsEvent: UIAnalyticsEvent,
		articleFeedback: ArticleFeedback,
		articleData: ArticleItem,
	): Promise<boolean>;
	// Feedback form
	onWasHelpfulYesButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
		ArticleItem: ArticleItem,
	): void;
}

const dest = createCtx<HelpArticleContextInterface>();
export const useHelpArticleContext: () => HelpArticleContextInterface = dest[0];
export const CtxProvider: React.Provider<HelpArticleContextInterface | undefined> = dest[1];

export const HelpArticleContextProvider = ({
	onGetHelpArticle,
	onHelpArticleLoadingFailTryAgainButtonClick,
	onWasHelpfulYesButtonClick,
	onWasHelpfulNoButtonClick,
	onWasHelpfulSubmit,
	children,
}: PropsWithChildren<HelpArticleContextInterface>): React.JSX.Element => {
	return (
		<CtxProvider
			value={{
				onGetHelpArticle,
				onHelpArticleLoadingFailTryAgainButtonClick,
				onWasHelpfulYesButtonClick,
				onWasHelpfulNoButtonClick,
				onWasHelpfulSubmit,
			}}
		>
			{children}
		</CtxProvider>
	);
};
