import React from 'react';
import { createIntl, createIntlCache } from 'react-intl-next';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react';

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

	it('Match snapshot', () => {
		const { container } = render(
			<ArticleWasHelpfulYesButton isSelected={false} onClick={mockOnClick} intl={intl} />,
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	it('props methods "onWasHelpfulYesButtonClick" and "onClick" should be executed when the user click the button', () => {
		const { getByText } = render(
			<AnalyticsListener channel="help" onEvent={analyticsSpy}>
				<ArticleWasHelpfulYesButton isSelected={false} onClick={mockOnClick} intl={intl} />
			</AnalyticsListener>,
		);

		const buttonYes = getByText(messageYes).closest('button');
		expect(buttonYes).not.toBeNull;

		if (buttonYes) {
			fireEvent.click(buttonYes);
			expect(mockOnClick).toHaveBeenCalledTimes(1);
		}
	});
});
