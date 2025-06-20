import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axe } from '@af/accessibility-testing';

import { CreateButton } from '../../create-button';

describe('CreateButton', () => {
	it('should be accessible', async () => {
		const { container } = render(<CreateButton>Create</CreateButton>);

		await axe(container);
	});

	it('should be visible', () => {
		render(<CreateButton>Create</CreateButton>);

		expect(screen.getByRole('button', { name: 'Create' })).toBeVisible();
	});

	it('should trigger the `onClick` when clicked', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();

		render(<CreateButton onClick={onClick}>Create</CreateButton>);

		expect(onClick).toHaveBeenCalledTimes(0);

		await user.click(screen.getByRole('button'));
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
