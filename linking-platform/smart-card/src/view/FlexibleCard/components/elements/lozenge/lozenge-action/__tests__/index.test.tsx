import React from 'react';

import { act, fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { flushPromises } from '@atlaskit/link-test-helpers';
import { InvokeError, SmartLinkActionType } from '@atlaskit/linking-types/smart-link-actions';

import extractLozengeActionItems from '../../../../../../../extractors/action/extract-lozenge-action-items';
import * as useInvoke from '../../../../../../../state/hooks/use-invoke';
import { type CardDetails } from '../../../../../../../state/hooks/use-invoke/types';
import * as useResolve from '../../../../../../../state/hooks/use-resolve';
import {
	TrackQuickActionFailureReason,
	TrackQuickActionType,
} from '../../../../../../../utils/analytics/analytics';
import LozengeAction from '../index';
import { LozengeActionErrorMessages } from '../lozenge-action-error/types';
import { type LozengeActionProps } from '../types';

const mockSmartLinkLozengeActionClickedEvent = jest.fn();
const mockSmartLinkLozengeActionListItemClickedEvent = jest.fn();
const mockSmartLinkLozengeOpenPreviewClickedEvent = jest.fn();
const mockSmartLinkQuickActionStarted = jest.fn();
const mockSmartLinkQuickActionSuccess = jest.fn();
const mockSmartLinkQuickActionFailed = jest.fn();

jest.mock('../../../../../../../state/flexible-ui-context', () => ({
	useFlexibleUiAnalyticsContext: () => ({
		ui: {
			smartLinkLozengeActionClickedEvent: mockSmartLinkLozengeActionClickedEvent,
			smartLinkLozengeActionListItemClickedEvent: mockSmartLinkLozengeActionListItemClickedEvent,
			smartLinkLozengeActionErrorOpenPreviewClickedEvent:
				mockSmartLinkLozengeOpenPreviewClickedEvent,
			renderSuccessEvent: jest.fn(),
			modalClosedEvent: jest.fn(),
		},
		track: {
			smartLinkQuickActionStarted: mockSmartLinkQuickActionStarted,
			smartLinkQuickActionSuccess: mockSmartLinkQuickActionSuccess,
			smartLinkQuickActionFailed: mockSmartLinkQuickActionFailed,
		},
		screen: {
			modalViewedEvent: jest.fn(),
		},
	}),
}));

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
			<IntlProvider locale="en">
				<LozengeAction
					action={props?.action || getAction()}
					appearance={appearance}
					testId={testId}
					text={text}
					{...props}
				/>
			</IntlProvider>
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
		expect(element.textContent?.trim()).toBe(text);
	});

	it('renders element with non-string content', async () => {
		const node = (
			<span>
				{text} <img src="random-image" />
			</span>
		);

		renderComponent({ text: node });

		const element = await screen.findByTestId(triggerTestId);

		expect(element).toBeTruthy();
		expect(element.textContent?.trim()).toBe(text);
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
		act(() => {
			fireEvent.click(element);
		});
		expect(mockInvoke).toHaveBeenCalledTimes(1);
		expect(mockInvoke).toHaveBeenNthCalledWith(1, getAction().read, extractLozengeActionItems);
	});

	it('renders action items', async () => {
		const mockInvoke = jest.fn().mockResolvedValue([{ text: 'Done' }, { text: 'Moved' }]);

		renderComponent({ action: getAction() }, mockInvoke);

		const element = await screen.findByTestId(triggerTestId);
		act(() => {
			fireEvent.click(element);
		});
		const item1 = await screen.findByTestId(`${testId}-item-0`);
		expect(item1).toBeTruthy();
		expect(item1.textContent).toBe('Done');

		const item2 = await screen.findByTestId(`${testId}-item-1`);
		expect(item2).toBeTruthy();
		expect(item2.textContent).toBe('Moved');
	});

	it('does not render active item', async () => {
		const mockInvoke = jest.fn().mockResolvedValue([{ text: 'Done' }, { text }]);

		renderComponent({ action: getAction() }, mockInvoke);

		const element = await screen.findByTestId(triggerTestId);
		act(() => {
			fireEvent.click(element);
		});
		const item1 = await screen.findByTestId(`${testId}-item-0`);
		expect(item1).toBeTruthy();
		expect(item1.textContent).toBe('Done');

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
		act(() => {
			fireEvent.click(element);
		});
		const item1 = await screen.findByTestId(`${testId}-item-0`);
		expect(item1).toBeTruthy();
		expect(item1.textContent).toBe('Done');

		const item2 = await screen.findByTestId(`${testId}-item-1`);
		expect(item2).toBeTruthy();
		expect(item2.textContent).toBe(text);
	});

	it('invokes load action only once', async () => {
		const mockInvoke = jest.fn().mockResolvedValue([{ text: 'Done' }]);

		renderComponent({ action: getAction() }, mockInvoke);

		const element = await screen.findByTestId(triggerTestId);

		// First open (load)
		act(() => {
			fireEvent.click(element);
		});
		await screen.findByTestId(`${testId}-item-0`);
		act(() => {
			fireEvent.click(element);
		});
		// Second open
		act(() => {
			fireEvent.click(element);
		});
		await screen.findByTestId(`${testId}-item-0`);

		expect(mockInvoke).toHaveBeenCalledTimes(1);
	});

	it('renders error view when there is no action items', async () => {
		const mockInvoke = jest.fn().mockResolvedValue([]);

		renderComponent({ action: getAction() }, mockInvoke);

		const element = await screen.findByTestId(triggerTestId);
		act(() => {
			fireEvent.click(element);
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
		act(() => {
			fireEvent.click(element);
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
		expect(element.textContent?.trim()).toBe(text);
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
		act(() => {
			fireEvent.click(element);
		});
		await screen.findByTestId(`${testId}-error`);

		// Close dropdown
		act(() => {
			fireEvent.click(element);
		});
		// Open dropdownagain
		act(() => {
			fireEvent.click(element);
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
		act(() => {
			fireEvent.click(element);
		});
		const item = await screen.findByTestId(`${testId}-item-0`);
		act(() => {
			fireEvent.click(item);
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

		act(() => {
			fireEvent.click(element);
		});
		const item = await screen.findByTestId(itemTestId);
		await act(async () => {
			fireEvent.click(item);
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
		act(() => {
			fireEvent.click(element);
		});

		const item = await screen.findByTestId(itemTestId);
		act(() => {
			fireEvent.click(item);
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
		act(() => {
			fireEvent.click(element);
		});
		const item = await screen.findByTestId(`${testId}-item-0`);
		act(() => {
			fireEvent.click(item);
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
		act(() => {
			fireEvent.click(element);
		});
		const item = await screen.findByTestId(`${testId}-item-0`);
		act(() => {
			fireEvent.click(item);
		});

		// making sure error message is correct
		const error = await screen.findByTestId(`${testId}-error-message`);
		expect(error).toBeTruthy();
		expect(error.textContent).toBe('Field Labels must be provided');
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
						previewData,
					}),
				},
				mockInvoke,
			);

			const element = await screen.findByTestId(triggerTestId);
			act(() => {
				fireEvent.click(element);
			});
			const item = await screen.findByTestId(`${testId}-item-0`);
			act(() => {
				fireEvent.click(item);
			});

			// making sure error link is present
			const link = await screen.findByTestId(`${testId}-open-embed`);
			expect(link).toBeDefined();
			expect(link.textContent).toBe('Open issue in Jira');
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
			act(() => {
				fireEvent.click(element);
			});
			const item = await screen.findByTestId(`${testId}-item-0`);
			act(() => {
				fireEvent.click(item);
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
						previewData,
					}),
				},
				mockInvoke,
			);

			const element = await screen.findByTestId(triggerTestId);
			act(() => {
				fireEvent.click(element);
			});
			const item = await screen.findByTestId(`${testId}-item-0`);
			act(() => {
				fireEvent.click(item);
			});

			// making sure error link is present
			const link = await screen.findByTestId(`${testId}-open-embed`);
			expect(link).toBeDefined();

			// making sure the preview opens on click
			link.click();

			const previewModal = await screen.findByTestId('smart-embed-preview-modal');
			expect(previewModal).toBeDefined();
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
						previewData,
					}),
				},
				mockInvoke,
				mockReload,
			);

			const element = await screen.findByTestId(triggerTestId);
			act(() => {
				fireEvent.click(element);
			});
			const item = await screen.findByTestId(`${testId}-item-0`);
			act(() => {
				fireEvent.click(item);
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
		act(() => {
			fireEvent.click(element);
		});

		const item = await screen.findByTestId(`${testId}-item-0`);
		act(() => {
			fireEvent.click(item);
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
		act(() => {
			fireEvent.click(element);
		});
		const item = await screen.findByTestId(`${testId}-item-0`);
		act(() => {
			fireEvent.click(item);
		});
		await screen.findByTestId(`${testId}-error`);
		// Close dropdown
		act(() => {
			fireEvent.click(element);
		});
		// Open dropdown again
		act(() => {
			fireEvent.click(element);
		});

		expect(await screen.findByTestId(`${testId}-item-0`)).toBeInTheDocument();
	});

	describe('analytics', () => {
		it('fires button clicked event with smartLinkStatusLozenge subject id when element is clicked', async () => {
			renderComponent({ action: getAction() });

			const element = await screen.findByTestId(triggerTestId);
			act(() => {
				fireEvent.click(element);
			});
			expect(mockSmartLinkLozengeActionClickedEvent).toHaveBeenCalledTimes(1);
		});

		it('fires button clicked event with smartLinkStatusListItem subject id when an item is clicked', async () => {
			const mockInvoke = jest.fn().mockResolvedValueOnce([
				{ id: '1', text: 'Done' },
				{ id: '2', text: 'Moved' },
			]);
			renderComponent({ action: getAction() }, mockInvoke);

			const element = await screen.findByTestId(triggerTestId);
			act(() => {
				fireEvent.click(element);
			});
			const item = await screen.findByTestId(`${testId}-item-0`);
			act(() => {
				fireEvent.click(item);
			});
			expect(mockSmartLinkLozengeActionListItemClickedEvent).toHaveBeenCalledTimes(1);
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
						previewData,
					}),
				},
				mockInvoke,
			);

			const element = await screen.findByTestId(triggerTestId);
			act(() => {
				fireEvent.click(element);
			});
			const item = await screen.findByTestId(`${testId}-item-0`);
			act(() => {
				fireEvent.click(item);
			});

			// making sure error link is present
			const link = await screen.findByTestId(`${testId}-open-embed`);
			expect(link).toBeDefined();

			// making sure the preview opens on click
			link.click();

			expect(mockSmartLinkLozengeOpenPreviewClickedEvent).toHaveBeenCalledTimes(1);
		});

		it('fires smartLinkQuickAction started event when action is initiated', async () => {
			renderComponent({ action: getAction() });

			const element = await screen.findByTestId(triggerTestId);
			act(() => {
				fireEvent.click(element);
			});

			expect(mockSmartLinkQuickActionStarted).toHaveBeenCalledTimes(1);
			expect(mockSmartLinkQuickActionStarted).toHaveBeenCalledWith({
				smartLinkActionType: TrackQuickActionType.StatusUpdate,
			});
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
			act(() => {
				fireEvent.click(element);
			});
			const item = await screen.findByTestId(`${testId}-item-0`);
			act(() => {
				fireEvent.click(item);
			});
			await flushPromises();

			expect(mockSmartLinkQuickActionSuccess).toHaveBeenCalledTimes(1);
			expect(mockSmartLinkQuickActionSuccess).toHaveBeenCalledWith({
				smartLinkActionType: TrackQuickActionType.StatusUpdate,
			});
		});

		it('fires smartLinkQuickAction failed event when read action fails', async () => {
			const mockInvoke = jest.fn().mockImplementationOnce(() => {
				throw new Error();
			});

			renderComponent({ action: getAction({ url, id }) }, mockInvoke);

			const element = await screen.findByTestId(triggerTestId);
			act(() => {
				fireEvent.click(element);
			});

			expect(mockSmartLinkQuickActionFailed).toHaveBeenCalledTimes(1);
			expect(mockSmartLinkQuickActionFailed).toHaveBeenCalledWith({
				smartLinkActionType: TrackQuickActionType.StatusUpdate,
				reason: TrackQuickActionFailureReason.UnknownError,
				step: 'load',
			});
		});

		it('fires smartLinkQuickAction failed event when read action returns no data', async () => {
			const mockInvoke = jest
				.fn()
				.mockResolvedValueOnce([{ id: '1', text: 'In Progress', appearance: 'inprogress' }]);

			renderComponent({ action: getAction({ url, id }) }, mockInvoke);

			const element = await screen.findByTestId(triggerTestId);
			act(() => {
				fireEvent.click(element);
			});

			await flushPromises();

			expect(mockSmartLinkQuickActionFailed).toHaveBeenCalledTimes(1);
			expect(mockSmartLinkQuickActionFailed).toHaveBeenCalledWith({
				smartLinkActionType: TrackQuickActionType.StatusUpdate,
				reason: TrackQuickActionFailureReason.PermissionError,
				step: 'load',
			});
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
			act(() => {
				fireEvent.click(element);
			});
			const item = await screen.findByTestId(`${testId}-item-0`);
			act(() => {
				fireEvent.click(item);
			});

			expect(mockSmartLinkQuickActionFailed).toHaveBeenCalledTimes(1);
			expect(mockSmartLinkQuickActionFailed).toHaveBeenCalledWith({
				smartLinkActionType: TrackQuickActionType.StatusUpdate,
				reason: TrackQuickActionFailureReason.UnknownError,
				step: 'update',
			});
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
			act(() => {
				fireEvent.click(element);
			});
			const item = await screen.findByTestId(`${testId}-item-0`);
			act(() => {
				fireEvent.click(item);
			});

			expect(mockSmartLinkQuickActionFailed).toHaveBeenCalledTimes(1);
			expect(mockSmartLinkQuickActionFailed).toHaveBeenCalledWith({
				smartLinkActionType: TrackQuickActionType.StatusUpdate,
				reason: TrackQuickActionFailureReason.ValidationError,
				step: 'update',
			});
		});
	});
});
