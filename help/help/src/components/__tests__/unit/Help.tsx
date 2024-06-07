import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, waitFor, fireEvent, act } from '@testing-library/react';
import { createIntl, createIntlCache, IntlProvider } from 'react-intl-next';

import { getMockArticle, getMockArticleItemList } from '../../../util/testing/mock';
import { messages } from '../../../messages';

import { SLIDEIN_OVERLAY_TRANSITION_DURATION_MS, HIDE_CONTENT_DELAY } from '../../constants';
import { ARTICLE_TYPE } from '../../../model/Help';
import { Help } from '../../Help';

// Messages
const cache = createIntlCache();
const intl = createIntl(
	{
		locale: 'en',
		messages: {},
	},
	cache,
);
const messageBack = intl.formatMessage(messages.help_navigation_back);

// Mock props
const MockNavigationDataSetter = jest.fn().mockImplementation((id) => id);
const mockOnGetHelpArticle = jest.fn().mockImplementation(
	(id) =>
		new Promise((resolve, reject) => {
			if (id > 0) {
				setTimeout(() => {
					resolve(getMockArticle(id));
				}, 100);
			} else {
				reject('error');
			}
		}),
);
const mockOnHelpArticleLoadingFailTryAgainButtonClick = jest.fn();
const mockOnGetRelatedArticles = jest.fn().mockImplementation(
	() =>
		new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(getMockArticleItemList(10));
			}, 100);
		}),
);
const mockOnRelatedArticlesListItemClick = jest.fn();
const mockOnSearch = jest.fn().mockImplementation(
	() =>
		new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(getMockArticleItemList(10));
			}, 100);
		}),
);
const mockOnSearchInputChanged = jest.fn();
const mockOnSearchInputCleared = jest.fn();
const mockOnSearchResultItemClick = jest.fn();
const mockSearchExternalUrl = 'https://www.atlassian.com/';
const mockOnSearchExternalUrlClick = jest.fn();
const mockOnCloseButtonClick = jest.fn();
const mockOnWasHelpfulYesButtonClick = jest.fn();
const mockOnWasHelpfulNoButtonClick = jest.fn();
const mockOnBackButtonClick = jest.fn();

const defaultContentText = 'Default content';

