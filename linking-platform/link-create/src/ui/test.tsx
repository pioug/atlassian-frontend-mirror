import React, { useCallback, useState } from 'react';

import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/standard-button';
import { flushPromises } from '@atlaskit/link-test-helpers';
import { captureException } from '@atlaskit/linking-common/sentry';
import { fg } from '@atlaskit/platform-feature-flags';
import Popup from '@atlaskit/popup';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { MockPluginForm } from '../../example-helpers/mock-plugin-form';
import type { LinkCreatePlugin, LinkCreateProps, LinkCreateWithModalProps } from '../common/types';
import { useLinkCreateCallback } from '../controllers/callback-context';
import {
	ExitWarningModalProvider,
	useExitWarningModal,
} from '../controllers/exit-warning-modal-context';

import LinkCreate, { CreateForm, InlineCreate } from './index';

import '@atlaskit/link-test-helpers/jest';

jest.mock('@atlaskit/linking-common/sentry', () => ({
	captureException: jest.fn(),
}));

type LinkCreateTestSetup = (
	props?: any,
	createError?: Error,
) => {
	rerender: (props?: any) => void;
	unmount: () => void;
	onAnalyticsEventMock: jest.Mock;
};

const DEFAULT_TEST_ID = 'link-create';

const createPlugins = (createError?: Error) => {
	const CreatePluginForm: React.ComponentType = jest.fn(() => {
		const { onCreate, onFailure, onCancel } = useLinkCreateCallback();

		return (
			<div>
				This is a form. Trust me.
				<Button
					testId="submit-button"
					appearance="primary"
					onClick={() =>
						onCreate &&
						onCreate({
							url: 'https://www.atlassian.com',
							data: {
								spaceName: 'space',
							},
							objectId: '123',
							objectType: 'page',
							ari: 'example-ari',
						})
					}
				>
					Success
				</Button>
				<Button
					testId="error-button"
					appearance="primary"
					onClick={() => onFailure && onFailure(createError || Error('An error just happened'))}
				>
					Trigger an error
				</Button>
				<Button testId="close-button" appearance="primary" onClick={onCancel}>
					Close
				</Button>
			</div>
		);
	});

	return [
		{
			group: {
				label: 'group-label',
				icon: 'group-icon',
				key: 'group',
			},
			label: 'entity-label',
			icon: 'entity-icon',
			key: 'entity-key',
			form: <CreatePluginForm />,
		},
		{
			group: {
				label: 'group-label',
				icon: 'group-icon',
				key: 'group',
			},
			label: 'plugin-with-create-form',
			icon: 'plugin-with-create-form',
			key: 'plugin-with-create-form',
			form: <MockPluginForm />,
		},
	];
};

const renderWithWrapper = (ui: React.ReactElement) => {
	const onAnalyticsEventMock = jest.fn();

	const result = render(ui, {
		wrapper: ({ children }) => (
			<IntlProvider locale="en">
				<AnalyticsListener channel={'media'} onEvent={onAnalyticsEventMock}>
					{children}
				</AnalyticsListener>
			</IntlProvider>
		),
	});

	return { ...result, onAnalyticsEventMock };
};

const setupModalCreate = (props?: Partial<LinkCreateWithModalProps>, createError?: Error) => {
	const Component = (props?: Partial<LinkCreateWithModalProps>) => {
		return (
			<LinkCreate
				testId={DEFAULT_TEST_ID}
				plugins={createPlugins(createError)}
				entityKey="entity-key"
				active={true}
				{...props}
			/>
		);
	};

	const { onAnalyticsEventMock, ...renderResult } = renderWithWrapper(<Component {...props} />);

	const rerender = (props?: Partial<LinkCreateWithModalProps>) =>
		renderResult.rerender(<Component {...props} />);

	const unmount = () => renderResult.unmount();

	return {
		rerender,
		unmount,
		onAnalyticsEventMock,
	};
};

