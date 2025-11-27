import React from 'react';

import { act, render, screen, userEvent } from '@atlassian/testing-library';

import { List } from '../../../../components/list';
import { Notifications } from '../../notifications';

const createUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

describe('Notifications', () => {
	beforeEach(() => {
		// Mocking timers to avoid waiting for tooltips to appear
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should be accessible', async () => {
		const { container } = render(
			<List>
				<Notifications badge={() => <div>100</div>} label="Your notifications" />
			</List>,
		);

		await expect(container).toBeAccessible();
	});

	it('should display a listitem', () => {
		render(<Notifications badge={() => <div>100</div>} label="Your notifications" />);

		expect(screen.getByRole('listitem')).toBeInTheDocument();
	});

	it('should display a button', () => {
		render(<Notifications badge={() => <div>100</div>} label="Your notifications" />);

		expect(screen.getByRole('button', { name: 'Your notifications' })).toBeInTheDocument();
	});

	it('should display the badge', () => {
		render(<Notifications badge={() => <div>100</div>} label="Your notifications" />);

		expect(screen.getByText('100')).toBeInTheDocument();
	});

	it('should trigger the `onClick` when clicked', async () => {
		const user = createUser();
		const onClick = jest.fn();

		render(
			<Notifications badge={() => <div>100</div>} onClick={onClick} label="Your notifications" />,
		);

		expect(onClick).toHaveBeenCalledTimes(0);

		await user.click(screen.getByRole('button'));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('should add the test id', () => {
		render(
			<Notifications badge={() => <div>100</div>} testId="test-id" label="Your notifications" />,
		);

		expect(screen.getByTestId('test-id')).toBeInTheDocument();
	});

	it('should support displaying a shortcut in the tooltip', async () => {
		const user = createUser();

		render(
			<Notifications
				badge={() => <div>100</div>}
				shortcut={['⌘', 'N']}
				label="Your notifications"
			/>,
		);

		await user.hover(screen.getByRole('button'));
		act(() => {
			jest.runAllTimers();
		});

		expect(screen.getByRole('tooltip', { name: 'Your notifications ⌘ N' })).toBeInTheDocument();
	});
});
