import React from 'react';

import { render, screen } from '@testing-library/react';

import ButtonGroup from '../../../containers/button-group';
import Button from '../../../new';

const testId = 'button-group';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Button Group', () => {
	it('renders the `testId` prop to a data attribute', () => {
		render(<ButtonGroup testId={testId} />);

		const buttonGroup = screen.getByTestId(testId);

		expect(buttonGroup).toHaveAttribute('data-testid', testId);
	});

	it('does not add a test ID data attribute when `testId` prop is undefined', () => {
		render(<ButtonGroup>Button Group</ButtonGroup>);

		const buttonGroup = screen.getByText('Button Group');

		expect(buttonGroup).not.toHaveAttribute('data-testid');
	});

	it('should have `role="group"`', () => {
		render(
			<ButtonGroup testId={testId}>
				<Button>Button 1</Button>
				<Button>Button 2</Button>
			</ButtonGroup>,
		);
		const buttonGroup = screen.getByTestId(testId);
		expect(buttonGroup).toHaveAttribute('role', 'group');
	});
});