const setupInlineCreate = (props?: Partial<LinkCreateProps>, createError?: Error) => {
	const Component = (props?: Partial<LinkCreateProps>) => {
		return (
			<ExitWarningModalProvider>
				<InlineCreate
					testId={DEFAULT_TEST_ID}
					plugins={createPlugins(createError)}
					entityKey="entity-key"
					{...props}
				/>
			</ExitWarningModalProvider>
		);
	};

	const { onAnalyticsEventMock, ...renderResult } = renderWithWrapper(<Component {...props} />);

	const rerender = (props?: Partial<LinkCreateProps>) =>
		renderResult.rerender(<Component {...props} />);

	const unmount = () => renderResult.unmount();

	return {
		rerender,
		unmount,
		onAnalyticsEventMock,
	};
};

describe('Link create', () => {
	const runTests = (setup: LinkCreateTestSetup) => {
		it('should render the create experience', async () => {
			setup();

			expect(screen.getByTestId(DEFAULT_TEST_ID)).toBeInTheDocument();
		});

		it('should fire screen viewed analytics event when it opens', async () => {
			const { onAnalyticsEventMock } = setup();

			expect(screen.getByTestId(DEFAULT_TEST_ID)).toBeInTheDocument();

			expect(onAnalyticsEventMock).toBeCalled();
			const mockCall = onAnalyticsEventMock.mock.calls[0];
			expect(mockCall[0]).toMatchObject({
				payload: {
					eventType: 'screen',
					name: 'linkCreateScreen',
					action: 'viewed',
					// Attributes from AnalyticsContext will not yet show up here
					attributes: expect.any(Object),
				},
			});
		});

		it('should only trigger the callback onCreate when it submits the form when onComplete is not provided', async () => {
			const onCreateMock = jest.fn();
			const onCompleteMock = jest.fn();

			setup({ onCreate: onCreateMock });

			screen.getByTestId('submit-button').click();

			expect(onCreateMock).toHaveBeenCalledWith(
				expect.objectContaining({
					url: 'https://www.atlassian.com',
					objectId: '123',
					objectType: 'page',
					data: { spaceName: 'space' },
					ari: 'example-ari',
				}),
			);

			// the onCreate callback is awaited
			await flushPromises();

			expect(onCompleteMock).toBeCalledTimes(0);
		});

		it('should trigger the callback onCreate and onComplete when it submits the form if onComplete is provided', async () => {
			const onCreateMock = jest.fn();
			const onCompleteMock = jest.fn();

			setup({ onCreate: onCreateMock, onComplete: onCompleteMock });

			screen.getByTestId('submit-button').click();

			expect(onCreateMock).toBeCalledWith(
				expect.objectContaining({
					url: 'https://www.atlassian.com',
					objectId: '123',
					objectType: 'page',
					data: { spaceName: 'space' },
					ari: 'example-ari',
				}),
			);
			// the onCreate callback is awaited before onComplete is called
			await flushPromises();
			expect(onCompleteMock).toBeCalledTimes(1);
		});

		it('should trigger the callback onFailure when the form fails', async () => {
			const onFailureMock = jest.fn();

			setup({ onFailure: onFailureMock });

			screen.getByTestId('error-button').click();

			expect(onFailureMock).toBeCalled();
		});

		it('it should not consider all errors to fail our SLO (eg. ignore failed to fetch) when `onFailure` is called', () => {
			const onFailureMock = jest.fn();
			const createError = new TypeError('Failed to fetch');

			const { onAnalyticsEventMock } = setup({ onFailure: onFailureMock }, createError);

			screen.getByTestId('error-button').click();

			expect(onFailureMock).toBeCalledTimes(1);

			expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
				payload: {
					eventType: 'operational',
					action: 'failed',
					actionSubject: 'linkCreateExperience',
					attributes: {
						errorType: 'TypeError',
						isSLOFailure: false,
					},
				},
			});
		});

		it('should dispatch operational analytics when a plugin calls `onFailure` and can still proceed to succeed the experience', async () => {
			const onCreateMock = jest.fn();
			const onFailureMock = jest.fn();

			const { onAnalyticsEventMock } = setup({
				onFailure: onFailureMock,
				onCreate: onCreateMock,
			});

			screen.getByTestId('error-button').click();
			expect(onFailureMock).toBeCalledTimes(1);

			expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
				payload: {
					eventType: 'operational',
					action: 'failed',
					actionSubject: 'linkCreateExperience',
					attributes: {
						errorType: 'Error',
						errorMessage: 'An error just happened',
						path: null,
						status: null,
						traceId: null,
						experienceStatus: 'FAILED',
						previousExperienceStatus: 'STARTED',
					},
				},
			});

			screen.getByTestId('submit-button').click();

			expect(onCreateMock).toBeCalledWith(
				expect.objectContaining({
					url: 'https://www.atlassian.com',
					objectId: '123',
					objectType: 'page',
					data: { spaceName: 'space' },
					ari: 'example-ari',
				}),
			);

			expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
				payload: {
					eventType: 'track',
					action: 'created',
					actionSubject: 'object',
					actionSubjectId: 'linkCreate',
				},
			});

			// 	/**
			// 	 * Could technically still fail the experience again after creation if we want to
			// 	 */
			screen.getByTestId('error-button').click();
			expect(onFailureMock).toBeCalledTimes(2);

			expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
				payload: {
					eventType: 'operational',
					action: 'failed',
					actionSubject: 'linkCreateExperience',
					attributes: {
						errorType: 'Error',
						path: null,
						status: null,
						traceId: null,
						experienceStatus: 'FAILED',
						previousExperienceStatus: 'SUCCEEDED',
					},
				},
			});

			// the onCreate callback is awaited
			await flushPromises();
		});

		it('should trigger the callback onCancel when it close the form', async () => {
			const onCancelMock = jest.fn();

			setup({ onCancel: onCancelMock });

			screen.getByTestId('close-button').click();
			expect(onCancelMock).toHaveBeenCalled();
		});

		it('should trigger onComplete if it is provided', async () => {
			const onCreateMock = jest.fn();
			const onCompleteMock = jest.fn();

			setup({ onComplete: onCompleteMock, onCreate: onCreateMock });
			screen.getByTestId('submit-button').click();

			expect(onCreateMock).toBeCalledWith(
				expect.objectContaining({
					url: 'https://www.atlassian.com',
					objectId: '123',
					objectType: 'page',
					data: { spaceName: 'space' },
					ari: 'example-ari',
				}),
			);
			// the onCreate callback is awaited before onComplete is called
			await flushPromises();

			expect(onCompleteMock).toBeCalledTimes(1);
		});
	};

	describe('Modal create', () => {
		runTests(setupModalCreate);
	});

	describe('Inline create', () => {
		runTests(setupInlineCreate);
	});
});

