import './success.test.mock';

import React from 'react';

import * as jestExtendedMatchers from 'jest-extended';
import { IntlProvider } from 'react-intl';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { type CardClient, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { asMock, type JestFunction } from '@atlaskit/media-test-helpers';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { fireEvent, render, screen, waitFor, userEvent } from '@atlassian/testing-library';

import { CardAction } from '../../../constants';
import { TitleBlock } from '../../../index';
import * as ufoWrapper from '../../../state/analytics/ufoExperiences';
import * as socialProofExperiment from '../../../state/hooks/use-social-proof-experiment';
import { isSpecialClick, isSpecialKey } from '../../../utils';
import { fakeFactory, mocks } from '../../../utils/mocks';
import { shouldSample } from '../../../utils/shouldSample';
import { Card, type CardAppearance } from '../../Card';
import * as cardWithUrlContent from '../../CardWithUrl/component';
import '@atlaskit/link-test-helpers/jest';

jest.mock('../../../utils', () => ({
	...jest.requireActual('../../../utils'),
	downloadUrl: jest.fn(),
	isSpecialKey: jest.fn(() => false),
	isSpecialClick: jest.fn(() => false),
}));
jest.mock('../../../utils/shouldSample');

mockSimpleIntersectionObserver();

expect.extend(jestExtendedMatchers);

describe('smart-card: success analytics', () => {
	let mockClient: CardClient;
	let mockFetch: jest.Mock;
	let mockPostData: jest.Mock;
	let mockWindowOpen: jest.Mock;

	const mockUuid = uuid as JestFunction<typeof uuid>;
	let mockStartUfoExperience: jest.SpyInstance;
	let mockSucceedUfoExperience: jest.SpyInstance;
	let mockFailUfoExperience: jest.SpyInstance;
	let mockAddMetadataToExperience: jest.SpyInstance;

	const mockAnalyticsClient = {
		sendUIEvent: jest.fn().mockResolvedValue(undefined),
		sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
		sendTrackEvent: jest.fn().mockResolvedValue(undefined),
		sendScreenEvent: jest.fn().mockResolvedValue(undefined),
	} satisfies AnalyticsWebClient;

	beforeEach(() => {
		mockFetch = jest.fn(async () => mocks.success);
		mockPostData = jest.fn(async () => mocks.actionSuccess);
		mockClient = new (fakeFactory(mockFetch, mockPostData))();
		mockWindowOpen = jest.fn();
		mockStartUfoExperience = jest.spyOn(ufoWrapper, 'startUfoExperience');
		mockSucceedUfoExperience = jest.spyOn(ufoWrapper, 'succeedUfoExperience');
		mockFailUfoExperience = jest.spyOn(ufoWrapper, 'failUfoExperience');
		mockAddMetadataToExperience = jest.spyOn(ufoWrapper, 'addMetadataToExperience');
		mockUuid.mockReturnValueOnce('some-uuid-1').mockReturnValueOnce('some-uuid-2');
		/// @ts-ignore
		global.open = mockWindowOpen;
	});

	afterEach(() => {
		jest.clearAllMocks();
		mockUuid.mockReset();
	});

	describe('resolved', () => {
		it('should capture and report a11y violations', async () => {
			const mockUrl = 'https://this.is.the.sixth.url';
			const { container } = render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="embed" url={mockUrl} />
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);

			await expect(container).toBeAccessible();
		});

		describe('embeds', () => {
			beforeEach(() => {
				jest.useFakeTimers();
			});

			afterEach(() => {
				jest.useRealTimers();
			});

			it('should fire the dwelled analytics event when the user dwells on the iframe', async () => {
				const mockUrl = 'https://this.is.the.sixth.url';
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<IntlProvider locale="en">
							<Provider client={mockClient}>
								<Card appearance="embed" url={mockUrl} />
							</Provider>
						</IntlProvider>
					</FabricAnalyticsListeners>,
				);
				const resolvedView = await screen.findByTestId('embed-card-resolved-view');
				expect(resolvedView).toBeTruthy();
				// Check if resolved analytics has been fired
				expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'renderSuccess',
						actionSubject: 'smartLink',
						attributes: expect.objectContaining({
							status: 'resolved',
							extensionKey: 'object-provider',
							definitionId: 'd1',
							display: 'embed',
							canBeDatasource: false,
							id: 'some-uuid-1',
						}),
					}),
				);

				const resolvedViewFrame = await screen.findByTestId('embed-card-resolved-view-frame');
				fireEvent.load(resolvedViewFrame);
				await waitFor(
					async () => {
						await userEvent.hover(resolvedViewFrame);
						expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
							expect.objectContaining({
								action: 'dwelled',
								actionSubject: 'smartLinkIframe',
								attributes: expect.objectContaining({
									id: 'some-uuid-1',
									definitionId: 'd1',
									display: 'embed',
									dwellPercentVisible: 100,
									dwellTime: 5,
								}),
							}),
						);
					},
					{ timeout: 6000 }, // EDM-10399 Simulate the dwell time
				);
			});

			it('should fire the focused analytics event with mouseenter interactionType when the user hovers over the embed content wrapper', async () => {
				const mockUrl = 'https://this.is.the.sixth.url';
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<IntlProvider locale="en">
							<Provider client={mockClient}>
								<Card appearance="embed" url={mockUrl} />
							</Provider>
						</IntlProvider>
					</FabricAnalyticsListeners>,
				);
				const resolvedView = await screen.findByTestId('embed-card-resolved-view');
				expect(resolvedView).toBeTruthy();

				const contentWrapper = await screen.findByTestId('embed-content-wrapper');
				expect(contentWrapper).toBeTruthy();

				// Clear previous analytics calls
				mockAnalyticsClient.sendUIEvent.mockClear();

				// Trigger mouse enter event using fireEvent
				fireEvent.mouseEnter(contentWrapper);

				await waitFor(() => {
					expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'focused',
							actionSubject: 'smartLinkIframe',
							attributes: expect.objectContaining({
								id: 'some-uuid-1',
								definitionId: 'd1',
								display: 'embed',
								interactionType: 'mouseenter',
							}),
						}),
					);
				});
			});

			it('should fire the focused analytics event with mouseleave interactionType when the user stops hovering over the embed content wrapper', async () => {
				const mockUrl = 'https://this.is.the.sixth.url';
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<IntlProvider locale="en">
							<Provider client={mockClient}>
								<Card appearance="embed" url={mockUrl} />
							</Provider>
						</IntlProvider>
					</FabricAnalyticsListeners>,
				);
				const resolvedView = await screen.findByTestId('embed-card-resolved-view');
				expect(resolvedView).toBeTruthy();

				const contentWrapper = await screen.findByTestId('embed-content-wrapper');
				expect(contentWrapper).toBeTruthy();

				// Clear previous analytics calls
				mockAnalyticsClient.sendUIEvent.mockClear();

				// First trigger mouse enter, then mouse leave
				fireEvent.mouseEnter(contentWrapper);
				fireEvent.mouseLeave(contentWrapper);

				await waitFor(() => {
					expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'focused',
							actionSubject: 'smartLinkIframe',
							attributes: expect.objectContaining({
								id: 'some-uuid-1',
								definitionId: 'd1',
								display: 'embed',
								interactionType: 'mouseleave',
							}),
						}),
					);
				});
			});
		});

		describe('social proof renderSuccess experimentMeta', () => {
			const renderCard = async (appearance: CardAppearance = 'block') => {
				const mockUrl = 'https://this.is.social.proof.url';
				mockFetch.mockImplementationOnce(async () => mocks.unauthorized);

				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<IntlProvider locale="en">
							<Provider client={mockClient}>
								<Card testId="socialProofCard" appearance={appearance} url={mockUrl} />
							</Provider>
						</IntlProvider>
					</FabricAnalyticsListeners>,
				);

				await screen.findByTestId(
					appearance === 'inline' ? 'socialProofCard-unauthorized-view' : 'socialProofCard',
				);
			};

			describe('with social proof renderSuccess metadata gate on', () => {
				it('adds nested experimentMeta for unauthorized block cards', async () => {
					passGate('social-proof-3p-unauth-block-fg');
					jest.spyOn(socialProofExperiment, 'getSocialProofExperimentMeta').mockReturnValue({
						social_proof_3p_unauth_block_exp: { isEligible: true, tier: 'not-low' },
					});

					await renderCard('block');

					expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'renderSuccess',
							actionSubject: 'smartLink',
							attributes: expect.objectContaining({
								display: 'block',
								status: 'unauthorized',
								experimentMeta: {
									social_proof_3p_unauth_block_exp: { isEligible: true, tier: 'not-low' },
								},
							}),
						}),
					);
				});

				it('adds ineligible nested experimentMeta for unauthorized block cards without cached eligibility', async () => {
					passGate('social-proof-3p-unauth-block-fg');
					jest.spyOn(socialProofExperiment, 'getSocialProofExperimentMeta').mockReturnValue({
						social_proof_3p_unauth_block_exp: { isEligible: false },
					});

					await renderCard('block');

					expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'renderSuccess',
							actionSubject: 'smartLink',
							attributes: expect.objectContaining({
								display: 'block',
								status: 'unauthorized',
								experimentMeta: {
									social_proof_3p_unauth_block_exp: { isEligible: false },
								},
							}),
						}),
					);
				});
			});

			describe('with inline social proof renderSuccess metadata gate on', () => {
				it('adds nested experimentMeta for unauthorized inline cards', async () => {
					passGate('platform_sl_3p_preauth_soc_proof_inline_killswitch');
					jest.spyOn(socialProofExperiment, 'getInlineSocialProofExperimentMeta').mockReturnValue({
						platform_sl_3p_preauth_social_proof_inline_cta: {
							isEligible: true,
							tier: 'low',
						},
					});

					await renderCard('inline');

					expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'renderSuccess',
							actionSubject: 'smartLink',
							attributes: expect.objectContaining({
								display: 'inline',
								status: 'unauthorized',
								experimentMeta: {
									platform_sl_3p_preauth_social_proof_inline_cta: {
										isEligible: true,
										tier: 'low',
									},
								},
							}),
						}),
					);
				});
			});

			describe('with inline social proof renderSuccess metadata gate off', () => {
				it('does not add inline nested experimentMeta for unauthorized inline cards', async () => {
					failGate('platform_sl_3p_preauth_soc_proof_inline_killswitch');
					const getInlineSocialProofExperimentMetaSpy = jest.spyOn(
						socialProofExperiment,
						'getInlineSocialProofExperimentMeta',
					);

					await renderCard('inline');

					expect(getInlineSocialProofExperimentMetaSpy).not.toHaveBeenCalled();
					expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'renderSuccess',
							actionSubject: 'smartLink',
							attributes: expect.not.objectContaining({
								experimentMeta: expect.anything(),
							}),
						}),
					);
				});
			});

			describe('with social proof renderSuccess metadata gate off', () => {
				it('does not add nested experimentMeta for unauthorized block cards', async () => {
					failGate('social-proof-3p-unauth-block-fg');
					const getSocialProofExperimentMetaSpy = jest.spyOn(
						socialProofExperiment,
						'getSocialProofExperimentMeta',
					);

					await renderCard('block');

					expect(getSocialProofExperimentMetaSpy).not.toHaveBeenCalled();
					expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'renderSuccess',
							actionSubject: 'smartLink',
							attributes: expect.not.objectContaining({
								experimentMeta: expect.anything(),
							}),
						}),
					);
				});
			});
		});

		it('should fire the resolved analytics event when the url was resolved', async () => {
			const mockUrl = 'https://this.is.the.sixth.url';
			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card testId="resolvedCard1" appearance="inline" url={mockUrl} />
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);
			const resolvedView = await screen.findByTestId('resolvedCard1-resolved-view');
			const resolvedCard = screen.getByRole('link');
			expect(resolvedView).toBeTruthy();
			expect(resolvedCard).toBeTruthy();
			expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLink',
					action: 'resolved',
					attributes: expect.objectContaining({
						id: 'some-uuid-1',
						status: 'resolved',
						extensionKey: 'object-provider',
						definitionId: 'd1',
						canBeDatasource: false,
						duration: null,
					}),
				}),
			);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'renderSuccess',
					actionSubject: 'smartLink',
					attributes: expect.objectContaining({
						display: 'inline',
						status: 'resolved',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						canBeDatasource: false,
					}),
				}),
			);

			expect(mockStartUfoExperience).toHaveBeenCalledWith('smart-link-rendered', 'some-uuid-1');
			expect(mockSucceedUfoExperience).toHaveBeenCalledWith('smart-link-rendered', 'some-uuid-1', {
				display: 'inline',
				extensionKey: 'object-provider',
			});
			expect(mockSucceedUfoExperience).toHaveBeenCalledAfter(mockStartUfoExperience as jest.Mock);
		});

		it('should fire clicked analytics event when flexible ui link with resolved URL is clicked', async () => {
			const mockUrl = 'https://this.is.the.seventh.url';
			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card testId="resolvedCard2" appearance="inline" url={mockUrl}>
								<TitleBlock />
							</Card>
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);
			const resolvedView = await screen.findByTestId('smart-block-title-resolved-view');
			expect(resolvedView).toBeTruthy();

			const resolvedCard = screen.getByTestId('smart-element-link');
			expect(resolvedCard).toBeTruthy();
			expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLink',
					action: 'resolved',
					attributes: expect.objectContaining({
						id: 'some-uuid-1',
						status: 'resolved',
						extensionKey: 'object-provider',
						definitionId: 'd1',
						canBeDatasource: false,
						duration: null,
					}),
				}),
			);

			asMock(isSpecialKey).mockReturnValue(false);
			asMock(isSpecialClick).mockReturnValue(false);

			await userEvent.click(resolvedCard);

			// ensure default onclick for renderer is not triggered
			expect(mockWindowOpen).toHaveBeenCalledTimes(0);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLink',
					action: 'clicked',
					attributes: expect.objectContaining({
						id: 'some-uuid-1',
						display: 'flexible',
						status: 'resolved',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						isModifierKeyPressed: false,
					}),
				}),
			);

			// With special key pressed
			asMock(mockAnalyticsClient.sendUIEvent).mockReset();
			mockWindowOpen.mockReset();
			asMock(isSpecialKey).mockReturnValue(true);
			asMock(isSpecialClick).mockReturnValue(false);

			await userEvent.click(resolvedCard);

			// ensure default onclick for renderer is not triggered
			expect(mockWindowOpen).toHaveBeenCalledTimes(0);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLink',
					action: 'clicked',
					attributes: expect.objectContaining({
						id: 'some-uuid-1',
						display: 'flexible',
						status: 'resolved',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						isModifierKeyPressed: true,
					}),
				}),
			);

			// With special click
			asMock(mockAnalyticsClient.sendUIEvent).mockReset();
			mockWindowOpen.mockReset();
			asMock(isSpecialKey).mockReturnValue(false);
			asMock(isSpecialClick).mockReturnValue(true);

			await userEvent.click(resolvedCard);

			// ensure default onclick for renderer is not triggered
			expect(mockWindowOpen).toHaveBeenCalledTimes(0);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLink',
					action: 'clicked',
					attributes: expect.objectContaining({
						id: 'some-uuid-1',
						display: 'flexible',
						status: 'resolved',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						isModifierKeyPressed: true,
					}),
				}),
			);
		});

		it('should fire clicked analytics event when a resolved URL is clicked on a inline link', async () => {
			const mockUrl = 'https://this.is.the.seventh.url';

			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card testId="resolvedCard2" appearance="inline" url={mockUrl} />
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);
			const resolvedView = await screen.findByTestId('resolvedCard2-resolved-view');
			expect(resolvedView).toBeTruthy();

			const resolvedCard = screen.getByRole('link');
			expect(resolvedCard).toBeTruthy();
			expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLink',
					action: 'resolved',
					attributes: expect.objectContaining({
						id: 'some-uuid-1',
						status: 'resolved',
						extensionKey: 'object-provider',
						definitionId: 'd1',
						canBeDatasource: false,
						duration: null,
					}),
				}),
			);

			asMock(isSpecialKey).mockReturnValue(false);
			asMock(isSpecialClick).mockReturnValue(false);

			await userEvent.click(resolvedCard);
			expect(mockWindowOpen).toHaveBeenCalledTimes(1);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'smartLink',
					attributes: expect.objectContaining({
						id: 'some-uuid-1',
						display: 'inline',
						status: 'resolved',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						isModifierKeyPressed: false,
					}),
				}),
			);

			// With special key pressed
			asMock(mockAnalyticsClient.sendUIEvent).mockReset();
			mockWindowOpen.mockReset();
			asMock(isSpecialKey).mockReturnValue(true);
			asMock(isSpecialClick).mockReturnValue(false);

			await userEvent.click(resolvedCard);

			expect(mockWindowOpen).toHaveBeenCalledTimes(1);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'smartLink',
					attributes: expect.objectContaining({
						id: 'some-uuid-1',
						display: 'inline',
						status: 'resolved',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						isModifierKeyPressed: true,
					}),
				}),
			);

			// With special click
			asMock(mockAnalyticsClient.sendUIEvent).mockReset();
			mockWindowOpen.mockReset();
			asMock(isSpecialKey).mockReturnValue(false);
			asMock(isSpecialClick).mockReturnValue(true);

			await userEvent.click(resolvedCard);

			expect(mockWindowOpen).toHaveBeenCalledTimes(1);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'smartLink',
					attributes: expect.objectContaining({
						id: 'some-uuid-1',
						display: 'inline',
						status: 'resolved',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						isModifierKeyPressed: true,
					}),
				}),
			);
		});

		it('should fire UFO render experience analytics event when coin flip ends with tail', async () => {
			asMock(shouldSample).mockReturnValue(false);
			const mockUrl = 'https://this.is.the.sixth.url';
			render(
				<IntlProvider locale="en">
					<Provider client={mockClient}>
						<Card testId="resolvedCard1" appearance="inline" url={mockUrl} />
					</Provider>
				</IntlProvider>,
			);
			const resolvedView = await screen.findByTestId('resolvedCard1-resolved-view');
			const resolvedCard = screen.getByRole('link');
			expect(resolvedView).toBeTruthy();
			expect(resolvedCard).toBeTruthy();

			expect(mockStartUfoExperience).not.toHaveBeenCalledWith('smart-link-rendered', 'some-uuid-1');
		});

		it('should not send repeated render success events when non-essential props are changed', async () => {
			const mockUrl = 'https://this.is.the.sixth.url';
			const { rerender } = render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<Provider client={mockClient}>
						<Card
							testId="resolvedCard1"
							appearance="inline"
							url={mockUrl}
							actionOptions={{
								hide: false,
								exclude: [
									CardAction.DownloadAction,
									CardAction.PreviewAction,
									CardAction.ViewAction,
								],
							}}
						/>
					</Provider>
				</FabricAnalyticsListeners>,
			);

			await screen.findByTestId('resolvedCard1-resolved-view');
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLink',
					action: 'renderSuccess',
					attributes: expect.objectContaining({
						display: 'inline',
						status: 'resolved',
						extensionKey: 'object-provider',
						definitionId: 'd1',
					}),
				}),
			);
			mockAnalyticsClient.sendUIEvent.mockReset();
			expect(mockAnalyticsClient.sendUIEvent).not.toHaveBeenCalled();
			rerender(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<Provider client={mockClient}>
						<Card testId="resolvedCard1" appearance="inline" url={mockUrl} />
					</Provider>
				</FabricAnalyticsListeners>,
			);
			await screen.findByTestId('resolvedCard1-resolved-view');
			expect(mockAnalyticsClient.sendUIEvent).not.toHaveBeenCalled();
		});

		it('should add the cached tag to UFO render experience when the same link url is rendered again', async () => {
			const mockUrl = 'https://this.is.the.seventh.url';
			const { rerender } = render(
				<Provider client={mockClient}>
					<Card testId="resolvedCard1" appearance="inline" url={mockUrl} />
				</Provider>,
			);
			await screen.findByTestId('resolvedCard1-resolved-view');

			expect(mockAddMetadataToExperience).not.toHaveBeenCalled();

			rerender(
				<Provider client={mockClient}>
					<Card testId="resolvedCard1" appearance="inline" url={mockUrl} />
					<Card testId="resolvedCard2" appearance="inline" url={mockUrl} />
				</Provider>,
			);

			await screen.findByTestId('resolvedCard1-resolved-view');
			await screen.findByTestId('resolvedCard2-resolved-view');

			expect(mockStartUfoExperience.mock.calls).toIncludeAllMembers([
				['smart-link-rendered', 'some-uuid-1'],
				['smart-link-rendered', 'some-uuid-2'],
			]);

			// Ensure whichever link loads first is marked as cached since url is the same
			expect(mockAddMetadataToExperience.mock.calls).toEqual([
				[
					'smart-link-rendered',
					expect.stringMatching(/^some-uuid-2||some-uuid-1$/),
					{
						cached: true,
					},
				],
			]);

			// Authenticated experiences haven't been started and will be ignored by UFO
			expect(mockSucceedUfoExperience.mock.calls).toIncludeAllMembers([
				[
					'smart-link-rendered',
					'some-uuid-1',
					{ display: 'inline', extensionKey: 'object-provider' },
				],
				['smart-link-authenticated', 'some-uuid-1', { display: 'inline' }],
				[
					'smart-link-rendered',
					'some-uuid-2',
					{ display: 'inline', extensionKey: 'object-provider' },
				],
				['smart-link-authenticated', 'some-uuid-2', { display: 'inline' }],
			]);
		});

		it('should fire render failure when an unexpected error happens', async () => {
			const mockUrl = 'https://this.is.the.eight.url';
			const spy = jest.spyOn(cardWithUrlContent, 'CardWithUrlContent').mockImplementation(() => {
				throw new Error();
			});

			const onError = jest.fn();
			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<Provider client={mockClient}>
						<Card appearance="inline" url={mockUrl} onError={onError} />
					</Provider>
				</FabricAnalyticsListeners>,
			);

			await waitFor(
				() => {
					expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							actionSubject: 'smartLink',
							action: 'renderFailed',
							attributes: expect.objectContaining({
								error: new Error(),
								errorInfo: expect.any(Object),
							}),
						}),
					);
				},
				{ timeout: 5000 },
			);
			expect(onError).toHaveBeenCalledTimes(1);

			expect(mockStartUfoExperience).toHaveBeenCalledWith('smart-link-rendered', 'some-uuid-1');
			expect(mockFailUfoExperience).toHaveBeenCalledWith('smart-link-rendered', 'some-uuid-1');
			expect(mockFailUfoExperience).toHaveBeenCalledWith('smart-link-authenticated', 'some-uuid-1');
			expect(mockStartUfoExperience).toHaveBeenCalledBefore(mockFailUfoExperience as jest.Mock);

			spy.mockRestore();
		});

		it('should not send repeated render failed events when nonessential props are changed', async () => {
			const mockUrl = 'https://this.is.the.eight.url';
			const spy = jest.spyOn(cardWithUrlContent, 'CardWithUrlContent').mockImplementation(() => {
				throw new Error();
			});

			const onError = jest.fn();
			const { rerender } = render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<Provider client={mockClient}>
						<Card
							appearance="inline"
							url={mockUrl}
							actionOptions={{
								hide: false,
								exclude: [
									CardAction.DownloadAction,
									CardAction.PreviewAction,
									CardAction.ViewAction,
								],
							}}
							onError={onError}
						/>
					</Provider>
				</FabricAnalyticsListeners>,
			);

			rerender(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<Provider client={mockClient}>
						<Card testId="resolvedCard1" appearance="inline" url={mockUrl} onError={onError} />
					</Provider>
				</FabricAnalyticsListeners>,
			);

			await waitFor(
				() => {
					expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							actionSubject: 'smartLink',
							action: 'renderFailed',
							attributes: expect.objectContaining({
								error: new Error(),
								errorInfo: expect.any(Object),
								canBeDatasource: false,
								componentName: 'smart-cards',
								definitionId: null,
								destinationActivationId: null,
								destinationCategory: null,
								destinationContainerId: null,
								destinationObjectId: null,
								destinationObjectType: null,
								destinationProduct: null,
								destinationSubproduct: null,
								destinationTenantId: null,
								display: 'inline',
								displayCategory: 'smartLink',
								extensionKey: null,
								id: expect.any(String),
								listenerVersion: expect.any(String),
								packageName: expect.any(String),
								packageVersion: expect.any(String),
								resourceType: null,
								status: 'pending',
								statusDetails: null,
							}),
						}),
					);
				},
				{ timeout: 5000 },
			);

			expect(onError).toHaveBeenCalledTimes(1);
			spy.mockRestore();
		});

		describe('with datasources', () => {
			beforeEach(() => {
				mockFetch = jest.fn(async () => mocks.withDatasource);
				mockClient = new (fakeFactory(mockFetch, mockPostData))();
			});

			it.each<[CardAppearance, string]>([
				['inline', 'resolvedCard1-resolved-view'],
				['block', 'resolvedCard1'],
				['embed', 'resolvedCard1'],
			] satisfies Array<[CardAppearance, string]>)(
				'should fire the renderSuccess analytics event with canBeDatasource = true when the url was resolved and display is %s',
				async (appearance, testId) => {
					const mockUrl = 'https://this.is.the.sixth.url';
					render(
						<FabricAnalyticsListeners client={mockAnalyticsClient}>
							<IntlProvider locale="en">
								<Provider client={mockClient}>
									<Card testId="resolvedCard1" appearance={appearance} url={mockUrl} />
								</Provider>
							</IntlProvider>
						</FabricAnalyticsListeners>,
					);
					const resolvedView = await screen.findByTestId(testId);
					expect(resolvedView).toBeTruthy();
					await waitFor(() => {
						expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
							expect.objectContaining({
								action: 'renderSuccess',
								actionSubject: 'smartLink',
								attributes: expect.objectContaining({
									display: appearance,
									status: 'resolved',
									definitionId: 'd1',
									extensionKey: 'object-provider',
									canBeDatasource: true,
								}),
							}),
						);
					});
				},
			);
		});
	});
});
