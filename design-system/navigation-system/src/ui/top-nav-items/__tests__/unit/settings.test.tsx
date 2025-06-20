import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axe } from '@af/accessibility-testing';

import { List } from '../../../../components/list';
import { Settings } from '../../settings';

describe('Settings', () => {
	it('should be accessible', async () => {
		const { container } = render(
			<List>
				<Settings label="Settings" />
			</List>,
		);

		await axe(container);
	});

	it('should display a listitem', () => {
		render(<Settings label="Settings" />);

		expect(screen.getByRole('listitem', { hidden: true })).toBeInTheDocument();
	});

	it('should display a button', () => {
		render(<Settings label="Settings" />);

		expect(screen.getByRole('button', { name: 'Settings', hidden: true })).toBeInTheDocument();
	});

	it('should trigger the `onClick` when clicked', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();

		render(<Settings label="Settings" onClick={onClick} />);

		expect(onClick).toHaveBeenCalledTimes(0);

		await user.click(screen.getByRole('button', { hidden: true }));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('should add the test id', () => {
		render(<Settings label="Settings" testId="test-id" />);

		expect(screen.getByTestId('test-id')).toBeInTheDocument();
	});
});
