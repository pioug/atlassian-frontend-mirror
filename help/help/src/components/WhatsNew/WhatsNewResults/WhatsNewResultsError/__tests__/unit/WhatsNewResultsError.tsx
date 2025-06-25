import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react';
import { createIntl, createIntlCache } from 'react-intl-next';

import { messages } from '../../../../../../messages';
import { WhatsNewResultsError } from '../../index';

// Messages
const cache = createIntlCache();
const intl = createIntl(
	{
		locale: 'en',
		messages: {},
	},
	cache,
);
const messageButtonLabel = intl.formatMessage(messages.help_search_error_button_label);

const mockOnSearch = jest.fn();

describe('WhatsNewResultsError', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<WhatsNewResultsError intl={intl} onSearch={mockOnSearch} />);

		await expect(container).toBeAccessible();
	});

	it('Should match snapshot', () => {
		const { asFragment } = render(<WhatsNewResultsError intl={intl} onSearch={mockOnSearch} />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('Should match snapshot', () => {
		const { queryByText } = render(<WhatsNewResultsError intl={intl} onSearch={mockOnSearch} />);

		const buttonLabel = queryByText(messageButtonLabel);
		expect(buttonLabel).not.toBeNull();

		if (buttonLabel) {
			const button = buttonLabel.closest('button');
			expect(button).not.toBeNull();

			if (button) {
				expect(mockOnSearch).toHaveBeenCalledTimes(0);
				fireEvent.click(button);
				expect(mockOnSearch).toHaveBeenCalledTimes(1);
			}
		}
	});
});
