import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, waitFor, fireEvent, act, within } from '@testing-library/react';
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
const searchTab = intl.formatMessage(messages.help_search_tab);
const aiTab = intl.formatMessage(messages.help_ai_tab);
const needMoreHelpAiLabel = intl.formatMessage(messages.help_need_more_help_label);

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

describe('Help without AI', () => {
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

describe('Help with AI', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	const mockFooter = <div>Mock Footer</div>;

	const defaultProps = {
		header: {
			onCloseButtonClick: mockOnCloseButtonClick,
			onBackButtonClick: mockOnBackButtonClick,
		},
		navigation: {
			navigationData: {
				articleId: { id: '', type: ARTICLE_TYPE.HELP_ARTICLE },
				history: [],
			},
			setNavigationData: MockNavigationDataSetter,
		},
		helpArticle: {
			onGetHelpArticle: mockOnGetHelpArticle,
			onHelpArticleLoadingFailTryAgainButtonClick: mockOnHelpArticleLoadingFailTryAgainButtonClick,
			onWasHelpfulYesButtonClick: mockOnWasHelpfulYesButtonClick,
			onWasHelpfulNoButtonClick: mockOnWasHelpfulNoButtonClick,
		},
		relatedArticles: {
			onGetRelatedArticles: mockOnGetRelatedArticles,
			onRelatedArticlesListItemClick: mockOnRelatedArticlesListItemClick,
		},
		search: {
			onSearch: mockOnSearch,
			onSearchInputChanged: mockOnSearchInputChanged,
			onSearchInputCleared: mockOnSearchInputCleared,
			onSearchResultItemClick: mockOnSearchResultItemClick,
			searchExternalUrl: mockSearchExternalUrl,
			onSearchExternalUrlClick: mockOnSearchExternalUrlClick,
		},
		ai: {
			isAiEnabled: true,
		},
		footer: mockFooter,
	};

	const defaultComponent = (
		<IntlProvider locale="en">
			<Help {...defaultProps}>
				<div>{defaultContentText}</div>
			</Help>
		</IntlProvider>
	);

	it('Should render footer within HelpContent', () => {
		const { queryByTestId, getByTestId, getByText, rerender } = render(defaultComponent);

		getByText(searchTab).click();
		rerender(defaultComponent);

		expect(getByTestId('inside-footer')).toBeInTheDocument();
		expect(queryByTestId('footer')).toBeNull();
	});

	it('should show search input when search results are visible and not show the back button', async () => {
		jest.useFakeTimers();
		const { getByPlaceholderText, queryByText, getByText, rerender } = render(defaultComponent);

		getByText(searchTab).click();
		rerender(defaultComponent);

		const searchInput = getByPlaceholderText('Search help articles')!.closest('input');
		expect(searchInput).toBeInTheDocument();
		expect(queryByText(messageBack)).not.toBeInTheDocument();
		if (searchInput) {
			fireEvent.change(searchInput, { target: { value: 'test' } });
		}

		act(() => {
			jest.advanceTimersByTime(100);
		});

		expect(searchInput).toBeInTheDocument();
		expect(queryByText(messageBack)).not.toBeInTheDocument();
		jest.clearAllTimers();
	});

	it('should hide search input and show back button when article is open', () => {
		jest.useFakeTimers();
		const { getByPlaceholderText, queryByPlaceholderText, getByText, rerender, queryByText } =
			render(defaultComponent);

		getByText(searchTab).click();
		rerender(defaultComponent);

		const searchInput = getByPlaceholderText('Search help articles');
		expect(searchInput).toBeInTheDocument();
		expect(queryByText(messageBack)).not.toBeInTheDocument();
		rerender(
			<IntlProvider locale="en">
				<Help
					{...defaultProps}
					navigation={{
						navigationData: {
							articleId: { id: '1', type: ARTICLE_TYPE.HELP_ARTICLE },
							history: [],
						},
						setNavigationData: MockNavigationDataSetter,
					}}
				>
					<div>{defaultContentText}</div>
				</Help>
			</IntlProvider>,
		);

		act(() => {
			jest.advanceTimersByTime(200);
		});

		expect(queryByPlaceholderText('Search help articles')).not.toBeInTheDocument();
		expect(getByText(messageBack)).toBeInTheDocument();

		jest.clearAllTimers();
	});

	it('should not show back button on home view and show search input', () => {
		const { queryByText, getByPlaceholderText, getByText, rerender } = render(defaultComponent);

		getByText(searchTab).click();
		rerender(defaultComponent);

		expect(queryByText(messageBack)).not.toBeInTheDocument();
		const searchInput = getByPlaceholderText('Search help articles');
		expect(searchInput).toBeInTheDocument();
	});

	it('should not show search components when AI tab is clicked', () => {
		const { getByText, queryByTestId, rerender } = render(defaultComponent);

		getByText(aiTab).click();
		rerender(defaultComponent);

		expect(queryByTestId('inside-footer')).toBeNull();
	});

	it('should render NeedMoreHelp component on the default page', () => {
		const { getByText, rerender } = render(defaultComponent);

		getByText(searchTab).click();
		rerender(defaultComponent);
		expect(getByText('Need more help?')).toBeInTheDocument();
	});

	it('should now show search component when need more help Ask Ai label is clicked', () => {
		const { getByText, rerender, queryByTestId } = render(defaultComponent);

		getByText(searchTab).click();
		rerender(defaultComponent);
		expect(getByText('Need more help?')).toBeInTheDocument();

		const needMoreHelpContainer = getByText('Need more help?').closest('div');
		if (needMoreHelpContainer) {
			const askAiButton = within(needMoreHelpContainer).getByText(needMoreHelpAiLabel);
			askAiButton.click();
		}

		rerender(defaultComponent);
		expect(queryByTestId('inside-footer')).toBeNull();
	});
});
