import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { IntlProvider } from 'react-intl';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { SmartCardProvider } from '@atlaskit/link-provider';
import {
	ErroredClient,
	flushPromises,
	ForbiddenClient,
	NotFoundClient,
	ResolvedClient,
	ResolvingClient,
	UnAuthClient,
} from '@atlaskit/link-test-helpers';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { act, render, waitFor } from '@atlassian/testing-library';

import { ANALYTICS_CHANNEL } from '../../../utils/analytics';
import { CardWithUrl } from '../component';

describe('CardWithUrl', () => {
	const setup = (CustomClient = UnAuthClient) => {
		const onEvent = jest.fn();

		const url = 'https://example.com';
		const card = <CardWithUrl appearance="inline" id="uid" url={url} />;
		const renderResult = render(card, {
			wrapper: ({ children }) => (
				<IntlProvider locale="en">
					<SmartCardProvider client={new CustomClient()}>
						<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
							{children}
						</AnalyticsListener>
					</SmartCardProvider>
				</IntlProvider>
			),
		});

		return { ...renderResult, card, onEvent };
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		const { container, unmount } = setup();
		await expect(container).toBeAccessible();
		unmount();
	});

	ffTest.on('platform_sl_event_ui_seen', '', () => {
		ffTest.both('rovo_chat_embed_card_dwell_and_hover_metrics', '', () => {
			describe('when not intersecting', () => {
				const observe = jest.fn();
				const unobserve = jest.fn();
				const disconnect = jest.fn();

				beforeAll(() => {
					Object.defineProperty(window, 'IntersectionObserver', {
						writable: true,
						configurable: true,
						value: jest.fn(() => ({
							observe,
							unobserve,
							disconnect,
						})),
					});
				});

				it('should disconnect intersection observer when unmounting if never intersected', async () => {
					const { container, unmount } = setup();

					expect(observe).toHaveBeenCalledTimes(1);
					expect(observe).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
					expect(disconnect).toHaveBeenCalledTimes(0);

					unmount();

					expect(disconnect).toHaveBeenCalledTimes(1);

					await expect(container).toBeAccessible();
				});

				it('should not fire ui.smartLink.seen when card is resolved but not intersected', async () => {
					const { onEvent } = setup();

					await waitFor(() => {
						// renderSuccess should fire (card resolved)
						expect(onEvent).toHaveBeenCalledWith(
							expect.objectContaining({
								payload: expect.objectContaining({ action: 'renderSuccess' }),
							}),
							ANALYTICS_CHANNEL,
						);
					});

					// seen should NOT have fired
					expect(onEvent).not.toHaveBeenCalledWith(
						expect.objectContaining({ payload: expect.objectContaining({ action: 'seen' }) }),
						ANALYTICS_CHANNEL,
					);
				});
			});
		});
	});

	describe('when intersecting', () => {
		const observe = jest.fn();
		const unobserve = jest.fn();
		const disconnect = jest.fn();

		beforeEach(() => {
			jest.restoreAllMocks();

			Object.defineProperty(window, 'IntersectionObserver', {
				writable: true,
				configurable: true,
				value: class MockIntersectionObserver implements IntersectionObserver {
					readonly root!: Element | null;
					readonly rootMargin!: string;
					readonly thresholds!: ReadonlyArray<number>;

					constructor(callback: IntersectionObserverCallback) {
						observe.mockImplementation(() => {
							const entries = [
								{ isIntersecting: true, intersectionRatio: 1 },
							] as IntersectionObserverEntry[];

							callback(entries, this);
						});
					}
					takeRecords = jest.fn();
					observe = observe;
					unobserve = unobserve;
					disconnect = disconnect;
				},
			});
		});

		ffTest.on('platform_sl_event_ui_seen', '', () => {
			ffTest.both('rovo_chat_embed_card_dwell_and_hover_metrics', '', () => {
				it('should fire ui.smartLink.seen event on unauthorized status', async () => {
					const { onEvent, unmount } = setup();

					await waitFor(() => {
						expect(onEvent).toBeFiredWithAnalyticEventOnce({
							payload: {
								actionSubject: 'smartLink',
								action: 'seen',
								attributes: {
									display: 'inline',
								},
								eventType: 'ui',
							},
						});
					});

					unmount();
				});

				it.each([
					['pending', ResolvingClient],
					['resolved', ResolvedClient],
					['forbidden', ForbiddenClient],
					['errored', ErroredClient],
					['not_found', NotFoundClient],
				])(
					'should not fire ui.smartLink.seen when intersected but card has %s status',
					async (status, Client) => {
						// Use a client that never resolves / hangs
						const { onEvent } = setup(Client);

						// Give effects time to run
						await act(async () => {
							await flushPromises();
						});

						expect(onEvent).not.toHaveBeenCalledWith(
							expect.objectContaining({ payload: expect.objectContaining({ action: 'seen' }) }),
							ANALYTICS_CHANNEL,
						);
					},
				);

				it('should fire ui.smartLink.seen only once even on re-render', async () => {
					const { card, onEvent, rerender } = setup();

					await waitFor(() => {
						expect(onEvent).toHaveBeenCalledWith(
							expect.objectContaining({ payload: expect.objectContaining({ action: 'seen' }) }),
							ANALYTICS_CHANNEL,
						);
					});

					// Trigger a re-render
					rerender(card);
					await act(async () => {
						await flushPromises();
					});

					const seenCalls = onEvent.mock.calls.filter(
						([event]) => event?.payload?.action === 'seen',
					);
					expect(seenCalls).toHaveLength(1); // must be exactly once
				});
			});
		});
	});
});
