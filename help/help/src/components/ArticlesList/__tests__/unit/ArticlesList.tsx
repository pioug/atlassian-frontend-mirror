/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

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
