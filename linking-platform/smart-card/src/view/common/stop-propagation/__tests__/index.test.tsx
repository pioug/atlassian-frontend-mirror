import React from 'react';

import Modal from '@atlaskit/modal-dialog';
import { Box } from '@atlaskit/primitives/compiled';
import { render, screen, userEvent } from '@atlassian/testing-library';

import { StopPropagation } from '../index';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

describe('StopPropagation', () => {
	let user: ReturnType<typeof userEvent.setup>;

	beforeEach(() => {
		user = userEvent.setup();
	});

	it('should prevent click event from propagating up', async () => {
		const onParentClick = jest.fn();

		render(
			<Box onClick={onParentClick}>
				<Modal>
					<StopPropagation>
						<button data-testid="modal-button">Click Me</button>
					</StopPropagation>
				</Modal>
			</Box>,
		);

		const button = screen.getByTestId('modal-button');

		await user.click(button);

		expect(onParentClick).not.toHaveBeenCalled();
	});

	it('should allow click event to propagate when not wrapped', async () => {
		const onParentClick = jest.fn();

		render(
			<Box onClick={onParentClick}>
				<Modal>
					<button data-testid="modal-button">Click Me</button>
				</Modal>
			</Box>,
		);

		const button = screen.getByTestId('modal-button');

		await user.click(button);

		expect(onParentClick).toHaveBeenCalled();
	});

	it('should render and be accessible', async () => {
		const onParentClick = jest.fn();

		const { container } = render(
			<Box onClick={onParentClick}>
				<Modal>
					<button data-testid="modal-button">Click Me</button>
				</Modal>
			</Box>,
		);

		await expect(container).toBeAccessible();
	});
});
