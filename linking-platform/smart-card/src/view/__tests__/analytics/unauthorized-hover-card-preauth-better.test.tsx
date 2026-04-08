jest.mock('../../../utils/shouldSample');
import './unauthorized.test.mock';

import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
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
import { auth } from '@atlaskit/outbound-auth-flow-client';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { fakeFactory, mocks } from '../../../utils/mocks';
import { Card } from '../../Card';

import '../../../utils/shouldSample';

mockSimpleIntersectionObserver();

expect.extend(jestExtendedMatchers);

describe('smart-card: unauthorized hover card (platform_sl_3p_preauth_better_hovercard)', () => {
	let mockClient: CardClient;
	let mockFetch: jest.Mock;
	const mockUuid = uuid as JestFunction<typeof uuid>;
	const mockAnalyticsClient = {
		sendUIEvent: jest.fn().mockResolvedValue(undefined),
		sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
		sendTrackEvent: jest.fn().mockResolvedValue(undefined),
		sendScreenEvent: jest.fn().mockResolvedValue(undefined),
	} satisfies AnalyticsWebClient;

	beforeEach(() => {
		mockFetch = jest.fn(async () => mocks.success);
		mockClient = new (fakeFactory(mockFetch))();
		mockUuid.mockReturnValue('some-uuid-1');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	async function expectConnectAccountClickedAnalyticsForUnauthorisedHover(
		selectors: {
			connectButtonTestId: string;
			hoverCardTestId: string;
		},
		rovoOptions?: React.ComponentProps<typeof Provider>['rovoOptions'],
		/** When set, connect / auth analytics must include this `viewVariant` (from HoverCardContent `AnalyticsContext`). */
		options?: { expectedViewVariant?: string },
	) {
		const { expectedViewVariant } = options ?? {};
		const unauthorisedHoverAttributes = expect.objectContaining({
			display: 'hoverCardPreview',
			definitionId: 'd1',
			extensionKey: 'object-provider',
			id: 'some-uuid-1',
			status: 'unauthorized',
			...(expectedViewVariant ? { viewVariant: expectedViewVariant } : {}),
		});
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
						<Provider client={mockClient} rovoOptions={rovoOptions}>
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

		await screen.findByTestId(selectors.hoverCardTestId);

		const connectButton = screen.getByTestId(selectors.connectButtonTestId);

		asMockFunction(auth).mockImplementationOnce(async () => {});
		await userEvent.click(connectButton);

		expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				action: 'clicked',
				actionSubject: 'button',
				actionSubjectId: 'connectAccount',
				attributes: unauthorisedHoverAttributes,
			}),
		);

		expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				actionSubject: 'applicationAccount',
				action: 'authStarted',
				attributes: unauthorisedHoverAttributes,
			}),
		);
		expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				actionSubject: 'applicationAccount',
				action: 'connected',
				attributes: unauthorisedHoverAttributes,
			}),
		);
	}

	const legacyUnauthorisedHoverSelectors = {
		hoverCardTestId: 'hover-card-unauthorised-view',
		/** Matches unauthorised hover `ActionGroup` connect control (see unauthorized.test.tsx). */
		connectButtonTestId: 'smart-action',
	} as const;

	ffTest.off('platform_sl_3p_preauth_better_hovercard_killswitch', '', () => {
		it('should fire connect analytics when killswitch is off (legacy unauthorised hover)', async () => {
			await expectConnectAccountClickedAnalyticsForUnauthorisedHover(legacyUnauthorisedHoverSelectors);
		});
	});

	const rovoUnauthorisedHoverSelectors = {
		hoverCardTestId: 'hover-card-rovo-unauthorised-view',
		connectButtonTestId: 'hover-card-rovo-unauthorised-view-connect-account',
	} as const;

	ffTest.on('platform_sl_3p_preauth_better_hovercard_killswitch', '', () => {
		eeTest
			.describe(
				'platform_sl_3p_preauth_better_hovercard',
				'Rovo unauthorised hover card analytics',
			)
			.variant(false, () => {
				it('should fire connect analytics when experiment is off (legacy unauthorised hover)', async () => {
					await expectConnectAccountClickedAnalyticsForUnauthorisedHover(
						legacyUnauthorisedHoverSelectors,
					);
				});
			});
	});

	ffTest.on('platform_sl_3p_preauth_better_hovercard_killswitch', '', () => {
		eeTest
			.describe(
				'platform_sl_3p_preauth_better_hovercard',
				'Rovo unauthorised hover card analytics',
			)
			.variant(true, () => {
				it('should fire connect analytics when experiment is on and Rovo is enabled (Rovo unauthorised hover)', async () => {
					await expectConnectAccountClickedAnalyticsForUnauthorisedHover(
						rovoUnauthorisedHoverSelectors,
						{ isRovoEnabled: true, isRovoLLMEnabled: true },
						{ expectedViewVariant: 'rovo-unauthorised-view' },
					);
				});

				it('should fire connect analytics when experiment is on but Rovo is disabled (legacy unauthorised hover)', async () => {
					await expectConnectAccountClickedAnalyticsForUnauthorisedHover(
						legacyUnauthorisedHoverSelectors,
						{ isRovoEnabled: false, isRovoLLMEnabled: true },
					);
				});

				it('should include viewVariant on hoverCard viewed and dismissed for Rovo pre-auth unauthorised hover', async () => {
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
									<Provider
										client={mockClient}
										rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}
									>
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
					await screen.findByTestId(rovoUnauthorisedHoverSelectors.hoverCardTestId);

					const viewedAttributes = expect.objectContaining({
						display: 'hoverCardPreview',
						previewDisplay: 'card',
						previewInvokeMethod: 'mouse_hover',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						id: 'some-uuid-1',
						status: 'unauthorized',
						viewVariant: 'rovo-unauthorised-view',
					});

					expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'viewed',
							actionSubject: 'hoverCard',
							attributes: viewedAttributes,
						}),
					);

					await userEvent.unhover(unauthorizedLink);

					await waitFor(() => {
						expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
							expect.objectContaining({
								action: 'dismissed',
								actionSubject: 'hoverCard',
								attributes: expect.objectContaining({
									display: 'hoverCardPreview',
									previewDisplay: 'card',
									previewInvokeMethod: 'mouse_hover',
									definitionId: 'd1',
									extensionKey: 'object-provider',
									id: 'some-uuid-1',
									status: 'unauthorized',
									hoverTime: expect.any(Number),
									viewVariant: 'rovo-unauthorised-view',
								}),
							}),
						);
					});
				});
			});
	});
});
