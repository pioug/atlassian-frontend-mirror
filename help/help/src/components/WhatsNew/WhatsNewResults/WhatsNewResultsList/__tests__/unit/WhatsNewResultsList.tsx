import React from 'react';

import { IntlProvider } from 'react-intl';

// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@atlassian/testing-library/render';

import { getMockWhatsNewArticleItemList } from '../../../../../../util/testing/mock';
import { type WhatsNewResultsList as WhatsNewResultsListInterface } from '../../model/WhatsNewResultsList';
import WhatsNewResultsList from '../../WhatsNewResultsList';

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