describe('Confirm dismiss dialog', () => {
	let onCancelMock: jest.Mock;

	const dismissDialogTestId = 'link-create-confirm-dismiss-dialog';

	beforeEach(() => {
		onCancelMock = jest.fn();
	});

	const runTests = (setup: LinkCreateTestSetup) => {
		it('should display Confirm Dismiss Dialog when changes are made and user clicks cancel', async () => {
			setup({ entityKey: 'plugin-with-create-form', onCancel: onCancelMock });

			expect(await screen.findByTestId(DEFAULT_TEST_ID)).toBeInTheDocument();

			const textField = screen.getByLabelText(/Enter some Text/i) as HTMLInputElement;

			// User makes changes to the form
			expect(textField).toBeTruthy();
			await userEvent.click(textField);
			await userEvent.keyboard('title text content');

			// user clicks 'cancel'/'close'
			await userEvent.click(screen.getByTestId('link-create-form-button-cancel'));

			// Should not cancel and display confirm dismiss dialog instead
			expect(onCancelMock).not.toHaveBeenCalled();
			expect(await screen.findByTestId(dismissDialogTestId)).toBeInTheDocument();

			// User dismiss the dialog
			const goBackBtn = screen.getByText(/Go back/i) as HTMLInputElement;
			expect(goBackBtn).toBeTruthy();
			await userEvent.click(goBackBtn);

			// Wait for modal to close
			await waitFor(() => {
				expect(screen.queryByTestId(dismissDialogTestId)).not.toBeInTheDocument();
			});
		});

		it('should dismiss create on confirm Dismiss Dialog', async () => {
			const { unmount } = setup({
				entityKey: 'plugin-with-create-form',
				onCancel: onCancelMock,
			});

			expect(await screen.findByTestId(DEFAULT_TEST_ID)).toBeInTheDocument();

			const textField = screen.getByLabelText(/Enter some Text/i) as HTMLInputElement;

			expect(textField).toBeTruthy();
			await userEvent.click(textField);
			await userEvent.keyboard('title text content');

			await userEvent.click(screen.getByTestId('link-create-form-button-cancel'));

			expect(await screen.findByTestId(dismissDialogTestId)).toBeInTheDocument();

			const discardBtn = screen.getByText(/Discard/i) as HTMLInputElement;
			expect(discardBtn).toBeTruthy();
			await userEvent.click(discardBtn);

			// simulate adopter dismissing InlineCreate on cancel
			unmount();

			await waitFor(() => {
				expect(screen.queryByTestId(DEFAULT_TEST_ID)).not.toBeInTheDocument();
				expect(screen.queryByTestId(dismissDialogTestId)).not.toBeInTheDocument();
				expect(onCancelMock).toHaveBeenCalled();
			});
		});
	};

	describe('Modal create', () => {
		runTests(setupModalCreate);
	});

	describe('when modal create is inside popup', () => {
		const PopupWithCreate = () => {
			const [isOpen, setIsOpen] = useState(true);

			return (
				<Popup
					testId="popup"
					autoFocus={false}
					onClose={() => setIsOpen(false)}
					isOpen={isOpen}
					content={() => (
						<LinkCreate
							testId={DEFAULT_TEST_ID}
							plugins={createPlugins()}
							entityKey="plugin-with-create-form"
							active
						/>
					)}
					trigger={(triggerProps) => <Button {...triggerProps}>Open</Button>}
					shouldRenderToParent={fg('should-render-to-parent-should-be-true-linking-pla')}
				/>
			);
		};

		ffTest.on('layering-tree-graph', 'layering tree graph is enabled', () => {
			it('should not close popup when pressing escape in modal after dismissing exit warning', async () => {
				renderWithWrapper(<PopupWithCreate />);

				// dirty form
				await userEvent.click(await screen.findByLabelText(/Enter some Text/i));
				await userEvent.keyboard('Hello');
				// try exit the form by pressing escape
				await userEvent.keyboard('{Escape}');

				// should see exit warning
				expect(await screen.findByTestId(dismissDialogTestId)).toBeInTheDocument();

				// close exit warning
				await userEvent.click(await screen.findByRole('button', { name: 'Go back' }));
				await waitForElementToBeRemoved(screen.queryByTestId(dismissDialogTestId));

				// refocus on the text field
				await userEvent.click(await screen.findByLabelText(/Enter some Text/i));
				await userEvent.keyboard(' world');
				// try exit again
				await userEvent.keyboard('{Escape}');

				// should see exit warning
				expect(await screen.findByTestId(dismissDialogTestId)).toBeInTheDocument();
				// popup should still be open
				expect(await screen.findByTestId('popup')).toBeInTheDocument();
			});
		});
	});

	describe('Inline create', () => {
		runTests(setupInlineCreate);

		describe('withExitWarning', () => {
			const setup = () => {
				const mockCallback = jest.fn();

				const Component = () => {
					const { withExitWarning } = useExitWarningModal();

					return (
						<>
							<Button onClick={withExitWarning(mockCallback)} testId="exit-button">
								Exit
							</Button>

							<InlineCreate
								testId={DEFAULT_TEST_ID}
								plugins={createPlugins()}
								entityKey="plugin-with-create-form"
							/>
						</>
					);
				};

				return {
					...render(<Component />, { wrapper: ExitWarningModalProvider }),
					mockCallback,
				};
			};

			it('Should not invoke callback and show dialog when changes are made', async () => {
				const { mockCallback } = setup();

				const textField = screen.getByLabelText(/Enter some Text/i) as HTMLInputElement;

				// User makes changes to the form
				expect(textField).toBeTruthy();
				await userEvent.click(textField);
				await userEvent.keyboard('title text content');

				// exit the form by clicking the custom exit button
				await userEvent.click(screen.getByTestId('exit-button'));

				expect(await screen.findByTestId(dismissDialogTestId)).toBeInTheDocument();

				expect(mockCallback).not.toHaveBeenCalled();
			});

			it('Should invoke callback and not show dialog', async () => {
				const { mockCallback } = setup();

				// exit the form by clicking the custom exit button
				await userEvent.click(screen.getByTestId('exit-button'));

				expect(mockCallback).toHaveBeenCalled();
			});
		});
	});
	it('should capture and report a11y violations', async () => {
		const mockCallback = jest.fn();

		const Component = () => {
			const { withExitWarning } = useExitWarningModal();

			return (
				<>
					<Button onClick={withExitWarning(mockCallback)} testId="exit-button">
						Exit
					</Button>

					<InlineCreate
						testId={DEFAULT_TEST_ID}
						plugins={createPlugins()}
						entityKey="plugin-with-create-form"
					/>
				</>
			);
		};
		const { container } = render(<Component />, { wrapper: ExitWarningModalProvider });
		await expect(container).toBeAccessible();
	});
});

