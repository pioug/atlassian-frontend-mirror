import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import {
  getMockArticleItem,
  getMockArticleItemList,
} from '../../../../util/testing/mock';

import ArticlesList from '../../ArticlesList';
import { ArticlesList as ArticlesListInterface } from '../../model/ArticlesListItem';

const mockOnArticlesListItemClick = jest.fn();
const mockOnToggleArticlesList = jest.fn();
let ArticlesListProps: Partial<ArticlesListInterface>;
const mockArticleListItem = getMockArticleItem('1');

describe('ArticleContent', () => {
  beforeEach(() => {
    ArticlesListProps = {
      articles: getMockArticleItemList(10),
      onArticlesListItemClick: mockOnArticlesListItemClick,
      onToggleArticlesList: mockOnToggleArticlesList,
    };
  });

  it('Should match snapshot', () => {
    const { container } = render(
      <IntlProvider locale="en">
        <ArticlesList {...ArticlesListProps} />
      </IntlProvider>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('If the number of articles to display is > than the min number of articles, the collapsable part of the list should have a hight === "auto" ', () => {
    const { getAllByText } = render(
      <IntlProvider locale="en">
        <ArticlesList
          {...ArticlesListProps}
          minItemsToDisplay={3}
          numberOfArticlesToDisplay={6}
        />
      </IntlProvider>,
    );

    const fistButtonAfterMinItemToDisplay = getAllByText(
      mockArticleListItem.title,
    )[4].closest('a');

    if (fistButtonAfterMinItemToDisplay != null) {
      const divWrapper = fistButtonAfterMinItemToDisplay.closest('div');
      const collapsableList = divWrapper ? divWrapper.parentElement : null;

      if (collapsableList) {
        expect(window.getComputedStyle(collapsableList).height).toBe('auto');
      }
    }

    expect(fistButtonAfterMinItemToDisplay).not.toBeNull();
  });

  it('If the number of articles to display is =< than the min number of articles, the collapsable part of the list should have a hight === "0px" ', () => {
    const { getAllByText } = render(
      <IntlProvider locale="en">
        <ArticlesList
          {...ArticlesListProps}
          minItemsToDisplay={3}
          numberOfArticlesToDisplay={3}
        />
      </IntlProvider>,
    );

    const fistButtonAfterMinItemToDisplay = getAllByText(
      mockArticleListItem.title,
    )[4].closest('a');

    if (fistButtonAfterMinItemToDisplay != null) {
      const divWrapper = fistButtonAfterMinItemToDisplay.closest('div');
      const collapsableList = divWrapper ? divWrapper.parentElement : null;

      if (collapsableList) {
        expect(window.getComputedStyle(collapsableList).height).toBe('0px');
      }
    }

    expect(fistButtonAfterMinItemToDisplay).not.toBeNull();
  });
});
