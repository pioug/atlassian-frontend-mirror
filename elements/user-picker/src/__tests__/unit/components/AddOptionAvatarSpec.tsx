import React from 'react';

import { render, screen } from '@testing-library/react';

import { AddOptionAvatar } from '../../../components/AddOptionAvatar';

describe('AddOptionAvatar', () => {
	it('renders an email icon with the supplied label', async () => {
		render(<AddOptionAvatar label="Invite" isLozenge={false} />);

		const inviteIcon = screen.getByTestId('add-option-avatar-email-icon');

		expect(inviteIcon).toBeInTheDocument();
		expect(inviteIcon).toHaveAttribute('aria-label', 'Invite');
		await expect(document.body).toBeAccessible();
	});
});
