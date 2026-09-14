import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@atlassian/testing-library/render';
import { IntlProvider } from 'react-intl';

import { getMockWhatsNewArticleItemList } from '../../../../../../util/testing/mock';

import WhatsNewResultsList from '../../WhatsNewResultsList';
import { type WhatsNewResultsList as WhatsNewResultsListInterface } from '../../model/WhatsNewResultsList';

const mockOnWhatsNewArticleItemClick = jest.fn();
const mockOnShowMoreButtonClick = jest.fn();

describe('WhatsNewResultsList', () => {
	it('renders without crashing', async () => {
		const props: WhatsNewResultsListInterface = {
			whatsNewArticles: getMockWhatsNewArticleItemList(10),
			onWhatsNewResultItemClick: mockOnWhatsNewArticleItemClick,
			onShowMoreButtonClick: mockOnShowMoreButtonClick,
		};
		const { container } = render(
			<IntlProvider locale="en">
				<WhatsNewResultsList {...props} />
			</IntlProvider>,
		);
		expect(container.firstChild).not.toBeNull();
		await expect(container).toBeAccessible();
	});
});
