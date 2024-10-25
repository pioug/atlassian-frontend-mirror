jest.mock('../../../utils/shouldSample');
import './unauthorized.test.mock';

import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as jestExtendedMatchers from 'jest-extended';
import { IntlProvider } from 'react-intl-next';
import uuid from 'uuid';

import { type CardClient } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { asMockFunction, type JestFunction } from '@atlaskit/media-test-helpers';
import { auth, AuthError } from '@atlaskit/outbound-auth-flow-client';

import { Provider } from '../../../index';
import * as ufoWrapper from '../../../state/analytics/ufoExperiences';
import * as analytics from '../../../utils/analytics';
import { fakeFactory, mocks } from '../../../utils/mocks';
import { Card, type CardAppearance } from '../../Card';



// ShouldSample needs to be loaded for beforeEach inside to be picked up before test runs
import '../../../utils/shouldSample';

mockSimpleIntersectionObserver();

expect.extend(jestExtendedMatchers);

describe('smart-card: unauthorized analytics', () => {
	let mockClient: CardClient;
	let mockFetch: jest.Mock;
	let mockWindowOpen: jest.Mock;

	const mockUuid = uuid as JestFunction<typeof uuid>;
	const mockStartUfoExperience = jest.spyOn(ufoWrapper, 'startUfoExperience');
	const mockSucceedUfoExperience = jest.spyOn(ufoWrapper, 'succeedUfoExperience');

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
		it('should fire clicked event when the link is clicked', async () => {
			const mockUrl = 'https://https://this.is.a.url';
			mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
			render(
				<IntlProvider locale="en">
					<Provider client={mockClient}>
						<Card testId="unauthorizedCard1" appearance="inline" url={mockUrl} />
					</Provider>
				</IntlProvider>,
			);

			const unauthorizedLink = await waitFor(
				() =>
					screen.getByTestId('unauthorizedCard1-unauthorized-view').getElementsByTagName('a')[0],

				{ timeout: 10000 },
			);
			expect(unauthorizedLink).toBeTruthy();
			await userEvent.click(unauthorizedLink);
			expect(analytics.uiCardClickedEvent).toHaveBeenCalledTimes(1);
			expect(analytics.uiCardClickedEvent).toHaveBeenCalledWith({
				id: 'some-uuid-1',
				display: 'inline',
				status: 'unauthorized',
				definitionId: 'd1',
				extensionKey: 'object-provider',
				isModifierKeyPressed: false,
			});
		});

		it.each(['block', 'embed'])(
			'should fire "learn more" clicked event when the button is clicked',
			async (appearance: string) => {
				const mockUrl = 'https://https://this.is.a.url';
				mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
				render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance={appearance as CardAppearance} url={mockUrl} testId="test" />
						</Provider>
					</IntlProvider>,
				);

				const learnMoreButton = await screen.findByTestId(
					'test-learn-more',
					{},
					{ timeout: 10000 },
				);
				expect(learnMoreButton).toBeTruthy();
				await userEvent.click(learnMoreButton!);

				expect(analytics.uiLearnMoreLinkClickedEvent).toHaveBeenCalledTimes(1);
			},
		);

		it('should fire clicked event when the "learn more" button is clicked on unauthorized hover card', async () => {
			const mockUrl = 'https://this.is.a.url';
			mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
			render(
				<IntlProvider locale="en">
					<Provider client={mockClient}>
						<Card
							url={mockUrl}
							appearance="inline"
							testId="unauthorized-inline-card"
							showAuthTooltip={true}
						/>
					</Provider>
				</IntlProvider>,
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
			expect(analytics.uiLearnMoreLinkClickedEvent).toHaveBeenCalledTimes(1);
		});

		it('should fire analytics events when the connect button is clicked on block card', async () => {
			const mockUrl = 'https://https://this.is.a.url';
			mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
			render(
				<IntlProvider locale="en">
					<Provider client={mockClient}>
						<Card appearance="block" url={mockUrl} />
					</Provider>
				</IntlProvider>,
			);

			const connectButton = await screen.findByTestId(
				'smart-action-connect-account',
				{},
				{ timeout: 10000 },
			);
			expect(connectButton).toBeTruthy();
			asMockFunction(auth).mockImplementationOnce(async () => {});
			await userEvent.click(connectButton!);

			// verify ui button clicked event is fired
			expect(analytics.uiAuthEvent).toHaveBeenCalledTimes(1);
			expect(analytics.uiAuthEvent).toHaveBeenCalledWith({
				display: 'block',
				definitionId: 'd1',
				extensionKey: 'object-provider',
			});

			// verify track event is fired
			expect(analytics.trackAppAccountAuthStarted).toHaveBeenCalledTimes(1);
			expect(analytics.trackAppAccountAuthStarted).toHaveBeenCalledWith({
				definitionId: 'd1',
				extensionKey: 'object-provider',
				id: 'some-uuid-1',
			});
		});

		it('should fire clicked event when the connect button is clicked on embed card', async () => {
			const mockUrl = 'https://https://this.is.a.url';
			mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
			render(
				<IntlProvider locale="en">
					<Provider client={mockClient}>
						<Card appearance="embed" url={mockUrl} />
					</Provider>
				</IntlProvider>,
			);

			const connectButton = await screen.findByTestId('connect-account', {}, { timeout: 10000 });
			expect(connectButton).toBeTruthy();
			asMockFunction(auth).mockImplementationOnce(async () => {});
			await userEvent.click(connectButton!);

			// verify ui button clicked event is fired
			expect(analytics.uiAuthEvent).toHaveBeenCalledTimes(1);
			expect(analytics.uiAuthEvent).toHaveBeenCalledWith({
				display: 'embed',
				definitionId: 'd1',
				extensionKey: 'object-provider',
			});

			// verify track event is fired
			expect(analytics.trackAppAccountAuthStarted).toHaveBeenCalledTimes(1);
			expect(analytics.trackAppAccountAuthStarted).toHaveBeenCalledWith({
				definitionId: 'd1',
				extensionKey: 'object-provider',
				id: 'some-uuid-1',
			});
		});

		it('should fire clicked event when the connect button is clicked on unauthorized hover card', async () => {
			const mockUrl = 'https://https://this.is.a.url';
			mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
			render(
				<IntlProvider locale="en">
					<Provider
						client={mockClient}
						featureFlags={{
							enableFlexibleBlockCard: true,
						}}
					>
						<Card
							url={mockUrl}
							appearance="inline"
							testId="unauthorized-inline-card"
							showAuthTooltip={true}
						/>
					</Provider>
				</IntlProvider>,
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
			expect(analytics.uiAuthEvent).toHaveBeenCalledTimes(1);
			expect(analytics.uiAuthEvent).toHaveBeenCalledWith({
				display: 'hoverCardPreview',
				definitionId: 'd1',
				extensionKey: 'object-provider',
			});

			// verify track event is fired
			expect(analytics.trackAppAccountAuthStarted).toHaveBeenCalledTimes(1);
			expect(analytics.trackAppAccountAuthStarted).toHaveBeenCalledWith({
				extensionKey: 'object-provider',
				definitionId: 'd1',
				id: 'some-uuid-1',
			});
		});

		it('should fire clicked event when the connect button is clicked on unauthorized inline card', async () => {
			const mockUrl = 'https://https://this.is.a.url';
			mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
			render(
				<IntlProvider locale="en">
					<Provider client={mockClient}>
						<Card url={mockUrl} appearance="inline" testId="unauthorized-inline-card" />
					</Provider>
				</IntlProvider>,
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
			expect(analytics.uiAuthEvent).toHaveBeenCalledTimes(1);
			expect(analytics.uiAuthEvent).toHaveBeenCalledWith({
				display: 'inline',
				definitionId: 'd1',
				extensionKey: 'object-provider',
			});

			// verify track event is fired
			expect(analytics.trackAppAccountAuthStarted).toHaveBeenCalledTimes(1);
			expect(analytics.trackAppAccountAuthStarted).toHaveBeenCalledWith({
				extensionKey: 'object-provider',
				definitionId: 'd1',
				id: 'some-uuid-1',
			});
		});

		it('should fire success event when the link is rendered', async () => {
			const mockUrl = 'https://https://this.is.a.url';
			mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
			render(
				<IntlProvider locale="en">
					<Provider client={mockClient}>
						<Card testId="unauthorizedCard1" appearance="inline" url={mockUrl} />
					</Provider>
				</IntlProvider>,
			);

			const unauthorizedLink = await screen.findByTestId(
				'unauthorizedCard1-unauthorized-view',
				{},
				{ timeout: 10000 },
			);
			expect(unauthorizedLink).toBeTruthy();
			expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledTimes(1);
			expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledWith({
				display: 'inline',
				status: 'unauthorized',
				definitionId: 'd1',
				extensionKey: 'object-provider',
				canBeDatasource: false,
			});
		});

		it('should fire connectSucceeded event when auth succeeds', async () => {
			const mockUrl = 'https://https://this.is.a.url';
			mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
			render(
				<IntlProvider locale="en">
					<Provider client={mockClient}>
						<Card testId="unauthorizedCard1" appearance="inline" url={mockUrl} />
					</Provider>
				</IntlProvider>,
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
			expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
			expect(analytics.uiAuthEvent).toHaveBeenCalledTimes(1);
			expect(analytics.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
			expect(analytics.trackAppAccountConnected).toHaveBeenCalledTimes(1);
			expect(analytics.connectSucceededEvent).toHaveBeenCalledTimes(1);
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

		it.each`
			errorType
			${undefined}
			${'access_denied'}
		`(
			'should fire connectFailed event when auth fails with errorType = $errorType',
			async (errorType) => {
				const mockUrl = 'https://https://this.is.the.second.url';
				mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
				render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card testId="unauthorizedCard2" appearance="inline" url={mockUrl} />
						</Provider>
					</IntlProvider>,
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
					Promise.reject(new AuthError('', errorType)),
				);

				// todo: determine why this test breaks when using userEvent.click()
				fireEvent.click(unauthorizedLinkButton);

				const unresolvedView = await screen.findByTestId(
					'unauthorizedCard2-unauthorized-view',
					{},
					{ timeout: 10000 },
				);
				expect(unresolvedView).toBeTruthy();
				expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
				expect(analytics.uiAuthEvent).toHaveBeenCalledTimes(1);
				expect(analytics.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
				expect(analytics.connectFailedEvent).toHaveBeenCalledTimes(1);
				expect(analytics.connectFailedEvent).toHaveBeenCalledWith({
					definitionId: 'd1',
					extensionKey: 'object-provider',
					reason: errorType,
					id: expect.any(String),
				});

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
				<IntlProvider locale="en">
					<Provider client={mockClient}>
						<Card testId="unauthorizedCard3" appearance="inline" url={mockUrl} />
					</Provider>
				</IntlProvider>,
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
			expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
			expect(analytics.uiAuthEvent).toHaveBeenCalledTimes(1);
			expect(analytics.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
			expect(analytics.uiClosedAuthEvent).toHaveBeenCalledTimes(1);
			expect(analytics.connectFailedEvent).toHaveBeenCalledTimes(1);
			expect(analytics.connectFailedEvent).toHaveBeenCalledWith({
				definitionId: 'd1',
				extensionKey: 'object-provider',
				reason: 'auth_window_closed',
				id: expect.any(String),
			});

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
