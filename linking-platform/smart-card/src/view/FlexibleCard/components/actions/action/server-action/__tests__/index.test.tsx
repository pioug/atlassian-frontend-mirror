/* eslint-disable testing-library/no-unnecessary-act */
import React from 'react';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { flushPromises } from '@atlaskit/link-test-helpers';
import { SmartLinkActionType } from '@atlaskit/linking-types/smart-link-actions';

import * as useInvoke from '../../../../../../../state/hooks/use-invoke';
import * as useResolve from '../../../../../../../state/hooks/use-resolve';
import ServerAction from '../index';
import { type ServerActionProps } from '../types';

describe('ServerAction', () => {
	const testId = 'server-action-test-id';

	afterEach(() => {
		jest.clearAllMocks();
	});

	const mockAnalyticsClient = {
		sendUIEvent: jest.fn().mockResolvedValue(undefined),
		sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
		sendTrackEvent: jest.fn().mockResolvedValue(undefined),
		sendScreenEvent: jest.fn().mockResolvedValue(undefined),
	} satisfies AnalyticsWebClient;

	const getAction = () => ({
		action: {
			actionType: SmartLinkActionType.FollowEntityAction,
			resourceIdentifiers: {
				prop1: 'prop-1',
				prop2: 'prop-2',
			},
		},
		providerKey: 'object-provider',
		reload: {
			id: 'some-id',
			url: 'https://my.url.com',
		},
	});

	const renderComponent = (
		props?: Partial<ServerActionProps>,
		mockInvoke = jest.fn(),
		mockResolve = jest.fn(),
	) => {
		jest.spyOn(useInvoke, 'default').mockReturnValue(mockInvoke);
		jest.spyOn(useResolve, 'default').mockReturnValue(mockResolve);

		const component = (
			<FabricAnalyticsListeners client={mockAnalyticsClient}>
				<IntlProvider locale="en">
					<ServerAction
						action={props?.action || getAction()}
						content="button text"
						testId={testId}
						{...props}
					/>
				</IntlProvider>
			</FabricAnalyticsListeners>
		);

		const result = render(component);

		return { ...result, component };
	};

	it('renders server action', async () => {
		renderComponent();

		const element = await screen.findByTestId(testId);

		expect(element).toBeInTheDocument();
	});

	it('invokes server action', async () => {
		const action = getAction();
		const expectedRequest = {
			action: action.action,
			providerKey: action.providerKey,
		};
		const mockInvoke = jest.fn();
		renderComponent({ action }, mockInvoke);

		const element = await screen.findByTestId(testId);
		await act(async () => {
			await userEvent.click(element);
		});

		expect(mockInvoke).toHaveBeenCalledTimes(1);
		expect(mockInvoke).toHaveBeenNthCalledWith(1, expectedRequest);
	});

	it('reloads the url after invoke success', async () => {
		const action = getAction();
		const mockInvoke = jest.fn().mockImplementationOnce(() => Promise.resolve());
		const mockResolve = jest.fn();

		renderComponent({ action }, mockInvoke, mockResolve);

		const element = await screen.findByTestId(testId);
		await act(async () => {
			await userEvent.click(element);
		});

		await flushPromises();

		expect(mockResolve).toHaveBeenCalledTimes(1);
		expect(mockResolve).toHaveBeenCalledWith(action.reload.url, true, undefined, action.reload.id);
	});

	it('does not reloads the url after invoke fails', async () => {
		const action = getAction();
		const mockInvoke = jest.fn().mockImplementationOnce(() => Promise.reject());

		const mockResolve = jest.fn();

		renderComponent({ action }, mockInvoke, mockResolve);

		const element = await screen.findByTestId(testId);
		await act(async () => {
			await userEvent.click(element);
		});

		await flushPromises();

		expect(mockResolve).not.toHaveBeenCalled();
	});

	// @see packages/linking-platform/smart-card/src/view/__tests__/analytics/action.test.tsx
	// for a more comprehensive analytics tests
	describe('analytics', () => {
		it('fires analytics events on action success', async () => {
			const action = getAction();
			renderComponent({ action });

			const element = await screen.findByTestId(testId);
			await userEvent.click(element);

			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'button',
					action: 'clicked',
					actionSubjectId: 'smartLinkFollowButton',
					attributes: expect.objectContaining({}),
				}),
			);
			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLinkQuickAction',
					action: 'started',
				}),
			);
			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLinkQuickAction',
					action: 'success',
				}),
			);
		});

		it('fires analytics events on action fails', async () => {
			const action = getAction();
			const mockInvoke = jest.fn().mockImplementationOnce(() => Promise.reject());
			renderComponent({ action }, mockInvoke);

			const element = await screen.findByTestId(testId);
			await userEvent.click(element);

			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'button',
					action: 'clicked',
					actionSubjectId: 'smartLinkFollowButton',
					attributes: expect.objectContaining({}),
				}),
			);
			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLinkQuickAction',
					action: 'started',
				}),
			);
			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLinkQuickAction',
					action: 'failed',
				}),
			);
		});
	});
	it('should capture and report a11y violations', async () => {
		const action = getAction();
		const mockInvoke = jest.fn().mockImplementationOnce(() => Promise.reject());
		const { container } = renderComponent({ action }, mockInvoke);
		await expect(container).toBeAccessible();
	});
});
