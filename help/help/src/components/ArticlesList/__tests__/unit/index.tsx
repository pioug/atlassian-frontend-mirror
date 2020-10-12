import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { getMockArticleItemList } from '../../../../util/testing/mock';

import ArticlesList from '../../ArticlesList';
import { ArticlesList as ArticlesListInterface } from '../../model/ArticlesListItem';

const mockOnArticlesListItemClick = jest.fn();
const mockOnToggleArticlesList = jest.fn();
let ArticlesListProps: Partial<ArticlesListInterface>;

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
});
