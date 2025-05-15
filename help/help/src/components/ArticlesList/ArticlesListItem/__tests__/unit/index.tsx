import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { createIntl, createIntlCache } from 'react-intl-next';

import { getMockArticleItem } from '../../../../../util/testing/mock';

import { ArticlesListItem } from '../../index';
import { messages } from '../../../../../messages';

// Messages
const cache = createIntlCache();
const intl = createIntl(
	{
		locale: 'en',
		messages: {},
	},
	cache,
);
const messageTypeHelpArticle = intl.formatMessage(
	messages.help_article_list_item_type_help_article,
);

const mockArticleItem = getMockArticleItem('1');
const mockOnClick = jest.fn();
const analyticsSpy = jest.fn();

describe('ArticlesListItem', () => {
	it.skip('Should match snapshot', () => {
		const { container } = render(
			<ArticlesListItem intl={intl} {...mockArticleItem} onClick={mockOnClick} />,
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	it(`Should not display any type text if the type isn't defined `, () => {
		const { queryByText } = render(
			<ArticlesListItem intl={intl} {...mockArticleItem} onClick={mockOnClick} />,
		);

		const TypeHelpArticleElm = queryByText(messageTypeHelpArticle);

		expect(TypeHelpArticleElm).toBeNull();
	});

	// For now we are not going to show the ArticlesListItem type title
	// it(`Should display the text ${messageTypeHelpArticle} if the type is "topicInProduct" `, () => {
	//   const { queryByText } = render(
	//     <ArticlesListItem
	//       intl={intl}
	//       {...mockArticleItem}
	//       onClick={mockOnClick}
	//       type={ARTICLE_ITEM_TYPES.topicInProduct}
	//     />,
	//   );

	//   const TypeHelpArticleElm = queryByText(messageTypeHelpArticle);

	//   expect(TypeHelpArticleElm).not.toBeNull();
	// });

	it('should render the title as a level 3 heading', () => {
		const { getByRole } = render(
			<ArticlesListItem intl={intl} {...mockArticleItem} onClick={mockOnClick} />,
		);

		const heading = getByRole('heading', { level: 3 });
		expect(heading).toBeVisible();
		expect(heading).toHaveTextContent(mockArticleItem.title);
	});

	it(`mockOnClick should be executed when the user clicks in the component`, () => {
		const { queryByRole } = render(
			<AnalyticsListener channel="help" onEvent={analyticsSpy}>
				<ArticlesListItem intl={intl} {...mockArticleItem} onClick={mockOnClick} />
			</AnalyticsListener>,
		);

		const button = queryByRole('button');

		expect(button).not.toBeNull();
		if (button) {
			expect(mockOnClick).toHaveBeenCalledTimes(0);
			fireEvent.click(button);
			expect(mockOnClick).toHaveBeenCalledTimes(1);
		}
	});
});
