import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { createIntl, createIntlCache } from 'react-intl-next';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';

import { messages } from '../../../../../messages';

import { ArticleLoadingFail } from '../../index';

// Messages
const cache = createIntlCache();
const intl = createIntl(
	{
		locale: 'en',
		messages: {},
	},
	cache,
);
const messageButtonLabel = intl.formatMessage(messages.help_article_error_button_label);

const mockOnTryAgainButtonClick = jest.fn();
const analyticsSpy = jest.fn();

describe('ArticleLoadingFail', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<AnalyticsListener channel="help" onEvent={analyticsSpy}>
				<ArticleLoadingFail onTryAgainButtonClick={mockOnTryAgainButtonClick} intl={intl} />
			</AnalyticsListener>,
		);

		await expect(container).toBeAccessible();
	});

	it.skip('Should match snapshot', () => {
		const { container } = render(
			<AnalyticsListener channel="help" onEvent={analyticsSpy}>
				<ArticleLoadingFail onTryAgainButtonClick={mockOnTryAgainButtonClick} intl={intl} />
			</AnalyticsListener>,
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	it('it should call handleOnClick when the user click the loading error button', () => {
		const { getByText } = render(
			<AnalyticsListener channel="help" onEvent={analyticsSpy}>
				<ArticleLoadingFail onTryAgainButtonClick={mockOnTryAgainButtonClick} intl={intl} />
			</AnalyticsListener>,
		);

		const buttonTryAgain = getByText(messageButtonLabel).closest('button');
		expect(buttonTryAgain).not.toBeNull;

		if (buttonTryAgain) {
			fireEvent.click(buttonTryAgain);
			expect(mockOnTryAgainButtonClick).toHaveBeenCalledTimes(1);
		}
	});
});
