import React from 'react';

import { act, render, screen, userEvent } from '@atlassian/testing-library';

import { List } from '../../../../components/list';
import { Help } from '../../help';

const createUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

describe('Help', () => {
	beforeEach(() => {
		// Mocking timers to avoid waiting for tooltips to appear
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	describe('when there is no badge', () => {
		it('should be accessible', async () => {
			const { container } = render(
				<List>
					<Help label="Help button" />
				</List>,
			);

			await expect(container).toBeAccessible();
		});

		it('should display a listitem', () => {
			render(<Help label="Help button" />);

			expect(screen.getByRole('listitem')).toBeInTheDocument();
		});

		it('should display a button', () => {
			render(<Help label="Help button" />);

			expect(screen.getByRole('button', { name: 'Help button' })).toBeInTheDocument();
		});

		it('should trigger the `onClick` when clicked', async () => {
			const user = createUser();
			const onClick = jest.fn();

			render(<Help label="Help button" onClick={onClick} />);

			expect(onClick).toHaveBeenCalledTimes(0);

			await user.click(screen.getByRole('button'));
			expect(onClick).toHaveBeenCalledTimes(1);
		});

		it('should add the test id', () => {
			render(<Help label="Help button" testId="test-id" />);

			expect(screen.getByTestId('test-id')).toBeInTheDocument();
		});
	});

	describe('when there is a badge', () => {
		it('should be accessible', async () => {
			const { container } = render(
				<List>
					<Help label="Help button" badge={() => <div>100</div>} />
				</List>,
			);

			await expect(container).toBeAccessible();
		});

		it('should display a listitem', () => {
			render(<Help label="Help button" badge={() => <div>100</div>} />);

			expect(screen.getByRole('listitem')).toBeInTheDocument();
		});

		it('should display a button', () => {
			render(<Help label="Help button" />);

			expect(screen.getByRole('button', { name: 'Help button' })).toBeInTheDocument();
		});

		it('should display the badge', () => {
			render(<Help label="Help button" badge={() => <div>100</div>} />);

			expect(screen.getByText('100')).toBeInTheDocument();
		});

		it('should trigger the `onClick` when clicked', async () => {
			const user = createUser();
			const onClick = jest.fn();

			render(<Help label="Help button" onClick={onClick} badge={() => <div>100</div>} />);

			expect(onClick).toHaveBeenCalledTimes(0);

			await user.click(screen.getByRole('button'));
			expect(onClick).toHaveBeenCalledTimes(1);
		});

		it('should add the test id', () => {
			render(<Help label="Help button" badge={() => <div>100</div>} testId="test-id" />);

			expect(screen.getByTestId('test-id')).toBeInTheDocument();
		});
	});

	it('should support displaying a shortcut in the tooltip', async () => {
		const user = createUser();

		render(<Help label="Help button" shortcut={['⌘', 'H']} />);

		await user.hover(screen.getByRole('button'));
		act(() => {
			jest.runAllTimers();
		});

		expect(screen.getByRole('tooltip', { name: 'Help button ⌘ H' })).toBeInTheDocument();
	});
});
