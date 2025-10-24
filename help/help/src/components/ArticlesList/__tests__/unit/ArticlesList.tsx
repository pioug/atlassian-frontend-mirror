import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { getMockArticleItemList } from '../../../../util/testing/mock';

import ArticlesList from '../../ArticlesList';
import { type ArticlesList as ArticlesListInterface } from '../../model/ArticlesListItem';

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

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<ArticlesList {...ArticlesListProps} minItemsToDisplay={3} numberOfArticlesToDisplay={6} />
			</IntlProvider>,
		);

		await expect(container).toBeAccessible();
	});

	it.skip('Should match snapshot', () => {
		const { container } = render(
			<IntlProvider locale="en">
				<ArticlesList {...ArticlesListProps} />
			</IntlProvider>,
		);

		expect(container.firstChild).toMatchSnapshot();
	});
});
