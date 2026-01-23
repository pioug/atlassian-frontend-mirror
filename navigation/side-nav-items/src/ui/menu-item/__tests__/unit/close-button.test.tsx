import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import { render, screen, userEvent } from '@atlassian/testing-library';

import { CloseButton } from '../../flyout-menu-item/close-button';

describe('Close button', () => {
	const label = 'label';
	const testId = 'testId';

	it('should be a button', () => {
		render(<CloseButton onClick={noop} label={label} testId={testId} />);

		const closeButton = screen.getByTestId(`${testId}`);
		expect(screen.getByRole('button')).toBe(closeButton);
	});

	it('should trigger provided onClick when clicked', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();
		render(<CloseButton onClick={onClick} label={label} testId={testId} />);

		const closeButton = screen.getByTestId(`${testId}`);

		expect(onClick).toHaveBeenCalledTimes(0);
		await user.click(closeButton);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('should have default accessible name', () => {
		render(<CloseButton onClick={noop} label={label} testId={testId} />);

		const closeButton = screen.getByTestId(`${testId}`);

		expect(closeButton).toHaveAccessibleName();
	});

	it('should use label if provided', () => {
		render(<CloseButton label={label} onClick={noop} testId={testId} />);

		const closeButton = screen.getByTestId(`${testId}`);

		expect(closeButton).toHaveAccessibleName(label);
	});

	it('should pass a11y checks', async () => {
		const { container } = render(<CloseButton label={label} onClick={noop} testId={testId} />);

		await expect(container).toBeAccessible();
	});
});
