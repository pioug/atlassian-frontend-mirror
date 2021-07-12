import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, wait, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import {
  getMockArticleItemList,
  getMockArticleItem,
} from '../../../../util/testing/mock';
import { messages } from '../../../../messages';

import RelatedArticles from '../../index';
import { ArticleItem } from '../../../../model/Article';

const intlProvider = new IntlProvider({ locale: 'en' });
const { intl } = intlProvider.getChildContext();
const messageEndpointErrorTitle = intl.formatMessage(
  messages.help_related_article_endpoint_error_title,
);
const messageEndpointErrorDescription = intl.formatMessage(
  messages.help_related_article_endpoint_error_description,
);
const messageEndpointErrorButtonLabel = intl.formatMessage(
  messages.help_related_article_endpoint_error_button_label,
);
const messageTitle = intl.formatMessage(messages.help_related_article_title);
const messageShowMore = intl.formatMessage(
  messages.help_show_more_button_label_more,
  { numberOfItemsLeft: '2', itemsType: 'articles' },
);
const messageLoading = intl.formatMessage(messages.help_loading);

const NUMBER_OF_ARTICLES = 5;
const mockArticleItem = getMockArticleItem('1');
const relativeArticlesPromise: (
  numberOfItems: number,
) => Promise<ArticleItem[]> = (numberOfItems = 0) =>
  new Promise((resolve, reject) => {
    if (numberOfItems > 0) {
      setTimeout(() => {
        resolve(getMockArticleItemList(numberOfItems));
      }, 100);
    } else {
      reject('error');
    }
  });

const mockOnGetRelatedArticles = jest
  .fn()
  .mockImplementation(relativeArticlesPromise);
const mockOnRelatedArticlesListItemClick = jest.fn();
const mockOnRelatedArticlesShowMoreClick = jest.fn();