describe('Error boundary', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	beforeAll(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterAll(() => {
		jest.spyOn(console, 'error').mockRestore();
	});

	const runTests = (setup: LinkCreateTestSetup) => {
		it('should display an error boundary on unhandled error within the link create modal', async () => {
			setup({ entityKey: 'undefined' as any });
			expect(await screen.findByTestId('link-create-error-boundary-ui')).toBeInTheDocument();
		});

		describe('errors are correctly captured by error boundary', () => {
			it('captures errors in error boundary', async () => {
				const { onAnalyticsEventMock } = setup({ entityKey: 'undefined' as any });

				expect(await screen.findByTestId('link-create-error-boundary-ui')).toBeInTheDocument();

				expect(captureException).toHaveBeenCalledTimes(1);
				expect(captureException).toHaveBeenCalledWith(expect.any(Error), 'link-create');

				expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
					payload: {
						eventType: 'operational',
						action: 'failed',
						actionSubject: 'linkCreateExperience',
						attributes: {
							errorType: 'Error',
							path: null,
							status: null,
							traceId: null,
							experienceStatus: 'FAILED',
							previousExperienceStatus: 'STARTED',
						},
					},
				});
			});

			describe('when response thrown by a plugin render', () => {
				it('captures error in error boundary, sends analytics but not captured to sentry', async () => {
					const CreatePluginForm: React.ComponentType = jest.fn(() => {
						const response = new Response(null, {
							status: 500,
							headers: { 'x-trace-id': 'some-traceid' },
						});
						Object.defineProperty(response, 'url', {
							value: 'https://atlassian.com/gateway/api',
						});
						throw response;
					});

					const mockPlugins = [
						{
							group: {
								label: 'group-label',
								icon: 'group-icon',
								key: 'group',
							},
							label: 'entity-label',
							icon: 'entity-icon',
							key: 'entity-key',
							form: <CreatePluginForm />,
						},
					];

					const { onAnalyticsEventMock } = setup({ plugins: mockPlugins });

					expect(await screen.findByTestId('link-create-error-boundary-ui')).toBeInTheDocument();

					/**
					 * Should never send response to sentry
					 */
					expect(captureException).not.toHaveBeenCalled();
					expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
						payload: {
							eventType: 'operational',
							action: 'failed',
							actionSubject: 'linkCreateExperience',
							attributes: {
								errorType: 'NetworkError',
								path: '/gateway/api',
								status: 500,
								traceId: 'some-traceid',
								experienceStatus: 'FAILED',
								previousExperienceStatus: 'STARTED',
							},
						},
					});
				});
			});
		});
	};

	describe('Modal create', () => {
		runTests(setupModalCreate);

		it('should display outer error boundary on unhandled error outside the link create modal', async () => {
			const { onAnalyticsEventMock } = setupModalCreate({ plugins: 'error' as any });

			// should capture exception to sentry when error boundary is hit
			expect(captureException).toHaveBeenCalledWith(expect.any(TypeError), 'link-create');
			expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'unhandledErrorCaught',
					actionSubject: 'linkCreate',
					attributes: {
						error: 'TypeError',
						componentStack: 'unknown',
					},
				},
			});
			expect(await screen.findByTestId('link-create-error-boundary-modal')).toBeInTheDocument();
		});
	});

	describe('Inline create', () => {
		runTests(setupInlineCreate);

		it('should display outer error boundary on unhandled error outside inline create', async () => {
			const { onAnalyticsEventMock } = setupInlineCreate({ plugins: 'error' as any });

			// should capture exception to sentry when error boundary is hit
			expect(captureException).toHaveBeenCalledWith(expect.any(TypeError), 'link-create');
			expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'unhandledErrorCaught',
					actionSubject: 'linkCreate',
					attributes: {
						error: 'TypeError',
						componentStack: 'unknown',
					},
				},
			});

			expect(await screen.findByTestId('link-create-error-boundary-ui')).toBeInTheDocument();
		});
	});
});

