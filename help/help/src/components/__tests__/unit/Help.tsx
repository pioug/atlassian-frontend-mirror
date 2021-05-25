import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, wait, fireEvent, act } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import {
  getMockArticle,
  getMockArticleItemList,
} from '../../../util/testing/mock';
import { messages } from '../../../messages';

import { TRANSITION_DURATION_MS } from '../../constants';
import { Help } from '../../Help';

// Messages
const intlProvider = new IntlProvider({ locale: 'en' });
const { intl } = intlProvider.getChildContext();
const messageClose = intl.formatMessage(messages.help_close);
const messageBack = intl.formatMessage(messages.help_navigation_back);

// Mock props
let articleId = '';
const mockArticleIdSetter = jest
  .fn()
  .mockImplementation((id) => (articleId = id));
const mockOnGetArticle = jest.fn().mockImplementation(
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
const mockOnArticleLoadingFailTryAgainButtonClick = jest.fn();
const mockOnGetRelatedArticleOfOpenArticle = jest.fn().mockImplementation(
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

describe('BackButton', () => {
  // jest.useFakeTimers();

  beforeEach(() => {
    //   jest.clearAllTimers();
    articleId = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should match snapshot', () => {
    const { container } = render(
      <IntlProvider locale="en">
        <Help
          articleId={articleId}
          articleIdSetter={mockArticleIdSetter}
          onGetArticle={mockOnGetArticle}
          onArticleLoadingFailTryAgainButtonClick={
            mockOnArticleLoadingFailTryAgainButtonClick
          }
          onGetRelatedArticleOfOpenArticle={
            mockOnGetRelatedArticleOfOpenArticle
          }
          onRelatedArticlesListItemClick={mockOnRelatedArticlesListItemClick}
          onSearch={mockOnSearch}
          onSearchInputChanged={mockOnSearchInputChanged}
          onSearchInputCleared={mockOnSearchInputCleared}
          onSearchResultItemClick={mockOnSearchResultItemClick}
          searchExternalUrl={mockSearchExternalUrl}
          onSearchExternalUrlClick={mockOnSearchExternalUrlClick}
          onCloseButtonClick={mockOnCloseButtonClick}
          onWasHelpfulYesButtonClick={mockOnWasHelpfulYesButtonClick}
          onWasHelpfulNoButtonClick={mockOnWasHelpfulNoButtonClick}
          onBackButtonClick={mockOnBackButtonClick}
        >
          <div>{defaultContentText}</div>
        </Help>
      </IntlProvider>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('Should display the close button if the props mockOnCloseButtonClick is defined', () => {
    const { queryByLabelText } = render(
      <IntlProvider locale="en">
        <Help
          articleId={articleId}
          articleIdSetter={mockArticleIdSetter}
          onGetArticle={mockOnGetArticle}
          onArticleLoadingFailTryAgainButtonClick={
            mockOnArticleLoadingFailTryAgainButtonClick
          }
          onGetRelatedArticleOfOpenArticle={
            mockOnGetRelatedArticleOfOpenArticle
          }
          onRelatedArticlesListItemClick={mockOnRelatedArticlesListItemClick}
          onSearch={mockOnSearch}
          onSearchInputChanged={mockOnSearchInputChanged}
          onSearchInputCleared={mockOnSearchInputCleared}
          onSearchResultItemClick={mockOnSearchResultItemClick}
          searchExternalUrl={mockSearchExternalUrl}
          onCloseButtonClick={mockOnCloseButtonClick}
          onSearchExternalUrlClick={mockOnSearchExternalUrlClick}
          onWasHelpfulYesButtonClick={mockOnWasHelpfulYesButtonClick}
          onWasHelpfulNoButtonClick={mockOnWasHelpfulNoButtonClick}
          onBackButtonClick={mockOnBackButtonClick}
        >
          <div>{defaultContentText}</div>
        </Help>
      </IntlProvider>,
    );

    const closeButton = queryByLabelText(messageClose);

    expect(closeButton).not.toBeNull();
  });

  it('Should NOT display the close button if the props mockOnCloseButtonClick is undefined or null', () => {
    const { queryByLabelText } = render(
      <IntlProvider locale="en">
        <Help
          articleId={articleId}
          articleIdSetter={mockArticleIdSetter}
          onGetArticle={mockOnGetArticle}
          onArticleLoadingFailTryAgainButtonClick={
            mockOnArticleLoadingFailTryAgainButtonClick
          }
          onGetRelatedArticleOfOpenArticle={
            mockOnGetRelatedArticleOfOpenArticle
          }
          onRelatedArticlesListItemClick={mockOnRelatedArticlesListItemClick}
          onSearch={mockOnSearch}
          onSearchInputChanged={mockOnSearchInputChanged}
          onSearchInputCleared={mockOnSearchInputCleared}
          onSearchResultItemClick={mockOnSearchResultItemClick}
          searchExternalUrl={mockSearchExternalUrl}
          onSearchExternalUrlClick={mockOnSearchExternalUrlClick}
          onWasHelpfulYesButtonClick={mockOnWasHelpfulYesButtonClick}
          onWasHelpfulNoButtonClick={mockOnWasHelpfulNoButtonClick}
          onBackButtonClick={mockOnBackButtonClick}
        >
          <div>{defaultContentText}</div>
        </Help>
      </IntlProvider>,
    );

    const closeButton = queryByLabelText(messageClose);

    expect(closeButton).toBeNull();
  });

  it('Should load and display an article if the articleId != ""', async () => {
    jest.useFakeTimers();
    const { queryByText } = render(
      <IntlProvider locale="en">
        <Help
          articleId={'1'}
          articleIdSetter={mockArticleIdSetter}
          onGetArticle={mockOnGetArticle}
          onArticleLoadingFailTryAgainButtonClick={
            mockOnArticleLoadingFailTryAgainButtonClick
          }
          onSearch={mockOnSearch}
          onSearchInputChanged={mockOnSearchInputChanged}
          onSearchInputCleared={mockOnSearchInputCleared}
          onSearchResultItemClick={mockOnSearchResultItemClick}
          searchExternalUrl={mockSearchExternalUrl}
          onSearchExternalUrlClick={mockOnSearchExternalUrlClick}
          onWasHelpfulYesButtonClick={mockOnWasHelpfulYesButtonClick}
          onWasHelpfulNoButtonClick={mockOnWasHelpfulNoButtonClick}
          onBackButtonClick={mockOnBackButtonClick}
        >
          <div>{defaultContentText}</div>
        </Help>
      </IntlProvider>,
    );

    // onGetArticle promise gets resolved after 100ms
    act(() => jest.advanceTimersByTime(100));

    const defaultContentElm = queryByText(defaultContentText);
    expect(defaultContentElm).not.toBeNull();

    // Once the article gets loaded
    if (defaultContentElm) {
      const defaultContentContainerElm = defaultContentElm.parentElement;

      // the defualt content should be visible until the article fade-in animation finishes
      expect(window.getComputedStyle(defaultContentContainerElm!).display).toBe(
        'block',
      );
      act(() => jest.advanceTimersByTime(TRANSITION_DURATION_MS));
      expect(window.getComputedStyle(defaultContentContainerElm!).display).toBe(
        'none',
      );
    }

    jest.clearAllTimers();
  });

  it('Should display the Back button if an article is open', async () => {
    jest.useFakeTimers();

    const { queryByText } = render(
      <IntlProvider locale="en">
        <Help
          articleId={'1'}
          articleIdSetter={mockArticleIdSetter}
          onGetArticle={mockOnGetArticle}
          onArticleLoadingFailTryAgainButtonClick={
            mockOnArticleLoadingFailTryAgainButtonClick
          }
          onSearch={mockOnSearch}
          onSearchInputChanged={mockOnSearchInputChanged}
          onSearchInputCleared={mockOnSearchInputCleared}
          onSearchResultItemClick={mockOnSearchResultItemClick}
          searchExternalUrl={mockSearchExternalUrl}
          onSearchExternalUrlClick={mockOnSearchExternalUrlClick}
          onWasHelpfulYesButtonClick={mockOnWasHelpfulYesButtonClick}
          onWasHelpfulNoButtonClick={mockOnWasHelpfulNoButtonClick}
          onBackButtonClick={mockOnBackButtonClick}
        >
          <div>{defaultContentText}</div>
        </Help>
      </IntlProvider>,
    );

    // onGetArticle promise gets resolved after 100ms
    act(() => jest.advanceTimersByTime(100));

    // Wait until the fade-in transition of the back button finishes
    act(() => jest.advanceTimersByTime(TRANSITION_DURATION_MS));
    const BackButton = queryByText(messageBack)!.closest('button');
    expect(BackButton).not.toBeNull();

    // Once the article gets loaded
    if (BackButton) {
      fireEvent.click(BackButton);

      // Wait until the fade-out transition of the back button finishes
      act(() => jest.advanceTimersByTime(TRANSITION_DURATION_MS));

      await wait(() => expect(mockOnBackButtonClick).toHaveBeenCalledTimes(1));
    }

    jest.clearAllTimers();
  });
});
