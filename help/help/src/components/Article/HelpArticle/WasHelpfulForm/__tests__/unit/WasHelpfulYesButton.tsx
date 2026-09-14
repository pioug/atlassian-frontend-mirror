import React from 'react';
import { createIntl, createIntlCache } from 'react-intl';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';

import { ArticleWasHelpfulYesButton } from '../../WasHelpfulYesButton';

import { messages } from '../../../../../../messages';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';

// Messages
const cache = createIntlCache();
const intl = createIntl(
	{
		locale: 'en',
		messages: {},
	},
	cache,
);
const messageYes = intl.formatMessage(messages.help_article_rating_option_yes);

const mockOnClick = jest.fn();
const analyticsSpy = jest.fn();

describe('ArticleContent', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<ArticleWasHelpfulYesButton isSelected={false} onClick={mockOnClick} intl={intl} />,
		);

		await expect(container).toBeAccessible();
	});

	it('should render the yes button', async () => {
		render(<ArticleWasHelpfulYesButton isSelected={false} onClick={mockOnClick} intl={intl} />);
		expect(screen.getByText(messageYes)).toBeInTheDocument();
	});

	it('props methods "onWasHelpfulYesButtonClick" and "onClick" should be executed when the user click the button', async () => {
		render(
			<AnalyticsListener channel="help" onEvent={analyticsSpy}>
				<ArticleWasHelpfulYesButton isSelected={false} onClick={mockOnClick} intl={intl} />
			</AnalyticsListener>,
		);

		const buttonYes = screen.getByText(messageYes).closest('button');
		expect(buttonYes).not.toBeNull();

		if (buttonYes) {
			await userEvent.click(buttonYes);
			expect(mockOnClick).toHaveBeenCalledTimes(1);
		}
	});
});