describe('Plugin edit view', () => {
	const editButtonLabel = 'Create + Open';

	const onSubmitSpy = jest.fn();

	function Form() {
		const { onCreate, onCancel } = useLinkCreateCallback();
		const onSubmit = useCallback(async () => {
			try {
				await onSubmitSpy();
				await onCreate?.({
					url: 'https://atlassian.com',
					objectId: 'someId',
					objectType: 'someObjectType',
					ari: 'example-ari',
				});
			} catch (err) {
				// don't complete
			}
		}, [onCreate]);

		return (
			<CreateForm onSubmit={onSubmit} onCancel={onCancel}>
				Form
			</CreateForm>
		);
	}

	const pluginWithEdit: LinkCreatePlugin = {
		group: {
			label: 'group-label',
			icon: 'group-icon',
			key: 'group',
		},
		label: 'entity-label',
		icon: 'entity-icon',
		key: 'entity-key',
		form: <Form />,
		// eslint-disable-next-line @atlaskit/design-system/no-html-button
		editView: jest.fn(({ onClose }) => <button onClick={onClose}>Finish</button>),
	};

	const runTests = (setup: LinkCreateTestSetup) => {
		it('should NOT show edit button when edit view is undefined even if `onComplete` is provided', async () => {
			const onCompleteMock = jest.fn();

			setup({
				plugins: [{ ...pluginWithEdit, editView: undefined }],
				onComplete: onCompleteMock,
			});

			expect(await screen.findByRole('button', { name: 'Create' })).toBeInTheDocument();
			expect(screen.queryByRole('button', { name: editButtonLabel })).not.toBeInTheDocument();
		});

		it('with create form should show edit button when edit view and `onComplete` is provided', async () => {
			const onCompleteMock = jest.fn();
			setup({
				plugins: [pluginWithEdit],
				onComplete: onCompleteMock,
			});

			expect(await screen.findByRole('button', { name: 'Create' })).toBeInTheDocument();
			expect(await screen.findByRole('button', { name: editButtonLabel })).toBeInTheDocument();
		});

		it('onCloseComplete should only be called when active changes from `true` to `false`', async () => {
			const onCompleteMock = jest.fn();
			const onCloseCompleteMock = jest.fn();
			const { rerender } = setup({
				active: true,
				plugins: [pluginWithEdit],
				onComplete: onCompleteMock,
				onCloseComplete: onCloseCompleteMock,
			});
			expect(onCloseCompleteMock).not.toHaveBeenCalled();

			rerender({ active: false });

			// Expect it is still visible temporarily while transitioning out
			expect(screen.getByTestId('link-create-modal')).toBeInTheDocument();

			// Exits
			await waitFor(() => {
				expect(screen.queryByTestId('link-create-modal')).not.toBeInTheDocument();
			});
			expect(onCloseCompleteMock).toHaveBeenCalled();
		});

		it('with create form + edit view should render editView when edit button is clicked', async () => {
			const onCreateMock = jest.fn();
			const onCompleteMock = jest.fn();
			const onCloseCompleteMock = jest.fn();

			const { rerender, onAnalyticsEventMock } = setup({
				active: true,
				plugins: [pluginWithEdit],
				onCreate: onCreateMock,
				onComplete: onCompleteMock,
				onCloseComplete: onCloseCompleteMock,
			});

			const editButton = await screen.findByRole('button', {
				name: editButtonLabel,
			});

			await userEvent.click(editButton);

			// Because modals transition in and out they will still
			// be in the DOM temporarily when exiting
			await waitFor(() => {
				expect(screen.queryByTestId('link-create-modal')).not.toBeInTheDocument();
				expect(screen.queryByTestId('link-create-edit-modal')).toBeInTheDocument();
			});
			expect(onCloseCompleteMock).not.toHaveBeenCalled();
			expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
				payload: {
					eventType: 'screen',
					name: 'linkCreateEditScreen',
					action: 'viewed',
				},
			});

			expect(onSubmitSpy).toBeCalled();
			expect(onCreateMock).toBeCalledWith(
				expect.objectContaining({
					url: 'https://atlassian.com',
					objectId: 'someId',
					objectType: 'someObjectType',
				}),
			);

			// the onCreate callback is awaited before onComplete is called
			await flushPromises();
			expect(onCompleteMock).toBeCalledTimes(0);

			const editCloseButton = await screen.findByRole('button', {
				name: 'Finish',
			});
			await userEvent.click(editCloseButton);
			rerender({
				active: false,
				plugins: [pluginWithEdit],
				onComplete: onCompleteMock,
			});

			expect(screen.queryByTestId('link-create-edit-modal')).toBeInTheDocument();
			await waitFor(() => {
				expect(screen.queryByTestId('link-create-edit-modal')).not.toBeInTheDocument();
			});
			expect(onCloseCompleteMock).toBeCalledTimes(1);
		});

		it('with create form + edit view should NOT render editView when create button is clicked', async () => {
			const onCreateMock = jest.fn();
			const onCompleteMock = jest.fn();

			setup({
				plugins: [pluginWithEdit],
				onCreate: onCreateMock,
				onComplete: onCompleteMock,
			});

			const createButton = await screen.findByRole('button', {
				name: 'Create',
			});

			await userEvent.click(createButton);

			// Because modals transition in and out they will still
			// be in the DOM temporarily when exiting
			await waitFor(() => {
				expect(screen.queryByTestId('link-create-modal')).toBeInTheDocument();
				expect(screen.queryByTestId('link-create-edit-modal')).not.toBeInTheDocument();
			});

			expect(onSubmitSpy).toBeCalled();
			expect(onCreateMock).toBeCalledWith(
				expect.objectContaining({
					url: 'https://atlassian.com',
					objectId: 'someId',
					objectType: 'someObjectType',
				}),
			);
			// the onCreate callback is awaited before onComplete is called
			await flushPromises();
			expect(onCompleteMock).toHaveBeenCalled();
		});

		it('with create form + edit view should NOT render editView when close button is clicked', async () => {
			const onCreateMock = jest.fn();
			const onCompleteMock = jest.fn();
			const onCancelMock = jest.fn();

			setup({
				plugins: [pluginWithEdit],
				onCreate: onCreateMock,
				onComplete: onCompleteMock,
				onCancel: onCancelMock,
			});

			const closeButton = await screen.findByRole('button', {
				name: 'Close',
			});

			await userEvent.click(closeButton);

			expect(onCreateMock).toBeCalledTimes(0);
			expect(onCompleteMock).toBeCalledTimes(0);
			expect(onCancelMock).toBeCalledTimes(1);
			expect(screen.queryByTestId('link-create-edit-modal')).not.toBeInTheDocument();
		});

		it('should NOT trigger the edit flow if the form fails to submit (does not call onCreate)', async () => {
			const onCreateMock = jest.fn();
			const onCompleteMock = jest.fn();

			onSubmitSpy.mockImplementation(
				() =>
					new Promise((_, rej) => {
						setTimeout(rej, 1000);
					}),
			);

			setup({
				plugins: [pluginWithEdit],
				onCreate: onCreateMock,
				onComplete: onCompleteMock,
			});

			await userEvent.click(
				await screen.findByRole('button', {
					name: editButtonLabel,
				}),
			);

			// Enters submitting state
			await waitFor(() => {
				expect(
					screen.getByRole('button', {
						name: `${editButtonLabel} , Loading`,
					}),
				).toHaveAttribute('aria-disabled', 'true');
			});

			// Exits sumitting state
			await waitFor(() => {
				expect(screen.getByRole('button', { name: editButtonLabel })).not.toHaveAttribute(
					'aria-disabled',
				);
				expect(onSubmitSpy).toBeCalled();
			});

			// Edit modal not visible
			// Create modal still visible
			expect(screen.queryByTestId('link-create-edit-modal')).not.toBeInTheDocument();
			expect(screen.queryByTestId('link-create-modal')).toBeInTheDocument();
			expect(onCreateMock).not.toBeCalled();

			onSubmitSpy.mockReset();
		});
	};

	describe('Modal create', () => {
		runTests(setupModalCreate);
	});

	// todo: EDM-10072 - reintroduce these tests after edit dialog behaviour has been correctly spiked/implemented
	// describe('Inline create', () => {
	// 	runTests(setupInlineCreate);
	// });
});

