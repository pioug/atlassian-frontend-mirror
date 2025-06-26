import '@atlaskit/link-test-helpers/jest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { type CardClient, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { asMockFunction } from '@atlaskit/media-test-helpers/jestHelpers';
import { auth, AuthError } from '@atlaskit/outbound-auth-flow-client';

import { fakeFactory, mocks } from '../../../utils/mocks';
import { Card } from '../../Card';

jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) => data.children);
jest.mock('../../../utils/analytics/analytics');
jest.mock('@atlaskit/outbound-auth-flow-client', () => {
	const { AuthError } = jest.requireActual('@atlaskit/outbound-auth-flow-client');
	return {
		auth: jest.fn(),
		AuthError,
	};
});

mockSimpleIntersectionObserver();

describe('smart-card: forbidden analytics', () => {
	let mockClient: CardClient;
	let mockFetch: jest.Mock;
	let mockWindowOpen: jest.Mock;
	const mockAnalyticsClient = {
		sendUIEvent: jest.fn().mockResolvedValue(undefined),
		sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
		sendTrackEvent: jest.fn().mockResolvedValue(undefined),
		sendScreenEvent: jest.fn().mockResolvedValue(undefined),
	} satisfies AnalyticsWebClient;

	beforeEach(() => {
		mockFetch = jest.fn(async () => mocks.forbidden);
		mockClient = new (fakeFactory(mockFetch))();
		mockWindowOpen = jest.fn();
		/// @ts-ignore
		global.open = mockWindowOpen;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('forbidden', () => {
		it('should capture and report a11y violations', async () => {
			const mockUrl = 'https://https://this.is.a.url';
			const { container } = render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card testId="forbiddenCard1" appearance="inline" url={mockUrl} />
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);

			await expect(container).toBeAccessible();
		});

		it.each(['FORBIDDEN', 'REQUEST_ACCESS', 'DIRECT_ACCESS', 'ANY_OTHER_VALUE', undefined])(
			'should have status forbidden and statusdetails=%s for analytics',
			async (accessType) => {
				mockFetch.mockReturnValueOnce({
					...mocks.forbidden,
					meta: {
						...mocks.forbidden.meta,
						requestAccess: {
							accessType,
						},
					},
				});
				const mockUrl = 'https://some.url';

				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<IntlProvider locale="en">
							<Provider client={mockClient}>
								<Card id="some-id" testId="forbiddenCard1" appearance="inline" url={mockUrl} />
							</Provider>
						</IntlProvider>
					</FabricAnalyticsListeners>,
				);
				const forbiddenLink = await screen.findByTestId('forbiddenCard1-forbidden-view');
				expect(forbiddenLink).toBeInTheDocument();
				expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'unresolved',
						actionSubject: 'smartLink',
						attributes: expect.objectContaining({
							display: 'inline',
							id: 'some-id',
							reason: 'forbidden',
							error: null,
							statusDetails: accessType ?? null,
						}),
					}),
				);
			},
		);

		it('should fire analytics events when attempting to connect with an alternate account succeeds', async () => {
			const mockUrl = 'https://https://this.is.a.url';
			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card testId="forbiddenCard1" appearance="inline" url={mockUrl} />
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);

			await screen.findByTestId('forbiddenCard1-forbidden-view');
			const forbiddenLinkButton = await screen.findByRole('button');
			const forbiddenLinkButtonHTML = forbiddenLinkButton as HTMLElement;
			expect(forbiddenLinkButtonHTML.innerText).toContain('Restricted content');

			// Mock out auth flow, & click connect.
			asMockFunction(auth).mockImplementationOnce(async () => {});

			mockFetch.mockImplementationOnce(async () => mocks.success);
			await userEvent.click(forbiddenLinkButton);
			const resolvedView = await screen.findByTestId('forbiddenCard1-resolved-view');
			expect(resolvedView).toBeTruthy();

			expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLink',
					action: 'unresolved',
					attributes: expect.objectContaining({
						id: expect.any(String),
						status: 'forbidden',
						extensionKey: 'object-provider',
						definitionId: 'd1',
						reason: 'forbidden',
					}),
				}),
			);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'smartLink',
					actionSubjectId: 'tryAnotherAccount',
					attributes: expect.objectContaining({
						id: expect.any(String),
						status: 'forbidden',
						extensionKey: 'object-provider',
						definitionId: 'd1',
						display: 'inline',
					}),
				}),
			);
			expect(mockAnalyticsClient.sendScreenEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'viewed',
					name: 'consentModal',
					attributes: expect.objectContaining({
						display: 'inline',
						extensionKey: 'object-provider',
						definitionId: 'd1',
					}),
				}),
			);

			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'applicationAccount',
					action: 'connected',
					attributes: expect.objectContaining({
						display: 'inline',
						status: 'forbidden',
						extensionKey: 'object-provider',
						definitionId: 'd1',
					}),
				}),
			);
			expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLink',
					action: 'connectSucceeded',
					attributes: expect.objectContaining({
						definitionId: 'd1',
					}),
				}),
			);
		});

		it('should fire analytics events when attempting to connect with an alternate account fails', async () => {
			const mockUrl = 'https://this.is.the.fifth.url';
			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card testId="forbiddenCard2" appearance="inline" url={mockUrl} />
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);
			await screen.findByTestId('forbiddenCard2-forbidden-view');
			const forbiddenLinkButton = await screen.findByRole('button');
			expect(forbiddenLinkButton).toBeInTheDocument();
			expect(forbiddenLinkButton).toBeTruthy();
			const forbiddenLinkButtonHTML = forbiddenLinkButton as HTMLElement;
			expect(forbiddenLinkButtonHTML.innerText).toContain('Restricted content');
			// Mock out auth flow, & click connect.
			asMockFunction(auth).mockImplementationOnce(() => Promise.reject(new AuthError('')));
			mockFetch.mockImplementationOnce(async () => mocks.success);

			await userEvent.click(forbiddenLinkButton);
			const unresolvedView = await screen.findByTestId('forbiddenCard2-resolved-view');
			expect(unresolvedView).toBeTruthy();
			expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLink',
					action: 'unresolved',
					attributes: expect.objectContaining({
						id: expect.any(String),
						status: 'forbidden',
						extensionKey: 'object-provider',
						definitionId: 'd1',
						reason: 'forbidden',
					}),
				}),
			);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'smartLink',
					actionSubjectId: 'tryAnotherAccount',
					attributes: expect.objectContaining({
						id: expect.any(String),
						status: 'forbidden',
						extensionKey: 'object-provider',
						definitionId: 'd1',
						display: 'inline',
					}),
				}),
			);
			expect(mockAnalyticsClient.sendScreenEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'viewed',
					name: 'consentModal',
					attributes: expect.objectContaining({
						display: 'inline',
						extensionKey: 'object-provider',
						definitionId: 'd1',
					}),
				}),
			);
			expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'connectFailed',
					actionSubject: 'smartLink',
					attributes: expect.objectContaining({
						id: expect.any(String),
						extensionKey: 'object-provider',
						definitionId: 'd1',
					}),
				}),
			);
		});
	});
});
