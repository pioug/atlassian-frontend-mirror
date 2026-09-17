import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import { failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';

import { CloseButton } from '../../flyout-menu-item/close-button';

describe('Close button', () => {
	beforeEach(() => {
		failGate('platform-dst-motion-uplift-button');
	});
	const label = 'label';
	const testId = 'testId';

	it('should be a button', () => {
		setupComponent({});

		const closeButton = screen.getByTestId(testId);
		expect(screen.getByRole('button')).toBe(closeButton);
	});

	it('should trigger provided onClick when clicked', async () => {
		const onClick = jest.fn();
		const { user } = setupComponent({ onClick });

		const closeButton = screen.getByTestId(testId);
		await user.click(closeButton);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('should use label if provided', () => {
		setupComponent({});

		expect(screen.getByTestId(testId)).toHaveAccessibleName(label);
	});

	it('should pass a11y checks', async () => {
		const { container } = setupComponent({});

		await expect(container).toBeAccessible();
	});
});

function setupComponent(props: Partial<React.ComponentProps<typeof CloseButton>> = {}) {
	const user = userEvent.setup();
	const result = render(<CloseButton label="label" onClick={noop} testId="testId" {...props} />);
	return {
		...result,
		user,
	};
}
