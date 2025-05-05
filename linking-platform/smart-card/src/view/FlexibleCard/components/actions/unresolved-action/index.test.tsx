import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { InternalActionName } from '../../../../../constants';
import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import type { FlexibleUiDataContext } from '../../../../../state/flexible-ui-context/types';

import UnresolvedAction from './index';

describe('UnresolvedAction', () => {
	const testId = `test-errored-view-message`;
	const descriptor = {
		id: 'message-id',
		description: 'This is an error message',
		defaultMessage: 'Something is wrong.',
	};

	const setup = (context?: FlexibleUiDataContext) =>
		render(<UnresolvedAction testId="test" />, {
			wrapper: ({ children }) => (
				<IntlProvider locale="en">
					<FlexibleUiContext.Provider value={context}>{children}</FlexibleUiContext.Provider>
				</IntlProvider>
			),
		});

	it('should render unresolved action when action data is present in context', async () => {
		setup({
			actions: {
				[InternalActionName.UnresolvedAction]: { descriptor },
			},
		});

		expect(await screen.findByTestId(testId)).toBeInTheDocument();
		expect(await screen.findByText('Something is wrong.')).toBeInTheDocument();
	});

	it('should not render unresolved action when action data is not present in context', () => {
		setup();
		expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
	});

	it('should render button when onClick is provided', async () => {
		setup({
			actions: {
				[InternalActionName.UnresolvedAction]: {
					descriptor,
					onClick: jest.fn(),
				},
			},
		});

		expect(await screen.findByRole('button')).toBeInTheDocument();
	});

	it('should not render button if onClick is not provided', () => {
		setup({
			actions: {
				[InternalActionName.UnresolvedAction]: { descriptor },
			},
		});

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	it('should triggers onClick when button is clicked', async () => {
		const mockOnClick = jest.fn();
		setup({
			actions: {
				[InternalActionName.UnresolvedAction]: {
					descriptor,
					onClick: mockOnClick,
				},
			},
		});

		const button = await screen.findByRole('button');
		await userEvent.click(button);

		expect(mockOnClick).toHaveBeenCalled();
	});
});
