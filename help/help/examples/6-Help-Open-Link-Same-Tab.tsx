import React, { useState } from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import Page from '@atlaskit/page';

import Help, { ARTICLE_TYPE } from '../src';
import type { Article, articleId, HistoryItem } from '../src';

import { getArticle } from './utils/mockData';
import {
	ExampleWrapper,
	HelpContainer,
	HelpWrapper,
	FooterContent,
	ExampleDefaultContent,
} from './utils/styled';

const handleEvent = (analyticsEvent: { context: any; payload: any }) => {
	const { payload, context } = analyticsEvent;
	console.log('Received event:', { payload, context });
};

const Example = (): React.JSX.Element => {
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
								home={{
									homeOptions: [
										{
											id: 'open-same-tab',
											text: 'Open link in same tab',
											href: 'https://www.atlassian.com/',
											openInSameTab: true,
										},
									],
								}}
								footer={
									<FooterContent>
										<span>Footer</span>
									</FooterContent>
								}
							>
								<ExampleDefaultContent>
									<span>Default content</span>
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
