import React from 'react';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import '@atlaskit/link-test-helpers/jest';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen, userEvent } from '@atlassian/testing-library';

import { createLinkClickedPayload, withLinkClickedEvent } from '../click';

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(),
}));

describe('withLinkClickedEvent', () => {
	describe.each([['native `a` tag', withLinkClickedEvent('a')]])(
		'should support %s',
		(_, Component) => {
			const setup = () => {
				const user = userEvent.setup();

				const spy = jest.fn();
				const onClick = jest.fn((e) => e.preventDefault());
				const onMouseDown = jest.fn((e) => e.preventDefault());

				const wrapper = render(
					<AnalyticsListener onEvent={spy} channel="*">
						<Component href="https://atlassian.com" onClick={onClick} onMouseDown={onMouseDown} />
					</AnalyticsListener>,
				);

				return { user, onClick, onMouseDown, wrapper, spy };
			};

			it('should cause wrapped component to fire `link clicked` on left click', async () => {
				const { user, spy } = setup();

				const link = await screen.findByRole('link');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'clicked',
						actionSubject: 'link',
						eventType: 'ui',
						attributes: {
							clickType: 'left',
							clickOutcome: 'clickThrough',
							keysHeld: [],
						},
						nonPrivacySafeAttributes: {
							url: 'https://atlassian.com/',
						},
					},
				});
				expect(spy).not.toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'clicked',
						actionSubject: 'link',
						eventType: 'ui',
						attributes: {
							clickType: 'right',
						},
					},
				});

				await expect(document.body).toBeAccessible({ violationCount: 1 });
			});

			it('should cause wrapped component to fire `link clicked` on right click', async () => {
				const { user, spy } = setup();

				const link = await screen.findByRole('link');
				await user.pointer({ target: link, keys: '[MouseRight]' });

				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'clicked',
						actionSubject: 'link',
						eventType: 'ui',
						attributes: {
							clickType: 'right',
							clickOutcome: 'contextMenu',
							keysHeld: [],
						},
						nonPrivacySafeAttributes: {
							url: 'https://atlassian.com/',
						},
					},
				});
				expect(spy).not.toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'clicked',
						actionSubject: 'link',
						eventType: 'ui',
						attributes: {
							clickType: 'left',
						},
					},
				});

				await expect(document.body).toBeAccessible({ violationCount: 1 });
			});

			it('should support `onClick` and `onMouseDown` props', async () => {
				const { user, onClick, onMouseDown } = setup();

				const link = await screen.findByRole('link');
				await user.click(link);
				expect(onClick).toHaveBeenCalled();
				expect(onMouseDown).toHaveBeenCalled();

				jest.clearAllMocks();
				await user.pointer({ target: link, keys: '[MouseRight]' });
				expect(onClick).not.toHaveBeenCalled();
				expect(onMouseDown).toHaveBeenCalled();

				await expect(document.body).toBeAccessible({ violationCount: 1 });
			});
		},
	);

	describe('isConfluenceShortLink detection', () => {
		beforeEach(() => {
			const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
			expValEquals.mockReturnValue(false);
		});

		describe('when experiment is enabled', () => {
			beforeEach(() => {
				const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
				expValEquals.mockReturnValue(true);
			});
			it('should set isConfluenceShortLink to true when URL contains "/l/cp"', async () => {
				const user = userEvent.setup();
				const spy = jest.fn();

				const Component = withLinkClickedEvent('a');
				render(
					<AnalyticsListener onEvent={spy} channel="*">
						<Component href="https://atlassian.com/l/cp/12345" />
					</AnalyticsListener>,
				);

				const link = await screen.findByRole('link');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'clicked',
						actionSubject: 'link',
						eventType: 'ui',
						attributes: {
							clickType: 'left',
							clickOutcome: 'clickThrough',
							keysHeld: [],
							isConfluenceShortLink: true,
						},
						nonPrivacySafeAttributes: {
							url: 'https://atlassian.com/l/cp/12345',
						},
					},
				});

				await expect(document.body).toBeAccessible({ violationCount: 1 });
			});

			it('should set isConfluenceShortLink to false when URL does not contain "/l/cp"', async () => {
				const user = userEvent.setup();
				const spy = jest.fn();

				const Component = withLinkClickedEvent('a');
				render(
					<AnalyticsListener onEvent={spy} channel="*">
						<Component href="https://atlassian.com/page/12345" />
					</AnalyticsListener>,
				);

				const link = await screen.findByRole('link');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'clicked',
						actionSubject: 'link',
						eventType: 'ui',
						attributes: {
							clickType: 'left',
							clickOutcome: 'clickThrough',
							keysHeld: [],
							isConfluenceShortLink: false,
						},
						nonPrivacySafeAttributes: {
							url: 'https://atlassian.com/page/12345',
						},
					},
				});

				await expect(document.body).toBeAccessible({ violationCount: 1 });
			});

			it('should detect "/l/cp" in URL with query parameters', async () => {
				const user = userEvent.setup();
				const spy = jest.fn();

				const Component = withLinkClickedEvent('a');
				render(
					<AnalyticsListener onEvent={spy} channel="*">
						<Component href="https://atlassian.com/l/cp/12345?param=value" />
					</AnalyticsListener>,
				);

				const link = await screen.findByRole('link');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'clicked',
						actionSubject: 'link',
						eventType: 'ui',
						attributes: {
							clickType: 'left',
							clickOutcome: 'clickThrough',
							keysHeld: [],
							isConfluenceShortLink: true,
						},
						nonPrivacySafeAttributes: {
							url: 'https://atlassian.com/l/cp/12345?param=value',
						},
					},
				});

				await expect(document.body).toBeAccessible({ violationCount: 1 });
			});

			it('should detect "/l/cp" in URL with hash', async () => {
				const user = userEvent.setup();
				const spy = jest.fn();

				const Component = withLinkClickedEvent('a');
				render(
					<AnalyticsListener onEvent={spy} channel="*">
						<Component href="https://atlassian.com/l/cp/12345#section" />
					</AnalyticsListener>,
				);

				const link = await screen.findByRole('link');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'clicked',
						actionSubject: 'link',
						eventType: 'ui',
						attributes: {
							clickType: 'left',
							clickOutcome: 'clickThrough',
							keysHeld: [],
							isConfluenceShortLink: true,
						},
						nonPrivacySafeAttributes: {
							url: 'https://atlassian.com/l/cp/12345#section',
						},
					},
				});

				await expect(document.body).toBeAccessible({ violationCount: 1 });
			});

			it('should set isConfluenceShortLink to false when currentTarget is not an HTMLAnchorElement', async () => {
				const div = document.createElement('div');
				const event = {
					currentTarget: div,
					button: 0,
					metaKey: false,
					ctrlKey: false,
					shiftKey: false,
					altKey: false,
					defaultPrevented: false,
					nativeEvent: { detail: 1 },
				} as React.MouseEvent<HTMLDivElement>;

				const payload = createLinkClickedPayload(event);

				// When not an anchor element, isConfluenceShortLink should be false
				expect(payload?.attributes?.isConfluenceShortLink).toBe(false);

				await expect(document.body).toBeAccessible();
			});
		});

		describe('when experiment is disabled', () => {
			beforeEach(() => {
				const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
				expValEquals.mockReturnValue(false);
			});

			it('should not include isConfluenceShortLink in attributes when experiment is disabled', async () => {
				const user = userEvent.setup();
				const spy = jest.fn();

				const Component = withLinkClickedEvent('a');
				render(
					<AnalyticsListener onEvent={spy} channel="*">
						<Component href="https://atlassian.com/l/cp/12345" />
					</AnalyticsListener>,
				);

				const link = await screen.findByRole('link');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'clicked',
						actionSubject: 'link',
						eventType: 'ui',
						attributes: {
							clickType: 'left',
							clickOutcome: 'clickThrough',
							keysHeld: [],
						},
						nonPrivacySafeAttributes: {
							url: 'https://atlassian.com/l/cp/12345',
						},
					},
				});

				await expect(document.body).toBeAccessible({ violationCount: 1 });
			});
		});
	});

	describe('createLinkClickedPayload', () => {
		beforeEach(() => {
			const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
			expValEquals.mockReturnValue(false);
		});

		describe('when experiment is enabled', () => {
			beforeEach(() => {
				const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
				expValEquals.mockReturnValue(true);
			});
			it('should set isConfluenceShortLink to true for URLs containing "/l/cp"', async () => {
				const anchor = document.createElement('a');
				anchor.href = 'https://atlassian.com/l/cp/12345';
				const event = {
					currentTarget: anchor,
					button: 0,
					metaKey: false,
					ctrlKey: false,
					shiftKey: false,
					altKey: false,
					defaultPrevented: false,
					nativeEvent: { detail: 1 },
				} as React.MouseEvent<HTMLAnchorElement>;

				const payload = createLinkClickedPayload(event);

				expect(payload?.attributes?.isConfluenceShortLink).toBe(true);
				expect(payload?.nonPrivacySafeAttributes?.url).toBe('https://atlassian.com/l/cp/12345');

				await expect(document.body).toBeAccessible();
			});

			it('should set isConfluenceShortLink to false for URLs not containing "/l/cp"', async () => {
				const anchor = document.createElement('a');
				anchor.href = 'https://atlassian.com/page/12345';
				const event = {
					currentTarget: anchor,
					button: 0,
					metaKey: false,
					ctrlKey: false,
					shiftKey: false,
					altKey: false,
					defaultPrevented: false,
					nativeEvent: { detail: 1 },
				} as React.MouseEvent<HTMLAnchorElement>;

				const payload = createLinkClickedPayload(event);

				expect(payload?.attributes?.isConfluenceShortLink).toBe(false);
				expect(payload?.nonPrivacySafeAttributes?.url).toBe('https://atlassian.com/page/12345');

				await expect(document.body).toBeAccessible();
			});

			it('should detect "/l/cp" in URLs with query parameters', async () => {
				const anchor = document.createElement('a');
				anchor.href = 'https://atlassian.com/l/cp/12345?param=value&other=test';
				const event = {
					currentTarget: anchor,
					button: 0,
					metaKey: false,
					ctrlKey: false,
					shiftKey: false,
					altKey: false,
					defaultPrevented: false,
					nativeEvent: { detail: 1 },
				} as React.MouseEvent<HTMLAnchorElement>;

				const payload = createLinkClickedPayload(event);

				expect(payload?.attributes?.isConfluenceShortLink).toBe(true);

				await expect(document.body).toBeAccessible();
			});

			it('should detect "/l/cp" in URLs with hash fragments', async () => {
				const anchor = document.createElement('a');
				anchor.href = 'https://atlassian.com/l/cp/12345#section';
				const event = {
					currentTarget: anchor,
					button: 0,
					metaKey: false,
					ctrlKey: false,
					shiftKey: false,
					altKey: false,
					defaultPrevented: false,
					nativeEvent: { detail: 1 },
				} as React.MouseEvent<HTMLAnchorElement>;

				const payload = createLinkClickedPayload(event);

				expect(payload?.attributes?.isConfluenceShortLink).toBe(true);

				await expect(document.body).toBeAccessible();
			});

			it('should set isConfluenceShortLink to false when currentTarget is not an HTMLAnchorElement', async () => {
				const div = document.createElement('div');
				const event = {
					currentTarget: div,
					button: 0,
					metaKey: false,
					ctrlKey: false,
					shiftKey: false,
					altKey: false,
					defaultPrevented: false,
					nativeEvent: { detail: 1 },
				} as React.MouseEvent<HTMLDivElement>;

				const payload = createLinkClickedPayload(event);

				expect(payload?.attributes?.isConfluenceShortLink).toBe(false);
				expect(payload?.nonPrivacySafeAttributes).toBeUndefined();

				await expect(document.body).toBeAccessible();
			});

			it('should handle case sensitivity correctly - "/l/cp" should match but "/l/CP" should not', async () => {
				const anchor1 = document.createElement('a');
				anchor1.href = 'https://atlassian.com/l/cp/12345';
				const event1 = {
					currentTarget: anchor1,
					button: 0,
					metaKey: false,
					ctrlKey: false,
					shiftKey: false,
					altKey: false,
					defaultPrevented: false,
					nativeEvent: { detail: 1 },
				} as React.MouseEvent<HTMLAnchorElement>;

				const anchor2 = document.createElement('a');
				anchor2.href = 'https://atlassian.com/l/CP/12345';
				const event2 = {
					currentTarget: anchor2,
					button: 0,
					metaKey: false,
					ctrlKey: false,
					shiftKey: false,
					altKey: false,
					defaultPrevented: false,
					nativeEvent: { detail: 1 },
				} as React.MouseEvent<HTMLAnchorElement>;

				const payload1 = createLinkClickedPayload(event1);
				const payload2 = createLinkClickedPayload(event2);

				expect(payload1?.attributes?.isConfluenceShortLink).toBe(true);
				expect(payload2?.attributes?.isConfluenceShortLink).toBe(false);

				await expect(document.body).toBeAccessible();
			});
		});

		describe('when experiment is disabled', () => {
			beforeEach(() => {
				const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
				expValEquals.mockReturnValue(false);
			});

			it('should not include isConfluenceShortLink in payload when experiment is disabled', async () => {
				const anchor = document.createElement('a');
				anchor.href = 'https://atlassian.com/l/cp/12345';
				const event = {
					currentTarget: anchor,
					button: 0,
					metaKey: false,
					ctrlKey: false,
					shiftKey: false,
					altKey: false,
					defaultPrevented: false,
					nativeEvent: { detail: 1 },
				} as React.MouseEvent<HTMLAnchorElement>;

				const payload = createLinkClickedPayload(event);

				expect(payload?.attributes?.isConfluenceShortLink).toBeUndefined();

				await expect(document.body).toBeAccessible();
			});
		});
	});
});
