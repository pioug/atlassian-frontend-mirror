import React from 'react';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';
import { createIntl, createIntlCache } from 'react-intl';

import { messages } from '../../../../../messages';
import { SearchResultsError } from '../../SearchResultsError';

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

describe('SearchResultsError', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<SearchResultsError intl={intl} onSearch={mockOnSearch} />);

		await expect(container).toBeAccessible();
	});

	it('Should render the error state', async () => {
		render(<SearchResultsError intl={intl} onSearch={mockOnSearch} />);

		expect(screen.getByText(messageButtonLabel)).toBeInTheDocument();
	});

	it('Should display retry button and invoke onSearch when clicked', async () => {
		render(<SearchResultsError intl={intl} onSearch={mockOnSearch} />);

		const buttonLabel = screen.queryByText(messageButtonLabel);
		expect(buttonLabel).not.toBeNull();

		if (buttonLabel) {
			const button = buttonLabel.closest('button');
			expect(button).not.toBeNull();

			if (button) {
				expect(mockOnSearch).toHaveBeenCalledTimes(0);
				await userEvent.click(button);
				expect(mockOnSearch).toHaveBeenCalledTimes(1);
			}
		}
	});
});
