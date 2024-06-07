import React, { useState } from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import Page from '@atlaskit/page';

import Help, { ARTICLE_TYPE } from '../src';
import type { Article, articleId, ArticleItem, HistoryItem } from '../src';

import { getArticle, searchArticle } from './utils/mockData';
import {
	ExampleWrapper,
	HelpContainer,
	HelpWrapper,
	FooterContent,
	ExampleDefaultContent,
} from './utils/styled';

const handleEvent = (analyticsEvent: { payload: any; context: any }) => {
	const { payload, context } = analyticsEvent;
	console.log('Received event:', { payload, context });
};

const Example = () => {
	const [navigationData, setNavigationData] = useState<{
		articleId: articleId;
		history: HistoryItem[];
	}>({
		articleId: { id: '', type: ARTICLE_TYPE.HELP_ARTICLE },
		history: [],
	});

	const navigationDataSetter = (navigationData: {
		articleId: articleId;
		history: HistoryItem[];
	}): void => {
		console.log('new navigation data');
		console.log(navigationData);
		setNavigationData(navigationData);
	};

	const onGetHelpArticle = (articleId: articleId): Promise<Article> => {
		return new Promise((resolve) => resolve(getArticle(articleId.id)));
	};

	const getSearchResults = (value: string): Promise<ArticleItem[]> => {
		return new Promise((resolve) => resolve(searchArticle(value)));
	};

	return (
		<ExampleWrapper>
			<Page>
				<HelpContainer>
					<HelpWrapper>
						<AnalyticsListener channel="atlaskit" onEvent={handleEvent}>
							<Help
								navigation={{
									navigationData,
									setNavigationData: navigationDataSetter,
								}}
								helpArticle={{
									onGetHelpArticle,
								}}
								search={{
									onSearch: getSearchResults,
									openExternalSearchUrlInNewTab: true,
								}}
								footer={
									<FooterContent>
										<span>Footer</span>
									</FooterContent>
								}
							>
								<ExampleDefaultContent>
									<span>Search for articles</span>
								</ExampleDefaultContent>
							</Help>
						</AnalyticsListener>
					</HelpWrapper>
				</HelpContainer>
			</Page>
		</ExampleWrapper>
	);
};

export default Example;
