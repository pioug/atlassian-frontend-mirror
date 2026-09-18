import React from 'react';

import { IntlProvider } from 'react-intl';

// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@atlassian/testing-library/render';

import { getMockArticleItemList } from '../../../../util/testing/mock';
import ArticlesList from '../../ArticlesList';
import { type ArticlesList as ArticlesListInterface } from '../../model/ArticlesListItem';

const mockOnArticlesListItemClick = jest.fn();
const mockOnToggleArticlesList = jest.fn();

describe('ArticleContent', () => {
	it('renders without crashing', async () => {
		const props: ArticlesListInterface = {
			articles: getMockArticleItemList(10),
			onArticlesListItemClick: mockOnArticlesListItemClick,
			onToggleArticlesList: mockOnToggleArticlesList,
		};
		const { container } = render(
			<IntlProvider locale="en">
				<ArticlesList {...props} />
			</IntlProvider>,
		);
		expect(container.firstChild).not.toBeNull();
		await expect(container).toBeAccessible();
	});
});
