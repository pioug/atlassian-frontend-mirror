import React, { useState } from 'react';
import { AnalyticsListener, type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { NotificationLogClient } from '@atlaskit/notification-log-client';
import Page from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';
import ShipIcon from '@atlaskit/icon/core/migration/release--ship';
import * as colors from '@atlaskit/theme/colors';
import { Field, HelperMessage } from '@atlaskit/form';

import {
	ExampleWrapper,
	HelpWrapper,
	ControlsWrapper,
	ButtonsWrapper,
	FooterContent,
	HelpContainer,
} from './utils/styled';

import { useContentPlatformApi } from './utils/services/cpapi';
import { useAlgolia } from './utils/services/algolia';
import type { FilterConfiguration } from './utils/services/cpapi';

import Help, {
	RelatedArticles,
	ARTICLE_TYPE,
	DividerLine,
	type WHATS_NEW_ITEM_TYPES,
} from '../src';
import type { ArticleItem, ArticleFeedback, articleId, WhatsNewArticle, HistoryItem } from '../src';

const SEARCH_EXTERNAL_URL = 'https://support.atlassian.com/';

const handleEvent = (analyticsEvent: { context: any; payload: any; }) => {
	const { payload, context } = analyticsEvent;
	console.log('Received event:', { payload, context });
};

// Mockup notification Promise
class MockNotificationLogClient extends NotificationLogClient {
	constructor() {
		super('', '');
	}

	public async countUnseenNotifications() {
		return Promise.resolve({ count: 100 });
	}
}

const notificationsClient = new MockNotificationLogClient();

const Footer = (
	<FooterContent>
		<span>Footer</span>
	</FooterContent>
);

const Example = () => {
	const {
		token: articlesToken,
		setToken: setArticlesToken,
		searchWhatsNewArticles,
		getWhatsNewArticle,
	} = useContentPlatformApi();

	const [navigationData, setNavigationData] = useState<{
		articleId: articleId;
		history: HistoryItem[];
	}>({
		articleId: { id: '', type: ARTICLE_TYPE.HELP_ARTICLE },
		history: [],
	});

	// Algolia Values
	const [routeGroup, setRouteGroup] = useState<string>('project-settings-software');
	const [routeName, setRouteName] = useState<string | undefined>(
		'project-settings-software-access',
	);
	const {
		getArticleById,
		getRelatedArticles,
		searchArticles,
		productName,
		setProductName,
		productExperience,
		setProductExperience,
		algoliaIndexName,
		setAlgoliaIndexName,
	} = useAlgolia({
		productName: 'Jira Software',
		productExperience: 'Team-managed',
	});

	// CPAPI values
	const [fdIssueKeys, setFdIssueKeys] = useState<string>('');
	const [fdIssueLinks, setFdIssueLinks] = useState<string>('');
	const [productNames, setProductNames] = useState<string>('');
	const [changeStatus, setChangeStatus] = useState<string>('');
	const [featureRolloutDates, setFeatureRolloutDates] = useState<string>('');
	const [releaseNoteFlags, setReleaseNoteFlags] = useState<string>('');
	const [releaseNoteFlagOffValues, setReleaseNoteFlagOffValues] = useState<string>('');

	const [showComponent, setShowComponent] = useState<boolean>(true);
	const [algoliaParameters, setAlgoliaParameters] = useState({
		routeGroup,
		routeName,
		algoliaIndexName,
		productName,
		productExperience,
	});

	const openDrawer = (articleId: string = '', type: ARTICLE_TYPE = ARTICLE_TYPE.HELP_ARTICLE) => {
		setNavigationData({ articleId: { id: articleId, type }, history: [] });
		setShowComponent(true);
	};

	const closeDrawer = (): void => {
		setNavigationData({
			articleId: { id: '', type: ARTICLE_TYPE.HELP_ARTICLE },
			history: [],
		});
		setShowComponent(false);
	};

	const handleOnSearchResultItemClick = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
		articleData: ArticleItem,
	) => {
		console.log('onSearchResultItemClick');
		console.log(event);
		console.log(analyticsEvent);
		console.log(articleData);
		analyticsEvent.fire('help');
	};

	const onSearchWhatsNewArticles = async (
		filter: WHATS_NEW_ITEM_TYPES | '',
		numberOfItems: number,
		page: string = '',
	): Promise<any> => {
		console.log('onSearchWhatsNewArticles');
		let filterConfig: FilterConfiguration = {};

		if (fdIssueKeys) {
			filterConfig.fdIssueKeys = fdIssueKeys.split(',').map((value) => `"${value}"`);
		}
		if (fdIssueLinks) {
			filterConfig.fdIssueLinks = fdIssueLinks.split(',').map((value) => `"${value}"`);
		}
		if (productNames) {
			filterConfig.productNames = productNames.split(',').map((value) => `"${value}"`);
		}
		if (changeStatus) {
			filterConfig.changeStatus = changeStatus.split(',').map((value) => `"${value}"`);
		}
		if (featureRolloutDates) {
			filterConfig.featureRolloutDates = featureRolloutDates
				.split(',')
				.map((value) => `"${value}"`);
		}
		if (releaseNoteFlags) {
			filterConfig.releaseNoteFlags = releaseNoteFlags.split(',').map((value) => `"${value}"`);
		}
		if (releaseNoteFlagOffValues) {
			filterConfig.releaseNoteFlagOffValues = releaseNoteFlagOffValues.split(',');
		}

		if (filter !== '') {
			filterConfig.changeTypes = [`"${filter}"`];
		}

		return searchWhatsNewArticles(filterConfig, numberOfItems, page);
	};

	const navigationDataSetter = (navigationData: {
		articleId: articleId;
		history: HistoryItem[];
	}): void => {
		console.log('new navigation data');
		console.log(navigationData);
		setNavigationData(navigationData);
	};

	const handleOnWasHelpfulNoButtonClick = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
		ArticleItem: ArticleItem,
	): void => {
		console.log('onWasHelpfulNoButtonClick');
		console.log(event);
		console.log(analyticsEvent);
		console.log(ArticleItem);
		analyticsEvent.fire('help');
	};

	const handleOnWasHelpfulYesButtonClick = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
		ArticleItem: ArticleItem,
	): void => {
		console.log('onWasHelpfulYesButtonClick');
		console.log(event);
		console.log(analyticsEvent);
		console.log(ArticleItem);
		analyticsEvent.fire('help');
	};

	const handleOnSearchInputChanged = (
		event: React.KeyboardEvent<HTMLInputElement>,
		analyticsEvent: UIAnalyticsEvent,
		value: string,
	) => {
		console.log('onSearchInputChanged');
		console.log(event);
		console.log(analyticsEvent);
		console.log(value);
		analyticsEvent.fire('help');
	};

	const handleOnSearchInputCleared = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	) => {
		console.log('onSearchInputCleared');
		console.log(event);
		console.log(analyticsEvent);
		analyticsEvent.fire('help');
	};

	const handleOnSearchExternalUrlClick = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	) => {
		console.log('onSearchExternalUrlClick');
		console.log(event);
		console.log(analyticsEvent);
		analyticsEvent.fire('help');
	};

	const handleOnCloseButtonClick = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	) => {
		console.log('onCloseButtonClick');
		console.log(event);
		console.log(analyticsEvent);
		analyticsEvent.fire('help');
		closeDrawer();
	};

	const handleOnRelatedArticlesShowMoreClick = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
		isCollapsed: boolean,
	) => {
		console.log('onRelatedArticlesShowMoreClickOfOpenArticle');
		console.log(event);
		console.log(analyticsEvent);
		console.log(isCollapsed);
	};

	const handleOnWasHelpfulSubmit = (
		analyticsEvent: UIAnalyticsEvent,
		articleFeedback: ArticleFeedback,
		articleData: ArticleItem,
	): Promise<boolean> => {
		console.log('OnWasHelpfulSubmit');
		console.log(analyticsEvent);
		console.log(articleFeedback);
		console.log(articleData);
		return new Promise((resolve, rejects) => {
			let wait = setTimeout(() => {
				clearTimeout(wait);
				resolve(true);
			}, 200);
		});
	};

	const handleOnBackButtonClick = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	) => {
		console.log('onBackButtonClick');
		console.log(event);
		console.log(analyticsEvent);
		analyticsEvent.fire('help');
	};

	const handleOnRelatedArticlesListItemClick = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
		articleData: ArticleItem,
	) => {
		console.log('onRelatedArticlesListItemClick');
		console.log(event);
		console.log(analyticsEvent);
		console.log(articleData);
	};

	const handleOnHelpArticleLoadingFailTryAgainButtonClick = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
		articleId: articleId,
	) => {
		console.log('onHelpArticleLoadingFailTryAgainButtonClick');
		console.log(event);
		console.log(analyticsEvent);
		console.log(articleId);
	};

	const handleOnWhatsNewButtonClick = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	) => {
		console.log('handleOnWhatsNewButtonClick');
		console.log(event);
		console.log(analyticsEvent);
	};

	const handleOnSearchWhatsNewShowMoreClick = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	) => {
		console.log('handleOnSearchWhatsNewShowMoreClick');
		console.log(event);
		console.log(analyticsEvent);
	};

	const handleOnWhatsNewResultItemClick = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
		whatsNewArticleData: WhatsNewArticle,
	) => {
		console.log('handleOnWhatsNewResultItemClick');
		console.log(event);
		console.log(analyticsEvent);
		console.log(whatsNewArticleData);
	};

	return (
		<AnalyticsListener channel="help" onEvent={handleEvent}>
			<ExampleWrapper>
				<Page>
					<div
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							display: 'inline-block',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							height: '100vh',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							verticalAlign: 'top',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							width: 'Calc(100% - 400px)',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							boxSizing: 'border-box',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							padding: token('space.150', '12px'),
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							overflow: 'auto',
						}}
					>
						<h2
							style={{
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								width: 'Calc(100% - 400px)',
								padding: `0 0 ${token('space.100', '8px')} ${token('space.200', '16px')}`,
							}}
						>
							Help articles
						</h2>
						<ButtonsWrapper>
							<ButtonGroup>
								<Button appearance="primary" onClick={() => openDrawer()}>
									Open drawer - no ID
								</Button>

								<Button appearance="primary" type="button" onClick={closeDrawer}>
									Close drawer
								</Button>

								<Button appearance="primary" onClick={() => openDrawer('zl7jDsTshqNFSXgY8302f')}>
									Open drawer - article 1
								</Button>

								<Button appearance="primary" onClick={() => openDrawer('zhf8pCD3TzzP6uhO9X3WO')}>
									Open drawer - article 2
								</Button>

								<Button appearance="primary" onClick={() => openDrawer('11111111111111111111')}>
									Open drawer - wrong id
								</Button>
							</ButtonGroup>
						</ButtonsWrapper>
						<h3
							style={{
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								width: 'Calc(100% - 400px)',
								padding: `${token('space.200', '16px')} 0 0 ${token('space.200', '16px')}`,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								margin: token('space.0', '0px'),
							}}
						>
							Help articles settings
						</h3>
						<div>
							<ControlsWrapper>
								<Field label="Algolia Index" name="algolia-index">
									{({ fieldProps }: any) => (
										<>
											<Textfield
												{...fieldProps}
												value={algoliaParameters.algoliaIndexName}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													setAlgoliaParameters({
														...algoliaParameters,
														algoliaIndexName: e.target.value,
													})
												}
											/>
											<HelperMessage>e.g. : product_help_stg_copsi)</HelperMessage>
										</>
									)}
								</Field>
							</ControlsWrapper>
							<ControlsWrapper>
								<Field label="Product Name" name="product-name">
									{({ fieldProps }: any) => (
										<>
											<Textfield
												{...fieldProps}
												value={algoliaParameters.productName}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													setAlgoliaParameters({
														...algoliaParameters,
														productName: e.target.value,
													})
												}
											/>
											<HelperMessage>e.g. : Jira Software</HelperMessage>
										</>
									)}
								</Field>
							</ControlsWrapper>
							<ControlsWrapper>
								<Field label="Product Experience" name="product-experience">
									{({ fieldProps }: any) => (
										<>
											<Textfield
												{...fieldProps}
												value={algoliaParameters.productExperience}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													setAlgoliaParameters({
														...algoliaParameters,
														productExperience: e.target.value,
													})
												}
											/>
											<HelperMessage>e.g. : Team-managed</HelperMessage>
										</>
									)}
								</Field>
							</ControlsWrapper>
							<ControlsWrapper>
								<Field label="Route Group" name="route-group">
									{({ fieldProps }: any) => (
										<>
											<Textfield
												{...fieldProps}
												value={algoliaParameters.routeGroup}
												name="route-group"
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													setAlgoliaParameters({
														...algoliaParameters,
														routeGroup: e.target.value,
													})
												}
											/>
											<HelperMessage>e.g. : servicedesk</HelperMessage>
										</>
									)}
								</Field>
							</ControlsWrapper>
							<ControlsWrapper>
								<Field label="Route Name" name="route-name">
									{({ fieldProps }: any) => (
										<>
											<Textfield
												{...fieldProps}
												value={algoliaParameters.routeName}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													setAlgoliaParameters({
														...algoliaParameters,
														routeName: e.target.value,
													})
												}
											/>
											<HelperMessage>e.g. : project/service-desk/settings/index</HelperMessage>
										</>
									)}
								</Field>
							</ControlsWrapper>
						</div>
						<DividerLine />
						<h2
							style={{
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								width: 'Calc(100% - 400px)',
								padding: `${token('space.200', '16px')} 0 0 ${token('space.200', '16px')}`,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								margin: token('space.0', '0px'),
							}}
						>
							Release Notes
						</h2>
						<ButtonsWrapper>
							<ButtonGroup>
								<Button appearance="primary" onClick={() => openDrawer('', ARTICLE_TYPE.WHATS_NEW)}>
									Open drawer - What's New
								</Button>
								<Button
									appearance="primary"
									onClick={() => openDrawer('11NZoqDJSUhapI6leC1M9C', ARTICLE_TYPE.WHATS_NEW)}
								>
									Open drawer - What's new Article
								</Button>
							</ButtonGroup>
						</ButtonsWrapper>
						<h3
							style={{
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								width: 'Calc(100% - 400px)',
								padding: `${token('space.200', '16px')} 0 0 ${token('space.200', '16px')}`,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								margin: token('space.0', '0px'),
							}}
						>
							Help articles settings
						</h3>
						<div>
							<ControlsWrapper width="100%">
								<Field label="Token" name="token">
									{({ fieldProps }: any) => (
										<>
											<Textfield
												{...fieldProps}
												value={articlesToken}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													setArticlesToken(e.target.value)
												}
											/>
											<HelperMessage>
												To get your token you must be logged in in the Atlassian VPN and run in your
												terminal "atlas slauth token --mfa -a content-platform-api -e staging -o
												http"
											</HelperMessage>
										</>
									)}
								</Field>
							</ControlsWrapper>
							<ControlsWrapper>
								<Field label="FD Issue Key" name="fd-issue-key">
									{({ fieldProps }: any) => (
										<>
											<Textfield
												{...fieldProps}
												value={fdIssueKeys}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													setFdIssueKeys(e.target.value)
												}
											/>
											<HelperMessage>
												List of FD issue key (separate values with a ","). e.g. : FD-12345, FD-78902
											</HelperMessage>
										</>
									)}
								</Field>
								<Field label="FD Issue Links" name="fd-issue-links">
									{({ fieldProps }: any) => (
										<>
											<Textfield
												{...fieldProps}
												value={fdIssueLinks}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													setFdIssueLinks(e.target.value)
												}
											/>
											<HelperMessage>
												List of FD issue links (separate values with a ","). e.g. :
												https://hello.atlassian.net/browse/FD-12345
											</HelperMessage>
										</>
									)}
								</Field>
								<Field label="Product names" name="product-names">
									{({ fieldProps }: any) => (
										<>
											<Textfield
												{...fieldProps}
												value={productNames}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													setProductNames(e.target.value)
												}
											/>
											<HelperMessage>
												List of product names (separate values with a ","). e.g. :
											</HelperMessage>
										</>
									)}
								</Field>
								<Field label="Change status" name="change-status">
									{({ fieldProps }: any) => (
										<>
											<Textfield
												{...fieldProps}
												value={changeStatus}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													setChangeStatus(e.target.value)
												}
											/>
											<HelperMessage>
												List of change status (separate values with a ","). e.g. : Rolling out,
												Coming soon
											</HelperMessage>
										</>
									)}
								</Field>
								<Field label="featureRolloutDates" name="feature-rollout-date">
									{({ fieldProps }: any) => (
										<>
											<Textfield
												{...fieldProps}
												value={featureRolloutDates}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													setFeatureRolloutDates(e.target.value)
												}
											/>
											<HelperMessage>
												List of feature rollout dates (separate values with a ","). e.g. :
												2021-08-25, 2021-07-01
											</HelperMessage>
										</>
									)}
								</Field>
								<Field label="releaseNoteFlags" name="release-note-flags">
									{({ fieldProps }: any) => (
										<>
											<Textfield
												{...fieldProps}
												value={releaseNoteFlags}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													setReleaseNoteFlags(e.target.value)
												}
											/>
											<HelperMessage>
												List of release note flags (separate values with a ","). e.g. :
												https://app.launchdarkly.com/url-of-your-flag
											</HelperMessage>
										</>
									)}
								</Field>
								<Field label="releaseNoteFlagOffValues" name="release-note-flag-off-values">
									{({ fieldProps }: any) => (
										<>
											<Textfield
												{...fieldProps}
												value={releaseNoteFlagOffValues}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													setReleaseNoteFlagOffValues(e.target.value)
												}
											/>
											<HelperMessage>
												List of release note flags with "off" values (separate values with a ",").
												e.g. : "False", "Off"
											</HelperMessage>
										</>
									)}
								</Field>
							</ControlsWrapper>
						</div>
						<DividerLine />
						<ControlsWrapper>
							<Button
								appearance="primary"
								onClick={() => {
									closeDrawer();
									setRouteGroup(algoliaParameters.routeGroup);
									setRouteName(algoliaParameters.routeName);
									setProductName(algoliaParameters.productName);
									setProductExperience(algoliaParameters.productExperience);
									setAlgoliaIndexName(algoliaParameters.algoliaIndexName);
									setTimeout(() => openDrawer(), 0);
								}}
							>
								Save
							</Button>
						</ControlsWrapper>
					</div>
					{showComponent && (
						<HelpContainer>
							<HelpWrapper>
								<Help
									home={{
										homeOptions: [
											{
												id: 'test-button',
												onClick: (id: string) => {
													console.log('test button');
												},
												text: `Test Button`,
												href: 'https://www.google.com',
												icon: (
													<ShipIcon
														color={token('color.icon.subtle', colors.N600)}
														LEGACY_size="medium"
														spacing="spacious"
														label=""
													/>
												),
											},
										],
									}}
									footer={Footer}
									helpArticle={{
										onGetHelpArticle: getArticleById,
										onHelpArticleLoadingFailTryAgainButtonClick:
											handleOnHelpArticleLoadingFailTryAgainButtonClick,
										onWasHelpfulSubmit: handleOnWasHelpfulSubmit,
										onWasHelpfulYesButtonClick: handleOnWasHelpfulYesButtonClick,
										onWasHelpfulNoButtonClick: handleOnWasHelpfulNoButtonClick,
									}}
									navigation={{
										navigationData,
										setNavigationData: navigationDataSetter,
									}}
									search={{
										onSearch: searchArticles,
										onSearchInputChanged: handleOnSearchInputChanged,
										onSearchInputCleared: handleOnSearchInputCleared,
										onSearchResultItemClick: handleOnSearchResultItemClick,
										onSearchExternalUrlClick: handleOnSearchExternalUrlClick,
										searchExternalUrl: SEARCH_EXTERNAL_URL,
									}}
									relatedArticles={{
										routeGroup: routeGroup,
										routeName: routeName,
										onGetRelatedArticles: getRelatedArticles,
										onRelatedArticlesShowMoreClick: handleOnRelatedArticlesShowMoreClick,
										onRelatedArticlesListItemClick: handleOnRelatedArticlesListItemClick,
									}}
									whatsNew={{
										whatsNewGetNotificationProvider: Promise.resolve(notificationsClient),
										productName: 'Jira',
										onWhatsNewButtonClick: handleOnWhatsNewButtonClick,
										onSearchWhatsNewShowMoreClick: handleOnSearchWhatsNewShowMoreClick,
										onSearchWhatsNewArticles: onSearchWhatsNewArticles,
										onGetWhatsNewArticle: getWhatsNewArticle,
										onWhatsNewResultItemClick: handleOnWhatsNewResultItemClick,
									}}
									header={{
										onCloseButtonClick: handleOnCloseButtonClick,
										onBackButtonClick: handleOnBackButtonClick,
									}}
								>
									<RelatedArticles
										onRelatedArticlesListItemClick={(
											event: React.MouseEvent<HTMLElement, MouseEvent>,
											analytics: UIAnalyticsEvent,
											articleData: ArticleItem,
										) => {
											console.log('onRelatedArticlesListItemClick');
											console.log(event);
											console.log(analytics);
											console.log(articleData);
											setNavigationData({
												...navigationData,
												articleId: {
													id: articleData.id,
													type: ARTICLE_TYPE.HELP_ARTICLE,
												},
											});
										}}
										onRelatedArticlesShowMoreClick={(
											event: React.MouseEvent<HTMLElement, MouseEvent>,
											analytics: UIAnalyticsEvent,
											isCollapsed: boolean,
										) => {
											console.log('onRelatedArticlesShowMoreClick');
											console.log(event);
											console.log(analytics);
											console.log(isCollapsed);
										}}
										onGetRelatedArticles={getRelatedArticles}
										routeGroup={routeGroup}
										routeName={routeName}
									/>
								</Help>
							</HelpWrapper>
						</HelpContainer>
					)}
				</Page>
			</ExampleWrapper>
		</AnalyticsListener>
	);
};

export default Example;
