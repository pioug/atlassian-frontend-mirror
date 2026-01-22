jest.mock('../../../utils/shouldSample');
import './unauthorized.test.mock';

import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as jestExtendedMatchers from 'jest-extended';
import { IntlProvider } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import { type CardClient, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { asMockFunction, type JestFunction } from '@atlaskit/media-test-helpers';
import { auth, AuthError } from '@atlaskit/outbound-auth-flow-client';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import * as ufoWrapper from '../../../state/analytics/ufoExperiences';
import { fakeFactory, mocks } from '../../../utils/mocks';
import { Card, type CardAppearance } from '../../Card';

// ShouldSample needs to be loaded for beforeEach inside to be picked up before test runs
import '../../../utils/shouldSample';

mockSimpleIntersectionObserver();

expect.extend(jestExtendedMatchers);

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

describe('smart-card: unauthorized analytics', () => {
	let mockClient: CardClient;
	let mockFetch: jest.Mock;
	let mockWindowOpen: jest.Mock;

	const mockUuid = uuid as JestFunction<typeof uuid>;
	const mockStartUfoExperience = jest.spyOn(ufoWrapper, 'startUfoExperience');
	const mockSucceedUfoExperience = jest.spyOn(ufoWrapper, 'succeedUfoExperience');
	const mockAnalyticsClient = {
		sendUIEvent: jest.fn().mockResolvedValue(undefined),
		sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
		sendTrackEvent: jest.fn().mockResolvedValue(undefined),
		sendScreenEvent: jest.fn().mockResolvedValue(undefined),
	} satisfies AnalyticsWebClient;

	beforeEach(() => {
		mockFetch = jest.fn(async () => mocks.success);
		mockClient = new (fakeFactory(mockFetch))();
		mockWindowOpen = jest.fn();
		mockUuid.mockReturnValue('some-uuid-1');
		/// @ts-ignore
		global.open = mockWindowOpen;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('unauthorized', () => {
		it('should capture and report a11y violations', async () => {
			const mockUrl = 'https://https://this.is.a.url';
			mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
			const { container } = render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card testId="unauthorizedCard1" appearance="inline" url={mockUrl} />
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);

			await expect(container).toBeAccessible();
		});

		it('should fire clicked event when the link is clicked', async () => {
			const mockUrl = 'https://https://this.is.a.url';
			mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card testId="unauthorizedCard1" appearance="inline" url={mockUrl} />
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);

			const unauthorizedLink = await waitFor(
				() =>
					screen.getByTestId('unauthorizedCard1-unauthorized-view').getElementsByTagName('a')[0],

				{ timeout: 10000 },
			);
			expect(unauthorizedLink).toBeTruthy();
			await userEvent.click(unauthorizedLink);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'smartLink',
					attributes: expect.objectContaining({
						display: 'inline',
						status: 'unauthorized',
						definitionId: 'd1',
						id: 'some-uuid-1',
						extensionKey: 'object-provider',
						isModifierKeyPressed: false,
					}),
				}),
			);
		});

		it.each<CardAppearance>(['block', 'embed'])(
			'should fire "learn more" clicked event when the button is clicked',
			async (appearance) => {
				const mockUrl = 'https://https://this.is.a.url';
				mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<IntlProvider locale="en">
							<Provider client={mockClient}>
								<Card appearance={appearance as CardAppearance} url={mockUrl} testId="test" />
							</Provider>
						</IntlProvider>
					</FabricAnalyticsListeners>,
				);

				const learnMoreButton = await screen.findByTestId(
					'test-learn-more',
					{},
					{ timeout: 10000 },
				);
				expect(learnMoreButton).toBeTruthy();
				await userEvent.click(learnMoreButton!);
				expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						actionSubject: 'button',
						action: 'clicked',
						actionSubjectId: 'learnMore',
						attributes: expect.objectContaining({
							display: appearance,
							id: 'some-uuid-1',
							status: 'unauthorized',
							extensionKey: 'object-provider',
						}),
					}),
				);
			},
		);

		it('should fire clicked event when the "learn more" button is clicked on unauthorized hover card', async () => {
			const mockUrl = 'https://this.is.a.url';
			mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card
								url={mockUrl}
								appearance="inline"
								testId="unauthorized-inline-card"
								showHoverPreview={true}
							/>
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);

			const unauthorizedLink = await screen.findByTestId(
				'unauthorized-inline-card-unauthorized-view',
				{},
				{ timeout: 10000 },
			);

			await userEvent.hover(unauthorizedLink);
			const authTooltip = await screen.findByTestId('hover-card-unauthorised-view');

			expect(authTooltip).toBeTruthy();

			const learnMoreButton = screen.getByTestId('unauthorised-view-content-learn-more');
			expect(learnMoreButton).toBeTruthy();

			await userEvent.click(learnMoreButton!);

			// verify ui button clicked event is fired
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'button',
					action: 'clicked',
					actionSubjectId: 'learnMore',
					attributes: expect.objectContaining({
						display: 'hoverCardPreview',
						id: 'some-uuid-1',
						status: 'unauthorized',
						extensionKey: 'object-provider',
					}),
				}),
			);
		});

		it.each<[CardAppearance, string]>([
			['block', 'smart-action-connect-account'],
			['embed', 'connect-account'],
		])(
			'should fire analytics events when the connect button is clicked on %s card',
			async (card, buttonTestId) => {
				const mockUrl = 'https://https://this.is.a.url';
				mockFetch.mockImplementationOnce(async () => mocks.unauthorized);

				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<IntlProvider locale="en">
							<AnalyticsContext
								data={{
									attributes: {
										definitionId: 'd1',
									},
								}}
							>
								<Provider client={mockClient}>
									<Card appearance={card} url={mockUrl} />
								</Provider>
							</AnalyticsContext>
						</IntlProvider>
					</FabricAnalyticsListeners>,
				);

				const connectButton = await screen.findByTestId(buttonTestId, {}, { timeout: 10000 });
				expect(connectButton).toBeTruthy();
				asMockFunction(auth).mockImplementationOnce(async () => {});
				await userEvent.click(connectButton!);

				// verify ui button clicked event is fired
				expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'clicked',
						actionSubject: 'button',
						actionSubjectId: 'connectAccount',
						attributes: expect.objectContaining({
							display: card,
							definitionId: 'd1',
							extensionKey: 'object-provider',
							id: 'some-uuid-1',
							status: 'unauthorized',
						}),
					}),
				);

				// verify track event authStarted is fired
				expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						actionSubject: 'applicationAccount',
						action: 'authStarted',
						attributes: expect.objectContaining({
							display: card,
							definitionId: 'd1',
							extensionKey: 'object-provider',
							id: 'some-uuid-1',
							status: 'unauthorized',
						}),
					}),
				);
				// verify track event connected is fired
				expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						actionSubject: 'applicationAccount',
						action: 'connected',
						attributes: expect.objectContaining({
							display: card,
							definitionId: 'd1',
							extensionKey: 'object-provider',
							id: 'some-uuid-1',
							status: 'unauthorized',
						}),
					}),
				);
			},
		);

		it('should fire clicked event when the connect button is clicked on unauthorized hover card', async () => {
			const mockUrl = 'https://https://this.is.a.url';
			mockFetch.mockImplementationOnce(async () => mocks.unauthorized);

			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<AnalyticsContext
							data={{
								attributes: {
									definitionId: 'd1',
								},
							}}
						>
							<Provider client={mockClient}>
								<Card
									url={mockUrl}
									appearance="inline"
									testId="unauthorized-inline-card"
									showHoverPreview={true}
								/>
							</Provider>
						</AnalyticsContext>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);

			const unauthorizedLink = await screen.findByTestId(
				'unauthorized-inline-card-unauthorized-view',
				{},
				{ timeout: 10000 },
			);

			await userEvent.hover(unauthorizedLink);

			const authTooltip = await screen.findByTestId('hover-card-unauthorised-view');

			expect(authTooltip).toBeTruthy();

			const connectButton = screen.getByTestId('smart-action');
			expect(connectButton).toBeTruthy();

			asMockFunction(auth).mockImplementationOnce(async () => {});
			await userEvent.click(connectButton!);

			// verify ui button clicked event is fired
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'connectAccount',
					attributes: expect.objectContaining({
						display: 'hoverCardPreview',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						id: 'some-uuid-1',
						status: 'unauthorized',
					}),
				}),
			);

			// verify track event authStarted is fired
			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'applicationAccount',
					action: 'authStarted',
					attributes: expect.objectContaining({
						display: 'hoverCardPreview',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						id: 'some-uuid-1',
						status: 'unauthorized',
					}),
				}),
			);
			// verify track event connected is fired
			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'applicationAccount',
					action: 'connected',
					attributes: expect.objectContaining({
						display: 'hoverCardPreview',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						id: 'some-uuid-1',
						status: 'unauthorized',
					}),
				}),
			);
		});

		it('should fire clicked event when the connect button is clicked on unauthorized inline card', async () => {
			const mockUrl = 'https://https://this.is.a.url';
			mockFetch.mockImplementationOnce(async () => mocks.unauthorized);

			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<AnalyticsContext
							data={{
								attributes: {
									definitionId: 'd1',
								},
							}}
						>
							<Provider client={mockClient}>
								<Card url={mockUrl} appearance="inline" testId="unauthorized-inline-card" />
							</Provider>
						</AnalyticsContext>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);

			const connectButton = await screen.findByTestId(
				'button-connect-account',
				{},
				{ timeout: 10000 },
			);

			expect(connectButton).toBeTruthy();

			asMockFunction(auth).mockImplementationOnce(async () => {});
			await userEvent.click(connectButton!);

			// verify ui button clicked event is fired
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'connectAccount',
					attributes: expect.objectContaining({
						display: 'inline',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						id: 'some-uuid-1',
						status: 'unauthorized',
					}),
				}),
			);

			// verify track event authStarted is fired
			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'applicationAccount',
					action: 'authStarted',
					attributes: expect.objectContaining({
						display: 'inline',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						id: 'some-uuid-1',
						status: 'unauthorized',
					}),
				}),
			);
			// verify track event connected is fired
			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'applicationAccount',
					action: 'connected',
					attributes: expect.objectContaining({
						display: 'inline',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						id: 'some-uuid-1',
						status: 'unauthorized',
					}),
				}),
			);
		});

		it('should fire success event when the link is rendered', async () => {
			const mockUrl = 'https://https://this.is.a.url';
			mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card testId="unauthorizedCard1" appearance="inline" url={mockUrl} />
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);

			const unauthorizedLink = await screen.findByTestId(
				'unauthorizedCard1-unauthorized-view',
				{},
				{ timeout: 10000 },
			);
			expect(unauthorizedLink).toBeTruthy();
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'renderSuccess',
					actionSubject: 'smartLink',
					attributes: expect.objectContaining({
						display: 'inline',
						status: 'unauthorized',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						canBeDatasource: false,
					}),
				}),
			);
		});

		it('should fire connectSucceeded event when auth succeeds', async () => {
			const mockUrl = 'https://https://this.is.a.url';
			mockFetch.mockImplementationOnce(async () => mocks.unauthorized);

			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<AnalyticsContext
							data={{
								attributes: {
									definitionId: 'd1',
								},
							}}
						>
							<Provider client={mockClient}>
								<Card testId="unauthorizedCard1" appearance="inline" url={mockUrl} />
							</Provider>
						</AnalyticsContext>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);

			const unauthorizedLink = await screen.findByTestId(
				'unauthorizedCard1-unauthorized-view',
				{},
				{ timeout: 10000 },
			);
			const unauthorizedLinkButton = screen.getByTestId('button-connect-account');
			expect(unauthorizedLink).toBeTruthy();
			expect(unauthorizedLinkButton).toBeTruthy();
			expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
			// Mock out auth flow, & click connect.
			asMockFunction(auth).mockImplementationOnce(async () => {});
			await userEvent.click(unauthorizedLinkButton!);

			mockFetch.mockImplementationOnce(async () => mocks.success);
			const resolvedView = await screen.findByTestId('unauthorizedCard1-resolved-view');
			expect(resolvedView).toBeTruthy();

			expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLink',
					action: 'unresolved',
					attributes: expect.objectContaining({
						id: expect.any(String),
						status: 'unauthorized',
						extensionKey: 'object-provider',
						definitionId: 'd1',
						reason: 'unauthorized',
					}),
				}),
			);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'connectAccount',
					attributes: expect.objectContaining({
						display: 'inline',
						extensionKey: 'object-provider',
						definitionId: 'd1',
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
						definitionId: 'd1',
						extensionKey: 'object-provider',
						id: 'some-uuid-1',
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
			expect(mockStartUfoExperience).toHaveBeenCalledWith(
				'smart-link-authenticated',
				'some-uuid-1',
				{
					extensionKey: 'object-provider',
					status: 'success',
				},
			);

			expect(mockSucceedUfoExperience).toHaveBeenCalledWith(
				'smart-link-authenticated',
				'some-uuid-1',
				{
					display: 'inline',
				},
			);
			expect(mockStartUfoExperience).toHaveBeenCalledBefore(mockSucceedUfoExperience as jest.Mock);
		});

		it.each<string>([`${undefined}`, 'access_denied'])(
			'should fire connectFailed event when auth fails with errorType = $errorType',
			async (errorType) => {
				const mockUrl = 'https://https://this.is.the.second.url';
				mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<IntlProvider locale="en">
							<Provider client={mockClient}>
								<Card testId="unauthorizedCard2" appearance="inline" url={mockUrl} />
							</Provider>
						</IntlProvider>
					</FabricAnalyticsListeners>,
				);
				const unauthorizedLink = await screen.findByTestId(
					'unauthorizedCard2-unauthorized-view',
					{},
					{ timeout: 10000 },
				);
				const unauthorizedLinkButton = screen.getByTestId('button-connect-account');
				expect(unauthorizedLink).toBeTruthy();
				expect(unauthorizedLinkButton).toBeTruthy();
				expect(unauthorizedLinkButton.innerHTML).toContain('Connect');
				// Mock out auth flow, & click connect.
				asMockFunction(auth).mockImplementationOnce(() =>
					Promise.reject(new AuthError('', errorType as any)),
				);

				// todo: determine why this test breaks when using userEvent.click()
				fireEvent.click(unauthorizedLinkButton);

				const unresolvedView = await screen.findByTestId(
					'unauthorizedCard2-unauthorized-view',
					{},
					{ timeout: 10000 },
				);
				expect(unresolvedView).toBeTruthy();
				expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						actionSubject: 'smartLink',
						action: 'unresolved',
						attributes: expect.objectContaining({
							id: expect.any(String),
							status: 'unauthorized',
							extensionKey: 'object-provider',
							definitionId: 'd1',
							reason: 'unauthorized',
						}),
					}),
				);
				expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'clicked',
						actionSubject: 'button',
						actionSubjectId: 'connectAccount',
						attributes: expect.objectContaining({
							display: 'inline',
							definitionId: 'd1',
							extensionKey: 'object-provider',
							id: 'some-uuid-1',
							status: 'unauthorized',
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
							definitionId: 'd1',
							extensionKey: 'object-provider',
							reason: errorType,
							id: expect.any(String),
						}),
					}),
				);

				expect(mockStartUfoExperience).toHaveBeenCalledWith(
					'smart-link-authenticated',
					'some-uuid-1',
					{
						extensionKey: 'object-provider',
						status: errorType,
					},
				);

				expect(mockSucceedUfoExperience).toHaveBeenCalledWith(
					'smart-link-authenticated',
					'some-uuid-1',
					{
						display: 'inline',
					},
				);
			},
		);

		it('should fire connectFailed when auth dialog was closed', async () => {
			const mockUrl = 'https://https://this.is.the.third.url';
			mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card testId="unauthorizedCard3" appearance="inline" url={mockUrl} />
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);
			const unauthorizedLink = await screen.findByTestId(
				'unauthorizedCard3-unauthorized-view',
				{},
				{ timeout: 10000 },
			);
			const unauthorizedLinkButton = screen.getByTestId('button-connect-account');
			expect(unauthorizedLink).toBeTruthy();
			expect(unauthorizedLinkButton).toBeTruthy();
			expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
			// Mock out auth flow, & click connect.
			asMockFunction(auth).mockImplementationOnce(() =>
				Promise.reject(new AuthError('', 'auth_window_closed')),
			);
			await userEvent.click(unauthorizedLinkButton!);

			const resolvedView = await screen.findByTestId(
				'unauthorizedCard3-resolved-view',
				{},
				{ timeout: 10000 },
			);
			expect(resolvedView).toBeTruthy();
			expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLink',
					action: 'unresolved',
					attributes: expect.objectContaining({
						id: expect.any(String),
						status: 'unauthorized',
						extensionKey: 'object-provider',
						definitionId: 'd1',
						reason: 'unauthorized',
					}),
				}),
			);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'connectAccount',
					attributes: expect.objectContaining({
						display: 'inline',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						id: 'some-uuid-1',
						status: 'unauthorized',
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
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'closed',
					actionSubject: 'consentModal',
					attributes: expect.objectContaining({
						display: 'inline',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						id: 'some-uuid-1',
						status: 'unauthorized',
					}),
				}),
			);
			expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLink',
					action: 'connectFailed',
					attributes: expect.objectContaining({
						definitionId: 'd1',
						extensionKey: 'object-provider',
						reason: 'auth_window_closed',
						id: expect.any(String),
					}),
				}),
			);

			expect(mockStartUfoExperience).toHaveBeenCalledWith(
				'smart-link-authenticated',
				'some-uuid-1',
				{
					extensionKey: 'object-provider',
					status: 'auth_window_closed',
				},
			);

			expect(mockSucceedUfoExperience).toHaveBeenCalledWith(
				'smart-link-authenticated',
				'some-uuid-1',
				{
					display: 'inline',
				},
			);
		});
	});
});
