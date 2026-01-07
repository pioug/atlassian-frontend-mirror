import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import noop from '@atlaskit/ds-lib/noop';

import { CloseButton } from '../../close-button';

const user = userEvent.setup();

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Close button', () => {
	const label = 'label';
	const testId = 'testId';

	it('should be a button', () => {
		render(<CloseButton onClick={noop} testId={testId} />);

		const closeButton = screen.getByTestId(`${testId}--close-button`);
		expect(screen.getByRole('button')).toBe(closeButton);
	});

	it('should trigger provided onClick when clicked', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();
		render(<CloseButton onClick={onClick} testId={testId} />);

		const closeButton = screen.getByTestId(`${testId}--close-button`);

		expect(onClick).toHaveBeenCalledTimes(0);
		await user.click(closeButton);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('should have default accessible name', () => {
		render(<CloseButton onClick={noop} testId={testId} />);

		const closeButton = screen.getByTestId(`${testId}--close-button`);

		expect(closeButton).toHaveAccessibleName();
	});

	it('should use label if provided', () => {
		render(<CloseButton label={label} onClick={noop} testId={testId} />);

		const closeButton = screen.getByTestId(`${testId}--close-button`);

		expect(closeButton).toHaveAccessibleName(label);
	});

	it('should run onBlur if provided', async () => {
		const onBlur = jest.fn();

		render(<CloseButton label={label} onBlur={onBlur} onClick={noop} testId={testId} />);

		const closeButton = screen.getByTestId(`${testId}--close-button`);

		await user.click(closeButton);

		expect(closeButton).toHaveAccessibleName(label);
	});
});
