import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axe } from '@af/accessibility-testing';

import { List } from '../../../../components/list';
import { Profile } from '../../profile';

describe('Profile', () => {
	it('should be accessible', async () => {
		const { container } = render(
			<List>
				<Profile label="Profile settings" />
			</List>,
		);

		await axe(container);
	});

	it('should display a listitem', () => {
		render(<Profile label="Profile settings" />);

		expect(screen.getByRole('listitem', { hidden: true })).toBeInTheDocument();
	});

	it('should display a button', () => {
		render(<Profile label="Profile settings" />);

		expect(
			screen.getByRole('button', { name: 'Profile settings', hidden: true }),
		).toBeInTheDocument();
	});

	it('should trigger the `onClick` when clicked', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();

		render(<Profile onClick={onClick} label="Profile settings" />);

		expect(onClick).toHaveBeenCalledTimes(0);

		await user.click(screen.getByRole('button', { hidden: true }));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('should display the profile avatar', () => {
		render(<Profile src="https://example.com/avatar.png" label="Profile settings" />);

		expect(screen.getByRole('presentation', { hidden: true })).toBeInTheDocument();
	});

	it('should display a fallback avatar icon when src is not provided', () => {
		render(<Profile label="Profile settings" />);

		expect(screen.getByRole('presentation', { hidden: true })).toBeInTheDocument();
	});

	it('should add the test id', () => {
		render(<Profile testId="test-id" label="Profile settings" />);

		expect(screen.getByTestId('test-id')).toBeInTheDocument();
	});
});
