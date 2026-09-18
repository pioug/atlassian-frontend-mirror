import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { EmailOption } from '../../../components/EmailOption/main';
import { type Email, EmailType } from '../../../types';

describe('EmailOption', () => {
	const email: Email = {
		type: EmailType,
		id: 'test@test.com',
		name: 'test@test.com',
		lozenge: 'EMAIL',
	};

	const renderEmailOption = (props: Partial<React.ComponentProps<typeof EmailOption>> = {}) =>
		render(
			<IntlProvider locale="en" messages={{}}>
				<EmailOption email={email} isSelected={false} emailValidity="VALID" {...props} />
			</IntlProvider>,
		);

	it('renders the default invite message', async () => {
		renderEmailOption();

		expect(screen.getByText(email.id)).toBeInTheDocument();
		expect(screen.getByTestId('user-picker-email-secondary-text')).toHaveTextContent(
			'Select an email address',
		);
		expect(screen.getByTestId('add-option-avatar-email-icon')).toBeInTheDocument();
		expect(screen.getByText('EMAIL')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('renders the same invite option for suggested emails', () => {
		renderEmailOption({ email: { ...email, suggestion: true } });

		expect(screen.getByText(email.id)).toBeInTheDocument();
		expect(screen.getByTestId('user-picker-email-secondary-text')).toHaveTextContent(
			'Select an email address',
		);
		expect(screen.getByTestId('add-option-avatar-email-icon')).toBeInTheDocument();
	});

	it('overrides the default label when one is supplied', () => {
		renderEmailOption({ label: 'Add new user' });

		expect(screen.getByText(email.id)).toBeInTheDocument();
		expect(screen.getByTestId('user-picker-email-secondary-text')).toHaveTextContent(
			'Add new user',
		);
		expect(screen.getByTestId('add-option-avatar-email-icon')).toHaveAttribute(
			'aria-label',
			'Add new user',
		);
	});
});