describe('Help', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('Should load and display an article if the articleId != ""', async () => {
		jest.useFakeTimers();
		const { queryByText, rerender } = render(
			<IntlProvider locale="en">
				<Help
					header={{
						onCloseButtonClick: mockOnCloseButtonClick,
						onBackButtonClick: mockOnBackButtonClick,
					}}
					navigation={{
						navigationData: {
							articleId: { id: '', type: ARTICLE_TYPE.HELP_ARTICLE },
							history: [],
						},
						setNavigationData: MockNavigationDataSetter,
					}}
					helpArticle={{
						onGetHelpArticle: mockOnGetHelpArticle,
						onHelpArticleLoadingFailTryAgainButtonClick:
							mockOnHelpArticleLoadingFailTryAgainButtonClick,
						onWasHelpfulYesButtonClick: mockOnWasHelpfulYesButtonClick,
						onWasHelpfulNoButtonClick: mockOnWasHelpfulNoButtonClick,
					}}
					relatedArticles={{
						onGetRelatedArticles: mockOnGetRelatedArticles,
						onRelatedArticlesListItemClick: mockOnRelatedArticlesListItemClick,
					}}
					search={{
						onSearch: mockOnSearch,
						onSearchInputChanged: mockOnSearchInputChanged,
						onSearchInputCleared: mockOnSearchInputCleared,
						onSearchResultItemClick: mockOnSearchResultItemClick,
						searchExternalUrl: mockSearchExternalUrl,
						onSearchExternalUrlClick: mockOnSearchExternalUrlClick,
					}}
				>
					<div>{defaultContentText}</div>
				</Help>
			</IntlProvider>,
		);

		rerender(
			<IntlProvider locale="en">
				<Help
					header={{
						onCloseButtonClick: mockOnCloseButtonClick,
						onBackButtonClick: mockOnBackButtonClick,
					}}
					navigation={{
						navigationData: {
							articleId: { id: '1', type: ARTICLE_TYPE.HELP_ARTICLE },
							history: [],
						},
						setNavigationData: MockNavigationDataSetter,
					}}
					helpArticle={{
						onGetHelpArticle: mockOnGetHelpArticle,
						onHelpArticleLoadingFailTryAgainButtonClick:
							mockOnHelpArticleLoadingFailTryAgainButtonClick,
						onWasHelpfulYesButtonClick: mockOnWasHelpfulYesButtonClick,
						onWasHelpfulNoButtonClick: mockOnWasHelpfulNoButtonClick,
					}}
					relatedArticles={{
						onGetRelatedArticles: mockOnGetRelatedArticles,
						onRelatedArticlesListItemClick: mockOnRelatedArticlesListItemClick,
					}}
					search={{
						onSearch: mockOnSearch,
						onSearchInputChanged: mockOnSearchInputChanged,
						onSearchInputCleared: mockOnSearchInputCleared,
						onSearchResultItemClick: mockOnSearchResultItemClick,
						searchExternalUrl: mockSearchExternalUrl,
						onSearchExternalUrlClick: mockOnSearchExternalUrlClick,
					}}
				>
					<div>{defaultContentText}</div>
				</Help>
			</IntlProvider>,
		);

		// onGetArticle promise gets resolved after 100ms
		act(() => {
			jest.advanceTimersByTime(100);
		});
		expect(mockOnGetHelpArticle).toHaveBeenCalledTimes(1);

		const defaultContentElm = queryByText(defaultContentText);
		expect(defaultContentElm).not.toBeNull();

		// Once the article gets loaded
		if (defaultContentElm) {
			const defaultContentContainerElm = defaultContentElm.parentElement;

			// the defualt content should be visible until the article fade-in animation finishes
			expect(window.getComputedStyle(defaultContentContainerElm!).display).toBe('block');
			act(() => {
				jest.advanceTimersByTime(HIDE_CONTENT_DELAY);
			});
			expect(window.getComputedStyle(defaultContentContainerElm!).display).toBe('none');
		}

		jest.clearAllTimers();
	});

	it('Should display the Back button if an article is open', async () => {
		jest.useFakeTimers();

		const { queryByText, rerender } = render(
			<IntlProvider locale="en">
				<Help
					header={{
						onCloseButtonClick: mockOnCloseButtonClick,
						onBackButtonClick: mockOnBackButtonClick,
					}}
					navigation={{
						navigationData: {
							articleId: { id: '', type: ARTICLE_TYPE.HELP_ARTICLE },
							history: [],
						},
						setNavigationData: MockNavigationDataSetter,
					}}
					helpArticle={{
						onGetHelpArticle: mockOnGetHelpArticle,
						onHelpArticleLoadingFailTryAgainButtonClick:
							mockOnHelpArticleLoadingFailTryAgainButtonClick,
						onWasHelpfulYesButtonClick: mockOnWasHelpfulYesButtonClick,
						onWasHelpfulNoButtonClick: mockOnWasHelpfulNoButtonClick,
					}}
					relatedArticles={{
						onGetRelatedArticles: mockOnGetRelatedArticles,
						onRelatedArticlesListItemClick: mockOnRelatedArticlesListItemClick,
					}}
					search={{
						onSearch: mockOnSearch,
						onSearchInputChanged: mockOnSearchInputChanged,
						onSearchInputCleared: mockOnSearchInputCleared,
						onSearchResultItemClick: mockOnSearchResultItemClick,
						searchExternalUrl: mockSearchExternalUrl,
						onSearchExternalUrlClick: mockOnSearchExternalUrlClick,
					}}
				>
					<div>{defaultContentText}</div>
				</Help>
			</IntlProvider>,
		);

		rerender(
			<IntlProvider locale="en">
				<Help
					header={{
						onCloseButtonClick: mockOnCloseButtonClick,
						onBackButtonClick: mockOnBackButtonClick,
					}}
					navigation={{
						navigationData: {
							articleId: { id: '1', type: ARTICLE_TYPE.HELP_ARTICLE },
							history: [],
						},
						setNavigationData: MockNavigationDataSetter,
					}}
					helpArticle={{
						onGetHelpArticle: mockOnGetHelpArticle,
						onHelpArticleLoadingFailTryAgainButtonClick:
							mockOnHelpArticleLoadingFailTryAgainButtonClick,
						onWasHelpfulYesButtonClick: mockOnWasHelpfulYesButtonClick,
						onWasHelpfulNoButtonClick: mockOnWasHelpfulNoButtonClick,
					}}
					relatedArticles={{
						onGetRelatedArticles: mockOnGetRelatedArticles,
						onRelatedArticlesListItemClick: mockOnRelatedArticlesListItemClick,
					}}
					search={{
						onSearch: mockOnSearch,
						onSearchInputChanged: mockOnSearchInputChanged,
						onSearchInputCleared: mockOnSearchInputCleared,
						onSearchResultItemClick: mockOnSearchResultItemClick,
						searchExternalUrl: mockSearchExternalUrl,
						onSearchExternalUrlClick: mockOnSearchExternalUrlClick,
					}}
				>
					<div>{defaultContentText}</div>
				</Help>
			</IntlProvider>,
		);

		// onGetArticle promise gets resolved after 100ms
		act(() => {
			jest.advanceTimersByTime(200);
		});

		// Wait until the fade-in transition of the back button finishes
		act(() => {
			jest.advanceTimersByTime(SLIDEIN_OVERLAY_TRANSITION_DURATION_MS + 200);
		});
		const BackButton = queryByText(messageBack)!.closest('button');
		expect(BackButton).not.toBeNull();

		// Once the article gets loaded
		if (BackButton) {
			fireEvent.click(BackButton);

			// Wait until the fade-out transition of the back button finishes
			act(() => {
				jest.advanceTimersByTime(SLIDEIN_OVERLAY_TRANSITION_DURATION_MS + 200);
			});

			await waitFor(() => expect(mockOnBackButtonClick).toHaveBeenCalledTimes(1));
		}

		jest.clearAllTimers();
	});
});
