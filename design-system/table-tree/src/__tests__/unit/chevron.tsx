import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Chevron from '../../components/internal/chevron';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Chevron', () => {
	const controlledId = 'controlled_element_id';

	it('should have aria-controls when expanded', () => {
		render(
			<div>
				<Chevron isExpanded={true} ariaControls={controlledId} rowId="1" />,
				<div id={controlledId}>Element</div>
			</div>,
		);

		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute('aria-controls', controlledId);
	});

	it('should give context of the row ID in the label', () => {
		render(<Chevron rowId="100" />);

		expect(screen.getByRole('button', { name: 'Expand 100' })).toBeInTheDocument();
	});

	it('should give context of the row content in the label', () => {
		render(<Chevron rowId="1" extendedLabel="Chapter 1: Clean Code" />);

		expect(
			screen.getByRole('button', { name: 'Expand Chapter 1: Clean Code' }),
		).toBeInTheDocument();
	});

	it('should use only the expand or collapse label when there is no row context', () => {
		const { rerender } = render(<Chevron rowId="" />);
		expect(screen.getByRole('button', { name: 'Expand' })).toBeInTheDocument();

		rerender(<Chevron rowId="" isExpanded />);
		expect(screen.getByRole('button', { name: 'Collapse' })).toBeInTheDocument();
	});

	test('expanded', () => {
		render(<Chevron isExpanded={true} rowId="1" />);

		const chevronLeftIconLabel = screen.queryByText(/Expand/);
		const chevronRightIconLabel = screen.getByText(/Collapse/);

		expect(chevronLeftIconLabel).not.toBeInTheDocument();
		expect(chevronRightIconLabel).toBeInTheDocument();
	});

	test('collapsed', () => {
		render(<Chevron isExpanded={false} rowId="1" />);

		const chevronLeftIcon = screen.getByText(/Expand/);
		const chevronRightIcon = screen.queryByText(/Collapse/);

		expect(chevronLeftIcon).toBeInTheDocument();
		expect(chevronRightIcon).not.toBeInTheDocument();
	});

	test('onExpandToggle', async () => {
		const user = userEvent.setup();
		const onExpandToggle = jest.fn();
		render(<Chevron onExpandToggle={onExpandToggle} rowId="1" />);

		const button = screen.getByRole('button');
		await user.click(button);

		expect(onExpandToggle).toHaveBeenCalled();
	});
});
