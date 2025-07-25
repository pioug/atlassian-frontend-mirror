import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getFlexibleCardTestWrapper } from '../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { InternalActionName, SmartLinkStatus } from '../../../../../../constants';
import type { FlexibleUiDataContext } from '../../../../../../state/flexible-ui-context/types';
import CustomUnresolvedAction, { type CustomStatusComponents } from '../index';

describe('CustomUnresolvedAction', () => {
	const testId = `test-errored-view-message`;
	const descriptor = {
		id: 'message-id',
		description: 'This is an error message',
		defaultMessage: 'Something is wrong.',
	};

	describe('onlyShowIfAction', () => {
		const setup = (onlyShowIfAction: boolean, data?: FlexibleUiDataContext) =>
			render(<CustomUnresolvedAction testId="test" onlyShowIfAction={onlyShowIfAction} />, {
				wrapper: getFlexibleCardTestWrapper(data),
			});

		it('should not render if onlyShowIfAction is true and there is no action', () => {
			setup(true, {
				actions: {
					[InternalActionName.UnresolvedAction]: {
						descriptor,
					},
				},
			});

			expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
			expect(screen.queryByRole('button')).not.toBeInTheDocument();
		});

		it('should render if onlyShowIfAction is true and there is an action', async () => {
			setup(true, {
				actions: {
					[InternalActionName.UnresolvedAction]: {
						descriptor,
						onClick: jest.fn(),
					},
				},
			});
			expect(await screen.findByRole('button')).toBeInTheDocument();
			expect(await screen.findByText('Something is wrong.')).toBeInTheDocument();
		});
	});

	describe('Custom unresolved action text based statuses', () => {
		const forbiddenMessageDescriptors = {
			REQUEST_ACCESS: {
				id: 'REQUEST_ACCESS',
				defaultMessage: 'Request Access',
			},
			ACCESS_EXISTS: {
				id: 'ACCESS_EXISTS',
				defaultMessage: 'Try another account',
			},
			DIRECT_ACCESS: {
				id: 'DIRECT_ACCESS',
				defaultMessage: 'Join Product',
			},
			FALLBACK: {
				id: 'FALLBACK',
				defaultMessage: 'Try another account',
			},
			PENDING_REQUEST_EXISTS: {
				id: 'PENDING_REQUEST_EXISTS',
				defaultMessage: 'Request pending',
			},
			FORBIDDEN: {
				id: 'FORBIDDEN',
				defaultMessage: 'Access forbidden',
			},
			DENIED_REQUEST_EXISTS: {
				id: 'DENIED_REQUEST_EXISTS',
				defaultMessage: 'Request denied',
			},
		} satisfies CustomStatusComponents;

		const unauthorizedMessageDescriptors = {
			FALLBACK: {
				id: 'FALLBACK',
				defaultMessage: 'Connect account',
			},
			DENIED_REQUEST_EXISTS: {
				id: 'DENIED_REQUEST_EXISTS',
				defaultMessage: 'Request denied',
			},
			REQUEST_ACCESS: {
				id: 'REQUEST_ACCESS',
				defaultMessage: 'Request Access',
			},
			ACCESS_EXISTS: {
				id: 'ACCESS_EXISTS',
				defaultMessage: 'Try another account',
			},
			DIRECT_ACCESS: {
				id: 'DIRECT_ACCESS',
				defaultMessage: 'Join Product',
			},
			PENDING_REQUEST_EXISTS: {
				id: 'PENDING_REQUEST_EXISTS',
				defaultMessage: 'Request pending',
			},
			FORBIDDEN: {
				id: 'FORBIDDEN',
				defaultMessage: 'Access forbidden',
			},
		} satisfies CustomStatusComponents;

		const setup = (data: FlexibleUiDataContext, status: SmartLinkStatus) => {
			render(
				<CustomUnresolvedAction
					onlyShowIfAction
					forbidden={forbiddenMessageDescriptors}
					unauthorized={unauthorizedMessageDescriptors}
				/>,
				{ wrapper: getFlexibleCardTestWrapper(data, undefined, status) },
			);
		};

		it.each(
			Object.entries(forbiddenMessageDescriptors).map(([key, messageDescriptor]) => [
				key as keyof typeof forbiddenMessageDescriptors,
				messageDescriptor,
				messageDescriptor.defaultMessage,
			]),
		)(
			'When status is FORBIDDEN and accessType is %s',
			async (accessType, messageDescriptor, defaultMessage) => {
				setup(
					{
						actions: {
							[InternalActionName.UnresolvedAction]: {
								descriptor: messageDescriptor,
								onClick: jest.fn(),
							},
						},
						meta: {
							accessType,
						},
					},
					SmartLinkStatus.Forbidden,
				);
				expect(await screen.findByRole('button')).toBeInTheDocument();
				expect(
					(await screen.findByTestId('custom-unresolved-action-errored-view-message')).textContent,
				).toBe(defaultMessage);
			},
		);

		it.each(
			Object.entries(unauthorizedMessageDescriptors).map(([key, messageDescriptor]) => [
				key as keyof typeof unauthorizedMessageDescriptors,
				messageDescriptor,
				messageDescriptor.defaultMessage,
			]),
		)(
			'When status is UNAUTHORIZED and accessType is %s',
			async (accessType, messageDescriptor, defaultMessage) => {
				setup(
					{
						actions: {
							[InternalActionName.UnresolvedAction]: {
								descriptor: messageDescriptor,
								onClick: jest.fn(),
							},
						},
						meta: {
							accessType,
						},
					},
					SmartLinkStatus.Unauthorized,
				);
				expect(await screen.findByRole('button')).toBeInTheDocument();
				expect(
					(await screen.findByTestId('custom-unresolved-action-errored-view-message')).textContent,
				).toBe(defaultMessage);
			},
		);
	});

	describe('Container', () => {
		const setup = (
			Container: React.ComponentType<{ children: React.ReactNode }>,
			data?: FlexibleUiDataContext,
		) =>
			render(<CustomUnresolvedAction testId="test" Container={Container} />, {
				wrapper: getFlexibleCardTestWrapper(data),
			});

		it('should render the container and the action', async () => {
			setup(
				({ children }: { children: React.ReactNode }) => (
					<div data-testId="container-wrapper">{children}</div>
				),
				{
					actions: {
						[InternalActionName.UnresolvedAction]: { descriptor },
					},
				},
			);
			const container = await screen.findByTestId('container-wrapper');
			expect(container).toBeInTheDocument();
			// Check that the errored view message is inside the container
			const erroredViewMessage = await screen.findByTestId(testId);
			expect(container).toContainElement(erroredViewMessage);
			// Check that the text is inside the container
			const errorText = await screen.findByText('Something is wrong.');
			expect(container).toContainElement(errorText);
		});

		it('should capture and report a11y violations', async () => {
			const { container } = setup(
				({ children }: { children: React.ReactNode }) => (
					<div data-testId="container-wrapper">{children}</div>
				),
				{
					actions: {
						[InternalActionName.UnresolvedAction]: { descriptor },
					},
				},
			);

			await expect(container).toBeAccessible();
		});
	});

	describe('inherited tests from UnresolvedAction', () => {
		const setup = (data?: FlexibleUiDataContext) =>
			render(<CustomUnresolvedAction testId="test" />, {
				wrapper: getFlexibleCardTestWrapper(data),
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
});
