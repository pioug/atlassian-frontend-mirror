import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Chevron from '../../components/internal/chevron';

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
		const changedRowId = '100';
		render(<Chevron rowId={changedRowId} />);

		const chevronIconWithRowIdInLabel = screen.getByText(new RegExp(changedRowId));
		expect(chevronIconWithRowIdInLabel).toBeInTheDocument();
	});

	it('should give context of the row content in the label', () => {
		const extendedLabel = 'Chapter 1: Clean Code';
		render(<Chevron rowId="1" extendedLabel={extendedLabel} />);

		const labelElement = screen.getByText(new RegExp(extendedLabel));
		expect(labelElement).toBeInTheDocument();
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