describe('RelatedArticles', () => {
  jest.useFakeTimers();

  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should match snapshot', async () => {
    const { container } = render(
      <IntlProvider locale="en">
        <RelatedArticles
          routeGroup="test"
          routeName="test"
          onGetRelatedArticles={() =>
            mockOnGetRelatedArticles(NUMBER_OF_ARTICLES)
          }
          onRelatedArticlesListItemClick={mockOnRelatedArticlesListItemClick}
          onRelatedArticlesShowMoreClick={mockOnRelatedArticlesShowMoreClick}
        />
      </IntlProvider>,
    );

    jest.advanceTimersByTime(200);

    await wait(() => expect(mockOnGetRelatedArticles).toHaveBeenCalled());

    expect(container.firstChild).toMatchSnapshot();
  });

  it('Should request the related article on the first render', async () => {
    render(
      <IntlProvider locale="en">
        <RelatedArticles
          routeGroup="test"
          routeName="test"
          onGetRelatedArticles={() =>
            mockOnGetRelatedArticles(NUMBER_OF_ARTICLES)
          }
          onRelatedArticlesListItemClick={mockOnRelatedArticlesListItemClick}
          onRelatedArticlesShowMoreClick={mockOnRelatedArticlesShowMoreClick}
        />
      </IntlProvider>,
    );

    jest.advanceTimersByTime(200);

    await wait(() => expect(mockOnGetRelatedArticles).toHaveBeenCalled());

    expect(mockOnGetRelatedArticles).toHaveBeenCalledTimes(1);
  });

  it('Should show loading state', () => {
    const { getByLabelText } = render(
      <IntlProvider locale="en">
        <RelatedArticles
          routeGroup="test"
          routeName="test"
          onGetRelatedArticles={() =>
            mockOnGetRelatedArticles(NUMBER_OF_ARTICLES)
          }
          onRelatedArticlesListItemClick={mockOnRelatedArticlesListItemClick}
          onRelatedArticlesShowMoreClick={mockOnRelatedArticlesShowMoreClick}
        />
      </IntlProvider>,
    );

    wait(() => expect(mockOnGetRelatedArticles).toHaveBeenCalled());

    expect(getByLabelText(messageLoading)).not.toBeNull();
  });

  it('Should display the related articles', async () => {
    const { getAllByText } = render(
      <IntlProvider locale="en">
        <RelatedArticles
          routeGroup="test"
          routeName="test"
          onGetRelatedArticles={() =>
            mockOnGetRelatedArticles(NUMBER_OF_ARTICLES)
          }
          onRelatedArticlesListItemClick={mockOnRelatedArticlesListItemClick}
          onRelatedArticlesShowMoreClick={mockOnRelatedArticlesShowMoreClick}
        />
      </IntlProvider>,
    );

    jest.advanceTimersByTime(200);

    await wait(() => expect(mockOnGetRelatedArticles).toHaveBeenCalled());

    expect(getAllByText(mockArticleItem.title).length).toBeGreaterThan(0);
  });

  it('Should execute "onRelatedArticlesListItemClick" when the user clicks one of the list items', async () => {
    const { getAllByText } = render(
      <IntlProvider locale="en">
        <RelatedArticles
          routeGroup="test"
          routeName="test"
          onGetRelatedArticles={() =>
            mockOnGetRelatedArticles(NUMBER_OF_ARTICLES)
          }
          onRelatedArticlesListItemClick={mockOnRelatedArticlesListItemClick}
          onRelatedArticlesShowMoreClick={mockOnRelatedArticlesShowMoreClick}
        />
      </IntlProvider>,
    );

    jest.advanceTimersByTime(200);

    await wait(() => expect(mockOnGetRelatedArticles).toHaveBeenCalled());

    const firstItem = getAllByText(mockArticleItem.title)[0].closest('a');

    expect(firstItem).not.toBeNull();

    if (firstItem) {
      expect(mockOnRelatedArticlesListItemClick).toHaveBeenCalledTimes(0);
      fireEvent.click(firstItem);
      expect(mockOnRelatedArticlesListItemClick).toHaveBeenCalledTimes(1);
    }
  });

  it('Should execute "mockOnRelatedArticlesShowMoreClick" when the user clicks the "Show more" button', async () => {
    const { getByText } = render(
      <IntlProvider locale="en">
        <RelatedArticles
          routeGroup="test"
          routeName="test"
          onGetRelatedArticles={() =>
            mockOnGetRelatedArticles(NUMBER_OF_ARTICLES)
          }
          onRelatedArticlesListItemClick={mockOnRelatedArticlesListItemClick}
          onRelatedArticlesShowMoreClick={mockOnRelatedArticlesShowMoreClick}
        />
      </IntlProvider>,
    );

    jest.advanceTimersByTime(200);

    await wait(() => expect(mockOnGetRelatedArticles).toHaveBeenCalled());

    const showMoreButton = getByText(messageShowMore).closest('button');

    expect(showMoreButton).not.toBeNull();

    if (showMoreButton) {
      expect(mockOnRelatedArticlesShowMoreClick).toHaveBeenCalledTimes(0);
      fireEvent.click(showMoreButton);
      expect(mockOnRelatedArticlesShowMoreClick).toHaveBeenCalledTimes(1);
    }
  });

  it('Should display the style 1 by default', async () => {
    const { queryByText } = render(
      <IntlProvider locale="en">
        <RelatedArticles
          routeGroup="test"
          routeName="test"
          onGetRelatedArticles={() =>
            mockOnGetRelatedArticles(NUMBER_OF_ARTICLES)
          }
          onRelatedArticlesListItemClick={mockOnRelatedArticlesListItemClick}
          onRelatedArticlesShowMoreClick={mockOnRelatedArticlesShowMoreClick}
        />
      </IntlProvider>,
    );

    jest.advanceTimersByTime(200);

    await wait(() => expect(mockOnGetRelatedArticles).toHaveBeenCalled());

    expect(queryByText(messageTitle)).toBeNull();
  });

  it('Should display the style 2 when style="secondary"', async () => {
    const { getByText } = render(
      <IntlProvider locale="en">
        <RelatedArticles
          style="secondary"
          routeGroup="test"
          routeName="test"
          onGetRelatedArticles={() =>
            mockOnGetRelatedArticles(NUMBER_OF_ARTICLES)
          }
          onRelatedArticlesListItemClick={mockOnRelatedArticlesListItemClick}
          onRelatedArticlesShowMoreClick={mockOnRelatedArticlesShowMoreClick}
        />
      </IntlProvider>,
    );

    jest.advanceTimersByTime(200);

    await wait(() => expect(mockOnGetRelatedArticles).toHaveBeenCalled());

    expect(getByText(messageTitle)).not.toBeNull();
  });

  it('It should display the error text if the onGetRelatedArticles fails', async () => {
    const { queryByText } = render(
      <IntlProvider locale="en">
        <RelatedArticles
          routeGroup="test"
          routeName="test"
          onGetRelatedArticles={() => mockOnGetRelatedArticles(0)}
          onRelatedArticlesListItemClick={mockOnRelatedArticlesListItemClick}
          onRelatedArticlesShowMoreClick={mockOnRelatedArticlesShowMoreClick}
        />
      </IntlProvider>,
    );

    jest.advanceTimersByTime(200);

    await wait(() => expect(mockOnGetRelatedArticles).toHaveBeenCalled());

    expect(queryByText(messageEndpointErrorTitle)).not.toBeNull();
    expect(queryByText(messageEndpointErrorDescription)).not.toBeNull();
  });

  it('If display the error screen and the user clicks the button "try again", It should execute onGetRelatedArticles again', async () => {
    const { queryByText, getByText } = render(
      <IntlProvider locale="en">
        <RelatedArticles
          routeGroup="test"
          routeName="test"
          onGetRelatedArticles={() => mockOnGetRelatedArticles(0)}
          onRelatedArticlesListItemClick={mockOnRelatedArticlesListItemClick}
          onRelatedArticlesShowMoreClick={mockOnRelatedArticlesShowMoreClick}
        />
      </IntlProvider>,
    );
    expect(mockOnGetRelatedArticles).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(200);

    await wait(() => expect(mockOnGetRelatedArticles).toHaveBeenCalled());

    expect(queryByText(messageEndpointErrorTitle)).not.toBeNull();
    expect(queryByText(messageEndpointErrorDescription)).not.toBeNull();

    const tryAgainButton = getByText(messageEndpointErrorButtonLabel).closest(
      'button',
    );

    expect(tryAgainButton).not.toBeNull();
    if (tryAgainButton) {
      expect(mockOnGetRelatedArticles).toHaveBeenCalledTimes(1);
      fireEvent.click(tryAgainButton);
      expect(mockOnGetRelatedArticles).toHaveBeenCalledTimes(2);
    }
  });
});
