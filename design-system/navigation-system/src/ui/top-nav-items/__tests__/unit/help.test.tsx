import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axe } from '@af/accessibility-testing';

import { List } from '../../../../components/list';
import { Help } from '../../help';

describe('Help', () => {
	describe('when there is no badge', () => {
		it('should be accessible', async () => {
			const { container } = render(
				<List>
					<Help label="Help button" />
				</List>,
			);

			await axe(container);
		});

		it('should display a listitem', () => {
			render(<Help label="Help button" />);

			expect(screen.getByRole('listitem', { hidden: true })).toBeInTheDocument();
		});

		it('should display a button', () => {
			render(<Help label="Help button" />);

			expect(screen.getByRole('button', { name: 'Help button', hidden: true })).toBeInTheDocument();
		});

		it('should trigger the `onClick` when clicked', async () => {
			const user = userEvent.setup();
			const onClick = jest.fn();

			render(<Help label="Help button" onClick={onClick} />);

			expect(onClick).toHaveBeenCalledTimes(0);

			await user.click(screen.getByRole('button', { hidden: true }));
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

			await axe(container);
		});

		it('should display a listitem', () => {
			render(<Help label="Help button" badge={() => <div>100</div>} />);

			expect(screen.getByRole('listitem', { hidden: true })).toBeInTheDocument();
		});

		it('should display a button', () => {
			render(<Help label="Help button" />);

			expect(screen.getByRole('button', { name: 'Help button', hidden: true })).toBeInTheDocument();
		});

		it('should display the badge', () => {
			render(<Help label="Help button" badge={() => <div>100</div>} />);

			expect(screen.getByText('100')).toBeInTheDocument();
		});

		it('should trigger the `onClick` when clicked', async () => {
			const user = userEvent.setup();
			const onClick = jest.fn();

			render(<Help label="Help button" onClick={onClick} badge={() => <div>100</div>} />);

			expect(onClick).toHaveBeenCalledTimes(0);

			await user.click(screen.getByRole('button', { hidden: true }));
			expect(onClick).toHaveBeenCalledTimes(1);
		});

		it('should add the test id', () => {
			render(<Help label="Help button" badge={() => <div>100</div>} testId="test-id" />);

			expect(screen.getByTestId('test-id')).toBeInTheDocument();
		});
	});
});
