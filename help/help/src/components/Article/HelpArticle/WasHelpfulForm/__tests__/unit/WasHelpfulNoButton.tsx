import React from 'react';
import { createIntl, createIntlCache } from 'react-intl';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';

import { messages } from '../../../../../../messages';

import { ArticleWasHelpfulNoButton } from '../../WasHelpfulNoButton';

// Messages
const cache = createIntlCache();
const intl = createIntl(
	{
		locale: 'en',
		messages: {},
	},
	cache,
);
const messageNo = intl.formatMessage(messages.help_article_rating_option_no);

const mockOnClick = jest.fn();
const analyticsSpy = jest.fn();

describe('ArticleContent', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<ArticleWasHelpfulNoButton isSelected={false} onClick={mockOnClick} intl={intl} />,
		);

		await expect(container).toBeAccessible();
	});

	it('should render the no button', async () => {
		render(<ArticleWasHelpfulNoButton isSelected={false} onClick={mockOnClick} intl={intl} />);

		expect(screen.getByText(messageNo)).toBeInTheDocument();
	});

	it('props methods "onWasHelpfulNoButtonClick" and "onClick" should be executed when the user click the button', async () => {
		render(
			<AnalyticsListener channel="help" onEvent={analyticsSpy}>
				<ArticleWasHelpfulNoButton isSelected={false} onClick={mockOnClick} intl={intl} />
			</AnalyticsListener>,
		);

		const buttonNo = screen.getByText(messageNo).closest('button');
		expect(buttonNo).not.toBeNull();

		if (buttonNo) {
			await userEvent.click(buttonNo);
			expect(mockOnClick).toHaveBeenCalledTimes(1);
		}
	});
});
