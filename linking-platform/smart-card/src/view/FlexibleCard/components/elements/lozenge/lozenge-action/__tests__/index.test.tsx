/* eslint-disable testing-library/no-unnecessary-act */
import React from 'react';

import { act, fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { flushPromises } from '@atlaskit/link-test-helpers';
import { InvokeError, SmartLinkActionType } from '@atlaskit/linking-types/smart-link-actions';
import { Text } from '@atlaskit/primitives';

import extractLozengeActionItems from '../../../../../../../extractors/action/extract-lozenge-action-items';
import { ActionName } from '../../../../../../../index';
import * as useInvoke from '../../../../../../../state/hooks/use-invoke';
import { type CardDetails } from '../../../../../../../state/hooks/use-invoke/types';
import * as useResolve from '../../../../../../../state/hooks/use-resolve';
import {
	TrackQuickActionFailureReason,
	TrackQuickActionType,
} from '../../../../../../../utils/analytics/analytics';
import { openEmbedModal } from '../../../../../../../view/EmbedModal/utils';
import LozengeAction from '../index';
import { LozengeActionErrorMessages } from '../lozenge-action-error/types';
import { type LozengeActionProps } from '../types';

describe('LozengeAction', () => {
	const testId = 'test-smart-element-lozenge-dropdown';
	const triggerTestId = `${testId}--trigger`;
	const text = 'In Progress';
	const appearance = 'inprogress';
	const url = 'https://jdog.jira-dev.com/browse/LP-2';
	const id = 'link-id';

	const previewData = {
		isSupportTheming: true,
		linkIcon: {
			url: 'https://linchen.jira-dev.com/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315',
		},
		providerName: 'Jira',
		src: 'https://some-jira-instance/browse/AT-1/embed?parentProduct=smartlink',
		title: 'AT-1: TESTTTTTT',
		url,
	};

	const mockAnalyticsClient = {
		sendUIEvent: jest.fn().mockResolvedValue(undefined),
		sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
		sendTrackEvent: jest.fn().mockResolvedValue(undefined),
		sendScreenEvent: jest.fn().mockResolvedValue(undefined),
	} satisfies AnalyticsWebClient;

	const getAction = (details: CardDetails = { url, id }) => {
		return {
			read: {
				action: {
					actionType: SmartLinkActionType.GetStatusTransitionsAction,
					resourceIdentifiers: {
						issueKey: 'issue-id',
						hostname: 'some-hostname',
					},
				},
				providerKey: 'object-provider',
			},
			update: {
				action: {
					actionType: SmartLinkActionType.StatusUpdateAction,
					resourceIdentifiers: {
						issueKey: 'issue-id',
						hostname: 'some-hostname',
					},
				},
				providerKey: 'object-provider',
				details,
			},
		};
	};

	const renderComponent = (
		props?: Partial<LozengeActionProps>,
		mockInvoke = jest.fn(),
		mockResolve = jest.fn(),
	) => {
		jest.spyOn(useInvoke, 'default').mockReturnValue(mockInvoke);
		jest.spyOn(useResolve, 'default').mockReturnValue(mockResolve);

		const component = (
			<FabricAnalyticsListeners client={mockAnalyticsClient}>
				<IntlProvider locale="en">
					<LozengeAction
						action={props?.action || getAction()}
						appearance={appearance}
						testId={testId}
						text={text}
						{...props}
					/>
				</IntlProvider>
			</FabricAnalyticsListeners>
		);

		const result = render(component);

		return { ...result, component };
	};

	afterEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('renders element', async () => {
		renderComponent();

		const element = await screen.findByTestId(triggerTestId);

		expect(element).toBeTruthy();
		expect(element).toHaveTextContent(text);
	});

	it('renders element with non-string content', async () => {
		const node = (
			<Text as="span">
				{text} <img src="random-image" />
			</Text>
		);

		renderComponent({ text: node });

		const element = await screen.findByTestId(triggerTestId);

		expect(element).toBeTruthy();
		expect(element).toHaveTextContent(text);
	});

	it('does not call reload action on render', async () => {
		const mockResolve = jest.fn();
		renderComponent({ action: getAction() }, jest.fn(), mockResolve);

		const element = await screen.findByTestId(triggerTestId);

		expect(element).toBeTruthy();

		await flushPromises();
		expect(mockResolve).toHaveBeenCalledTimes(0);
	});

	it('renders loading indicator on click', async () => {
		renderComponent({
			action: getAction(),
		});

		const element = await screen.findByTestId(triggerTestId);
		fireEvent.click(element);

		const loadingIndicator = screen.getByTestId(/loading-indicator$/);
		expect(loadingIndicator).toBeInTheDocument();
	});

	it('invokes read action', async () => {
		const mockInvoke = jest.fn();
		renderComponent({ action: getAction() }, mockInvoke);

		const element = await screen.findByTestId(triggerTestId);
		await act(async () => {
			await userEvent.click(element);
		});
		expect(mockInvoke).toHaveBeenCalledTimes(1);
		expect(mockInvoke).toHaveBeenNthCalledWith(1, getAction().read, extractLozengeActionItems);
	});

	it('renders action items', async () => {
		const mockInvoke = jest.fn().mockResolvedValue([{ text: 'Done' }, { text: 'Moved' }]);

		renderComponent({ action: getAction() }, mockInvoke);

		const element = await screen.findByTestId(triggerTestId);
		await act(async () => {
			await userEvent.click(element);
		});
		const item1 = await screen.findByTestId(`${testId}-item-0`);
		expect(item1).toBeTruthy();
		expect(item1).toHaveTextContent('Done');

		const item2 = await screen.findByTestId(`${testId}-item-1`);
		expect(item2).toBeTruthy();
		expect(item2).toHaveTextContent('Moved');
	});

	it('does not render active item', async () => {
		const mockInvoke = jest.fn().mockResolvedValue([{ text: 'Done' }, { text }]);

		renderComponent({ action: getAction() }, mockInvoke);

		const element = await screen.findByTestId(triggerTestId);
		await act(async () => {
			await userEvent.click(element);
		});
		const item1 = await screen.findByTestId(`${testId}-item-0`);
		expect(item1).toBeTruthy();
		expect(item1).toHaveTextContent('Done');

		const item2 = screen.queryByTestId(`${testId}-item-1`);
		expect(item2).not.toBeInTheDocument();
	});

	it('ignores non-comparable active item', async () => {
		const mockInvoke = jest.fn().mockResolvedValue([{ text: 'Done' }, { text }]);

		const node = (
			<span>
				{text} <img src="random-image" />
			</span>
		);
		renderComponent({ action: getAction(), text: node }, mockInvoke);

		const element = await screen.findByTestId(triggerTestId);
		await act(async () => {
			await userEvent.click(element);
		});
		const item1 = await screen.findByTestId(`${testId}-item-0`);
		expect(item1).toBeTruthy();
		expect(item1).toHaveTextContent('Done');

		const item2 = await screen.findByTestId(`${testId}-item-1`);
		expect(item2).toBeTruthy();
		expect(item2).toHaveTextContent(text);
	});

	it('invokes load action only once', async () => {
		const mockInvoke = jest.fn().mockResolvedValue([{ text: 'Done' }]);

		renderComponent({ action: getAction() }, mockInvoke);

		const element = await screen.findByTestId(triggerTestId);

		// First open (load)
		await act(async () => {
			await userEvent.click(element);
		});
		await screen.findByTestId(`${testId}-item-0`);
		await act(async () => {
			await userEvent.click(element);
		});
		// Second open
		await act(async () => {
			await userEvent.click(element);
		});
		await screen.findByTestId(`${testId}-item-0`);

		expect(mockInvoke).toHaveBeenCalledTimes(1);
	});

	it('renders error view when there is no action items', async () => {
		const mockInvoke = jest.fn().mockResolvedValue([]);

		renderComponent({ action: getAction() }, mockInvoke);

		const element = await screen.findByTestId(triggerTestId);
		await act(async () => {
			await userEvent.click(element);
		});

		// making sure error message is correct
		const error = await screen.findByTestId(`${testId}-error-message`);
		expect(error).toBeTruthy();
		expect(error.textContent).toBe(LozengeActionErrorMessages.noData.descriptor.defaultMessage);
	});

	it('renders error view when invoke return error', async () => {
		const mockInvoke = jest.fn().mockImplementationOnce(() => {
			throw new Error();
		});

		renderComponent({ action: getAction() }, mockInvoke);

		const element = await screen.findByTestId(triggerTestId);
		await act(async () => {
			await userEvent.click(element);
		});

		// making sure error message is correct
		const error = await screen.findByTestId(`${testId}-error-message`);
		expect(error).toBeTruthy();
		expect(error.textContent).toBe(LozengeActionErrorMessages.unknown.descriptor.defaultMessage);
	});

	it('renders fallback component on unexpected error', async () => {
		jest.spyOn(useInvoke, 'default').mockImplementationOnce(() => {
			throw new Error();
		});

		render(
			<LozengeAction action={getAction()} appearance={appearance} testId={testId} text={text} />,
		);

		const element = await screen.findByTestId(`${testId}-fallback`);
		expect(element).toBeTruthy();
		expect(element).toHaveTextContent(text);
	});

	it('invokes load action again if the previous load fails', async () => {
		const mockInvoke = jest
			.fn()
			.mockImplementationOnce(() => {
				throw new Error();
			})
			.mockResolvedValueOnce([{ text: 'Done' }]);
		renderComponent({ action: getAction() }, mockInvoke);

		const element = await screen.findByTestId(triggerTestId);
		await act(async () => {
			await userEvent.click(element);
		});
		await screen.findByTestId(`${testId}-error`);

		// Close dropdown
		await act(async () => {
			await userEvent.click(element);
		});
		// Open dropdownagain
		await act(async () => {
			await userEvent.click(element);
		});
		const item = await screen.findByTestId(`${testId}-item-0`);

		expect(mockInvoke).toHaveBeenCalledTimes(2);
		expect(item).toBeTruthy();
	});

	it('invokes update action', async () => {
		const mockInvoke = jest
			.fn()
			.mockResolvedValueOnce([
				{ id: '1', text: 'Done' },
				{ id: '2', text: 'Moved' },
			])
			.mockResolvedValueOnce(undefined);
		renderComponent({ action: getAction() }, mockInvoke);

		const element = await screen.findByTestId(triggerTestId);
		await act(async () => {
			await userEvent.click(element);
		});
		const item = await screen.findByTestId(`${testId}-item-0`);
		await act(async () => {
			await userEvent.click(item);
		});
		expect(mockInvoke).toHaveBeenNthCalledWith(2, {
			action: expect.objectContaining({
				actionType: SmartLinkActionType.StatusUpdateAction,
				resourceIdentifiers: expect.any(Object),
				payload: expect.any(Object),
			}),
			providerKey: expect.any(String),
		});
	});

	it('renders loading indicator on updating status', async () => {
		const mockInvoke = jest
			.fn()
			.mockResolvedValueOnce([{ id: '1', text: 'Done' }])
			.mockResolvedValueOnce(undefined);
		renderComponent({ action: getAction() }, mockInvoke);

		const element = await screen.findByTestId(triggerTestId);
		fireEvent.click(element);
		const item = await screen.findByTestId(`${testId}-item-0`);
		fireEvent.click(item);

		const loadingIndicator = screen.getByTestId(/loading-indicator$/);
		expect(loadingIndicator).toBeInTheDocument();
	});

	it('closes dropdown menu after update complete successfully', async () => {
		const mockInvoke = jest
			.fn()
			.mockResolvedValueOnce([{ id: '1', text: 'Done' }])
			.mockResolvedValueOnce(undefined);
		renderComponent({ action: getAction() }, mockInvoke);

		const itemTestId = `${testId}-item-0`;
		let element = await screen.findByTestId(triggerTestId);

		await act(async () => {
			await userEvent.click(element);
		});
		const item = await screen.findByTestId(itemTestId);
		await act(async () => {
			await userEvent.click(item);
		});
		element = await screen.findByTestId(triggerTestId);

		expect(item).not.toBeInTheDocument();
		expect(element.textContent).toEqual(item.textContent);
	});

	it('reloads the url when update is successfully completed', async () => {
		const mockInvoke = jest
			.fn()
			.mockResolvedValueOnce([{ id: '1', text: 'Done' }])
			.mockResolvedValueOnce(undefined);

		const mockResolve = jest.fn();

		renderComponent({ action: getAction() }, mockInvoke, mockResolve);

		const itemTestId = `${testId}-item-0`;
		const element = await screen.findByTestId(triggerTestId);
		await act(async () => {
			await userEvent.click(element);
		});

		const item = await screen.findByTestId(itemTestId);
		await act(async () => {
			await userEvent.click(item);
		});

		// making sure the dropdown is not visible
		expect(item).not.toBeInTheDocument();

		await flushPromises();

		// making sure the reload was called with correct parameters
		expect(mockResolve).toHaveBeenCalledTimes(1);
		expect(mockResolve).toHaveBeenCalledWith(url, true, undefined, id);
	});

	it('renders error with a default message when update fails for an unknown reason', async () => {
		const mockInvoke = jest
			.fn()
			.mockResolvedValueOnce([{ id: '1', text: 'Done' }])
			.mockImplementationOnce(() => {
				throw new Error();
			});

		renderComponent({ action: getAction() }, mockInvoke);

		const element = await screen.findByTestId(triggerTestId);
		await act(async () => {
			await userEvent.click(element);
		});
		const item = await screen.findByTestId(`${testId}-item-0`);
		await act(async () => {
			await userEvent.click(item);
		});

		// making sure error message is correct
		const error = await screen.findByTestId(`${testId}-error-message`);
		expect(error).toBeTruthy();
		expect(error.textContent).toBe(
			LozengeActionErrorMessages.updateFailed.descriptor.defaultMessage,
		);
	});

	it('renders error with a custom user message when update fails for a validation reason', async () => {
		const mockInvoke = jest
			.fn()
			.mockResolvedValueOnce([{ id: '1', text: 'Done' }])
			.mockImplementationOnce(() => {
				throw new InvokeError('Field Labels must be provided', 400);
			});

		renderComponent({ action: getAction() }, mockInvoke);

		const element = await screen.findByTestId(triggerTestId);
		await act(async () => {
			await userEvent.click(element);
		});
		const item = await screen.findByTestId(`${testId}-item-0`);
		await act(async () => {
			await userEvent.click(item);
		});

		// making sure error message is correct
		const error = await screen.findByTestId(`${testId}-error-message`);
		expect(error).toBeTruthy();
		expect(error).toHaveTextContent('Field Labels must be provided');
	});

	describe('error link', () => {
		it('renders error with a link when preview data is available', async () => {
			const mockInvoke = jest
				.fn()
				.mockResolvedValueOnce([{ id: '1', text: 'Done' }])
				.mockImplementationOnce(() => {
					throw new Error();
				});

			renderComponent(
				{
					action: getAction({
						url,
						id,
						invokePreviewAction: {
							actionFn: jest.fn().mockImplementation(() => {
								openEmbedModal({ ...previewData });
							}),
							actionType: ActionName.PreviewAction,
						},
					}),
				},
				mockInvoke,
			);

			const element = await screen.findByTestId(triggerTestId);
			await act(async () => {
				await userEvent.click(element);
			});
			const item = await screen.findByTestId(`${testId}-item-0`);
			await act(async () => {
				await userEvent.click(item);
			});

			// making sure error link is present
			const link = await screen.findByTestId(`${testId}-open-embed`);
			expect(link).toBeDefined();
			expect(link).toHaveTextContent('Open issue in Jira');
		});

		it('does not render error with a link when preview data is not available', async () => {
			const mockInvoke = jest
				.fn()
				.mockResolvedValueOnce([{ id: '1', text: 'Done' }])
				.mockImplementationOnce(() => {
					throw new Error();
				});

			renderComponent({ action: getAction() }, mockInvoke);

			const element = await screen.findByTestId(triggerTestId);
			await act(async () => {
				await userEvent.click(element);
			});
			const item = await screen.findByTestId(`${testId}-item-0`);
			await act(async () => {
				await userEvent.click(item);
			});

			// making sure error link is not present
			const link = screen.queryByTestId(`${testId}-open-embed`);
			expect(link).toBeNull();
		});

		it('opens preview modal when clicking on error link', async () => {
			const mockInvoke = jest
				.fn()
				.mockResolvedValueOnce([{ id: '1', text: 'Done' }])
				.mockImplementationOnce(() => {
					throw new Error();
				});

			renderComponent(
				{
					action: getAction({
						url,
						id,
						invokePreviewAction: {
							actionFn: jest.fn().mockImplementation(() => {
								openEmbedModal({ ...previewData });
							}),
							actionType: ActionName.PreviewAction,
						},
					}),
				},
				mockInvoke,
			);

			const element = await screen.findByTestId(triggerTestId);
			await act(async () => {
				await userEvent.click(element);
			});
			const item = await screen.findByTestId(`${testId}-item-0`);
			await act(async () => {
				await userEvent.click(item);
			});

			// making sure error link is present
			const link = await screen.findByTestId(`${testId}-open-embed`);
			expect(link).toBeDefined();

			// making sure the preview opens on click
			link.click();

			const previewModal = await screen.findByTestId('smart-embed-preview-modal');
			expect(previewModal).toBeDefined();
		});
	});

	it('reloads the link after the preview modal was closed', async () => {
		const mockInvoke = jest
			.fn()
			.mockResolvedValueOnce([{ id: '1', text: 'Done' }])
			.mockImplementationOnce(() => {
				throw new Error();
			});

		const mockReload = jest.fn();

		renderComponent(
			{
				action: getAction({
					url,
					id,
					invokePreviewAction: {
						actionFn: jest.fn().mockImplementation(() => {
							openEmbedModal({ ...previewData, onClose: () => mockReload(url, true) });
						}),
						actionType: ActionName.PreviewAction,
					},
				}),
			},
			mockInvoke,
			mockReload,
		);

		const element = await screen.findByTestId(triggerTestId);
		await act(async () => {
			await userEvent.click(element);
		});
		const item = await screen.findByTestId(`${testId}-item-0`);
		await act(async () => {
			await userEvent.click(item);
		});

		// making sure error link is present
		const link = await screen.findByTestId(`${testId}-open-embed`);
		expect(link).toBeDefined();

		// making sure the preview opens on click
		link.click();

		const previewModal = await screen.findByTestId('smart-embed-preview-modal');
		expect(previewModal).toBeDefined();

		// making sure the preview modal closes on close button click
		const closeButton = await screen.findByTestId('smart-embed-preview-modal-close-button');
		expect(closeButton).toBeDefined();
		closeButton.click();

		await waitForElementToBeRemoved(() => screen.queryByTestId('smart-embed-preview-modal'));
		expect(mockReload).toHaveBeenCalledWith(url, true);
	});

	it('does not reload the url when an update fails', async () => {
		const mockInvoke = jest
			.fn()
			.mockResolvedValueOnce([{ id: '1', text: 'Done' }])
			.mockImplementationOnce(() => {
				throw new Error();
			});

		const mockResolve = jest.fn();

		renderComponent({ action: getAction() }, mockInvoke, mockResolve);

		const element = await screen.findByTestId(triggerTestId);
		await act(async () => {
			await userEvent.click(element);
		});

		const item = await screen.findByTestId(`${testId}-item-0`);
		await act(async () => {
			await userEvent.click(item);
		});

		const error = await screen.findByTestId(`${testId}-error`);
		expect(error).toBeTruthy();

		await flushPromises();
		expect(mockResolve).toHaveBeenCalledTimes(0);
	});

	it('render action items after update fails and use open dropdown again', async () => {
		const mockInvoke = jest
			.fn()
			.mockResolvedValueOnce([{ id: '1', text: 'Done' }])
			.mockImplementationOnce(() => {
				throw new Error();
			});

		renderComponent({ action: getAction() }, mockInvoke);

		const element = await screen.findByTestId(triggerTestId);
		await act(async () => {
			await userEvent.click(element);
		});
		const item = await screen.findByTestId(`${testId}-item-0`);
		await act(async () => {
			await userEvent.click(item);
		});
		await screen.findByTestId(`${testId}-error`);
		// Close dropdown
		await act(async () => {
			await userEvent.click(element);
		});
		// Open dropdown again
		await act(async () => {
			await userEvent.click(element);
		});

		expect(await screen.findByTestId(`${testId}-item-0`)).toBeInTheDocument();
	});

	describe('analytics', () => {
		it('fires button clicked event with smartLinkStatusLozenge subject id when element is clicked', async () => {
			renderComponent({ action: getAction() });

			const element = await screen.findByTestId(triggerTestId);
			expect(true).toBe(true);
			await act(async () => {
				await userEvent.click(element);
			});
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'button',
					action: 'clicked',
					actionSubjectId: 'smartLinkStatusLozenge',
					attributes: expect.objectContaining({}),
				}),
			);
		});

		it('fires button clicked event with smartLinkStatusListItem subject id when an item is clicked', async () => {
			const mockInvoke = jest.fn().mockResolvedValueOnce([
				{ id: '1', text: 'Done' },
				{ id: '2', text: 'Moved' },
			]);
			renderComponent({ action: getAction() }, mockInvoke);

			const element = await screen.findByTestId(triggerTestId);
			await act(async () => {
				await userEvent.click(element);
			});
			const item = await screen.findByTestId(`${testId}-item-0`);
			await act(async () => {
				await userEvent.click(item);
			});
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'button',
					action: 'clicked',
					actionSubjectId: 'smartLinkStatusListItem',
					attributes: expect.objectContaining({}),
				}),
			);
		});

		it('fires button clicked event with smartLinkStatusOpenPreview subject id when an embed preview is open', async () => {
			const mockInvoke = jest
				.fn()
				.mockResolvedValueOnce([{ id: '1', text: 'Done' }])
				.mockImplementationOnce(() => {
					throw new Error();
				});

			renderComponent(
				{
					action: getAction({
						url,
						id,
						invokePreviewAction: {
							actionFn: jest.fn(),
							actionType: ActionName.PreviewAction,
						},
					}),
				},
				mockInvoke,
			);

			const element = await screen.findByTestId(triggerTestId);
			await act(async () => {
				await userEvent.click(element);
			});
			const item = await screen.findByTestId(`${testId}-item-0`);
			await act(async () => {
				await userEvent.click(item);
			});
			// making sure error link is present
			const link = await screen.findByTestId(`${testId}-open-embed`);
			expect(link).toBeDefined();

			// making sure the preview opens on click
			link.click();
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'button',
					action: 'clicked',
					actionSubjectId: 'smartLinkStatusOpenPreview',
					attributes: expect.objectContaining({}),
				}),
			);
		});

		it('fires smartLinkQuickAction started event when action is initiated', async () => {
			renderComponent({ action: getAction() });
			const element = await screen.findByTestId(triggerTestId);
			await userEvent.click(element);

			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLinkQuickAction',
					action: 'started',
					attributes: expect.objectContaining({
						smartLinkActionType: TrackQuickActionType.StatusUpdate,
					}),
				}),
			);
		});

		it('fires smartLinkQuickAction success event when action has completed successfully', async () => {
			const mockInvoke = jest
				.fn()
				.mockResolvedValueOnce([
					{ id: '1', text: 'Done' },
					{ id: '2', text: 'Moved' },
				])
				.mockResolvedValueOnce(undefined);

			renderComponent({ action: getAction() }, mockInvoke);

			const element = await screen.findByTestId(triggerTestId);
			await userEvent.click(element);
			const item = await screen.findByTestId(`${testId}-item-0`);
			await userEvent.click(item);

			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLinkQuickAction',
					action: 'started',
					attributes: expect.objectContaining({
						smartLinkActionType: TrackQuickActionType.StatusUpdate,
					}),
				}),
			);
			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLinkQuickAction',
					action: 'success',
					attributes: expect.objectContaining({
						smartLinkActionType: TrackQuickActionType.StatusUpdate,
					}),
				}),
			);
		});

		it('fires smartLinkQuickAction failed event when read action fails', async () => {
			const mockInvoke = jest.fn().mockImplementationOnce(() => {
				throw new Error();
			});

			renderComponent({ action: getAction({ url, id }) }, mockInvoke);
			const element = await screen.findByTestId(triggerTestId);
			await userEvent.click(element);

			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLinkQuickAction',
					action: 'started',
					attributes: expect.objectContaining({
						smartLinkActionType: TrackQuickActionType.StatusUpdate,
					}),
				}),
			);
			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLinkQuickAction',
					action: 'failed',
					attributes: expect.objectContaining({
						smartLinkActionType: TrackQuickActionType.StatusUpdate,
						reason: TrackQuickActionFailureReason.UnknownError,
					}),
				}),
			);
		});

		it('fires smartLinkQuickAction failed event when read action returns no data', async () => {
			const mockInvoke = jest
				.fn()
				.mockResolvedValueOnce([{ id: '1', text: 'In Progress', appearance: 'inprogress' }]);

			renderComponent({ action: getAction({ url, id }) }, mockInvoke);

			const element = await screen.findByTestId(triggerTestId);
			await act(async () => {
				await userEvent.click(element);
			});

			await flushPromises();

			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLinkQuickAction',
					action: 'failed',
					attributes: expect.objectContaining({
						smartLinkActionType: TrackQuickActionType.StatusUpdate,
						reason: TrackQuickActionFailureReason.PermissionError,
					}),
				}),
			);
		});

		it('fires smartLinkQuickAction failed event with "UnknowError" reason when update action fails', async () => {
			const mockInvoke = jest
				.fn()
				.mockResolvedValueOnce([{ id: '1', text: 'Done' }])
				.mockImplementationOnce(() => {
					throw new Error();
				});

			renderComponent({ action: getAction({ url, id }) }, mockInvoke);

			const element = await screen.findByTestId(triggerTestId);
			await act(async () => {
				await userEvent.click(element);
			});
			const item = await screen.findByTestId(`${testId}-item-0`);
			await act(async () => {
				await userEvent.click(item);
			});

			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLinkQuickAction',
					action: 'failed',
					attributes: expect.objectContaining({
						smartLinkActionType: TrackQuickActionType.StatusUpdate,
						reason: TrackQuickActionFailureReason.UnknownError,
					}),
				}),
			);
		});

		it('fires smartLinkQuickAction failed event with "ValidationError" reason when update action fails', async () => {
			const mockInvoke = jest
				.fn()
				.mockResolvedValueOnce([{ id: '1', text: 'Done' }])
				.mockImplementationOnce(() => {
					throw new InvokeError('Field labels is required', 400);
				});

			renderComponent({ action: getAction({ url, id }) }, mockInvoke);

			const element = await screen.findByTestId(triggerTestId);
			await act(async () => {
				await userEvent.click(element);
			});
			const item = await screen.findByTestId(`${testId}-item-0`);
			await act(async () => {
				await userEvent.click(item);
			});

			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLinkQuickAction',
					action: 'failed',
					attributes: expect.objectContaining({
						smartLinkActionType: TrackQuickActionType.StatusUpdate,
						reason: TrackQuickActionFailureReason.ValidationError,
					}),
				}),
			);
		});
	});
});