describe('Modal create specific tests', () => {
	it('should fire modal dialog analytics on mount and unmount', async () => {
		const { unmount, onAnalyticsEventMock } = setupModalCreate();

		expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
			payload: {
				eventType: 'ui',
				actionSubject: 'modalDialog',
				actionSubjectId: 'linkCreate',
				action: 'opened',
			},
		});

		unmount();

		expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
			payload: {
				eventType: 'ui',
				actionSubject: 'modalDialog',
				actionSubjectId: 'linkCreate',
				action: 'closed',
			},
		});
	});

	it('should hide LinkCreate when `active` changes from `true` to `false`', async () => {
		const onCloseCompleteMock = jest.fn();

		const { rerender } = setupModalCreate({
			onCloseComplete: onCloseCompleteMock,
			active: true,
		});

		expect(screen.getByTestId(DEFAULT_TEST_ID)).toBeInTheDocument();
		expect(onCloseCompleteMock).toBeCalledTimes(0);

		rerender({ active: false });

		// Expect it is still visible temporarily while transitioning out
		expect(screen.getByTestId(DEFAULT_TEST_ID)).toBeInTheDocument();

		// Exits
		await waitFor(() => {
			expect(screen.queryByTestId(DEFAULT_TEST_ID)).not.toBeInTheDocument();
		});
		expect(onCloseCompleteMock).toBeCalledTimes(1);
	});

	it('should fire screen viewed analytics event when it opens', async () => {
		const { onAnalyticsEventMock } = setupModalCreate();

		expect(screen.getByTestId(DEFAULT_TEST_ID)).toBeInTheDocument();

		expect(onAnalyticsEventMock).toBeCalled();
		const mockCall = onAnalyticsEventMock.mock.calls[0];
		expect(mockCall[0]).toMatchObject({
			payload: {
				eventType: 'screen',
				name: 'linkCreateScreen',
				action: 'viewed',
				// Attributes from AnalyticsContext will not yet show up here
				attributes: expect.any(Object),
			},
		});
	});

	it("should NOT find LinkCreate by its testid when it's NOT active", async () => {
		setupModalCreate({ active: false });
		expect(screen.queryByTestId(DEFAULT_TEST_ID)).not.toBeInTheDocument();
	});

	it('should display a custom title when provided', async () => {
		setupModalCreate({
			modalTitle: 'Create meeting notes',
		});
		expect(screen.queryByTestId(DEFAULT_TEST_ID)).toBeInTheDocument();
		expect(screen.getByText('Create meeting notes')).toBeTruthy();
	});

	it('should display a custom hero when provided', async () => {
		const HeroModal = () => <img src="some image here" alt="some alt text here" />;
		setupModalCreate({
			modalHero: <HeroModal />,
		});

		const heroModal = screen.queryByTestId('link-create-modal-hero');
		expect(heroModal).toBeInTheDocument();
	});

	it('should close modal on Esc if no changes are made', async () => {
		const onCancelMock = jest.fn();

		const { rerender } = setupModalCreate({ active: true, onCancel: onCancelMock });

		expect(await screen.findByTestId(DEFAULT_TEST_ID)).toBeInTheDocument();
		await userEvent.keyboard('{Escape}');

		rerender({
			active: false,
		});

		await waitFor(() => {
			expect(screen.queryByTestId(DEFAULT_TEST_ID)).not.toBeInTheDocument();
			expect(onCancelMock).toHaveBeenCalled();
		});
	});

	it('should trigger the Modal Callbacks when provided', async () => {
		let onOpenComplete = jest.fn();
		let onCloseComplete = jest.fn();

		const { rerender } = setupModalCreate({
			active: true,
			onOpenComplete,
			onCloseComplete,
		});

		expect(await screen.findByTestId(DEFAULT_TEST_ID)).toBeInTheDocument();

		await waitFor(() => {
			expect(onOpenComplete).toHaveBeenCalledTimes(1);
		});

		rerender({
			active: false,
			onOpenComplete,
			onCloseComplete,
		});

		await waitFor(() => {
			expect(screen.queryByTestId(DEFAULT_TEST_ID)).not.toBeInTheDocument();
			expect(onCloseComplete).toHaveBeenCalledTimes(1);
		});
	});
});
