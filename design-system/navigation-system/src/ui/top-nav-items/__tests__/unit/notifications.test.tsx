import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axe } from '@af/accessibility-testing';

import { List } from '../../../../components/list';
import { Notifications } from '../../notifications';

describe('Notifications', () => {
	it('should be accessible', async () => {
		const { container } = render(
			<List>
				<Notifications badge={() => <div>100</div>} label="Your notifications" />
			</List>,
		);

		await axe(container);
	});

	it('should display a listitem', () => {
		render(<Notifications badge={() => <div>100</div>} label="Your notifications" />);

		expect(screen.getByRole('listitem', { hidden: true })).toBeInTheDocument();
	});

	it('should display a button', () => {
		render(<Notifications badge={() => <div>100</div>} label="Your notifications" />);

		expect(
			screen.getByRole('button', { name: 'Your notifications', hidden: true }),
		).toBeInTheDocument();
	});

	it('should display the badge', () => {
		render(<Notifications badge={() => <div>100</div>} label="Your notifications" />);

		expect(screen.getByText('100')).toBeInTheDocument();
	});

	it('should trigger the `onClick` when clicked', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();

		render(
			<Notifications badge={() => <div>100</div>} onClick={onClick} label="Your notifications" />,
		);

		expect(onClick).toHaveBeenCalledTimes(0);

		await user.click(screen.getByRole('button', { hidden: true }));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('should add the test id', () => {
		render(
			<Notifications badge={() => <div>100</div>} testId="test-id" label="Your notifications" />,
		);

		expect(screen.getByTestId('test-id')).toBeInTheDocument();
	});
});
