import React from 'react';
import { PDFPasswordInput } from '../../viewers/doc/pdfPasswordInput';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

describe('PDF Password Input Form', () => {
	it('should render form and submit the password successfully', async () => {
		const user = userEvent.setup();
		const password = '123';
		const handleSubmit = jest.fn();
		render(
			<IntlProvider locale="en">
				<PDFPasswordInput onSubmit={handleSubmit} />
			</IntlProvider>,
		);

		const passwordInput = screen.getByLabelText(/password/i);
		const submitButton = screen.getByRole('button');

		// Check if both input and button exists
		expect(passwordInput).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();

		// Perform password input
		await user.type(passwordInput, '123');
		await user.click(submitButton);

		// Check if the password that is submitted is correct
		expect(handleSubmit.mock.calls[0][0].password).toEqual(password);
	});

	it('should see the error message when incorrect password is inputted and focus is back on the textfield', async () => {
		const user = userEvent.setup();

		// Error result is dictated by the parent, we can directly check the error state by passing the passwordError props without the need to test user activity
		render(
			<IntlProvider locale="en">
				<PDFPasswordInput onSubmit={jest.fn()} hasPasswordError={true} />
			</IntlProvider>,
		);
		const passwordInput = screen.getByLabelText(/password/i);
		const submitButton = screen.getByRole('button');
		const errorMessage = screen.getByText(/incorrect password\. please try again\./i);

		// Check if both input, button exists and error message is visible
		expect(passwordInput).toBeInTheDocument();
		expect(passwordInput).toHaveFocus();
		expect(submitButton).toBeInTheDocument();
		expect(errorMessage).toBeInTheDocument();

		// Check that the error should disappear when user type
		await user.type(passwordInput, '1');
		expect(errorMessage).not.toBeInTheDocument();
	});
});
