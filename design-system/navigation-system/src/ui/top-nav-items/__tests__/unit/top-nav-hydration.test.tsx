import React, { Suspense, useEffect } from 'react';

import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { within } from '@atlassian/testing-library/within';

import { TopNav } from '../../../page-layout/top-nav/top-nav';
import { useTopNavBreakpoints } from '../../../page-layout/top-nav/use-top-nav-breakpoints';

const originalResizeObserver = global.ResizeObserver;

// Exercise the real TopNav provider with navigation whose client code/data is still loading.
describe.each([false, true])('suspended navigation hydration (new theme: %s)', (newTheme) => {
	it.each([
		[false, 600],
		[false, 1200],
		[true, 600],
		[true, 1200],
	] as const)(
		'should preserve server navigation (gate: %s, width: %ipx)',
		async (enabled, width) => {
			(enabled ? passGate : failGate)('platform-dst-chat-panel-layout');
			(newTheme ? passGate : failGate)('platform_dst_nav4_custom_theming_fhs_1');
			let containerWidth = width;
			jest
				.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
				.mockImplementation(() => ({ width: containerWidth }) as DOMRect);
			let onResize: ResizeObserverCallback = () => {};
			global.ResizeObserver = jest.fn().mockImplementation((callback: ResizeObserverCallback) => {
				onResize = callback;
				return {
					observe: jest.fn(),
					unobserve: jest.fn(),
					disconnect: jest.fn(),
				};
			});
			let waitingForClient = false;
			let releaseNavigation: () => void = () => {};
			const pendingNavigation = new Promise<void>((resolve) => {
				releaseNavigation = resolve;
			});
			const hydrated = jest.fn();
			const recoverableError = jest.fn();
			function Navigation() {
				const breakpoints = useTopNavBreakpoints();
				useEffect(() => hydrated(), []);
				if (waitingForClient) {
					throw pendingNavigation;
				}
				return (
					<div data-testid="server-navigation">
						<button>Navigation action</button>
						<output data-testid="presentation">{breakpoints?.belowSm ? 'compact' : 'wide'}</output>
					</div>
				);
			}
			const navigation = (
				<TopNav>
					<Suspense fallback={<div>Loading navigation</div>}>
						<Navigation />
					</Suspense>
				</TopNav>
			);
			const container = document.createElement('div');
			// React's development SSR warning for layout effects is unrelated to hydration recovery.
			const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
			container.innerHTML = renderToString(navigation);
			consoleError.mockRestore();
			document.body.append(container);
			const queries = within(container);
			const serverNavigation = queries.getByTestId('server-navigation');
			const serverButton = queries.getByRole('button', { name: 'Navigation action' });
			waitingForClient = true;
			let root: ReturnType<typeof hydrateRoot> | undefined;
			try {
				await act(async () => {
					root = hydrateRoot(container, navigation, { onRecoverableError: recoverableError });
				});
				expect(hydrated).not.toHaveBeenCalled();
				expect(queries.queryByText('Loading navigation')).not.toBeInTheDocument();
				expect(queries.getByTestId('server-navigation')).toBe(serverNavigation);
				expect(serverButton).toBeVisible();
				expect(recoverableError).not.toHaveBeenCalled();
				// A resize while code/data is still loading must also preserve server DOM.
				const resizedWidth = width === 600 ? 1200 : 600;
				containerWidth = resizedWidth;
				if (enabled) {
					await act(async () => {
						onResize(
							[
								{
									target: queries.getByRole('banner'),
									borderBoxSize: [{ inlineSize: resizedWidth, blockSize: 48 }],
									contentBoxSize: [{ inlineSize: resizedWidth, blockSize: 48 }],
									devicePixelContentBoxSize: [{ inlineSize: resizedWidth, blockSize: 48 }],
									contentRect: new DOMRect(0, 0, resizedWidth, 48),
								},
							],
							{} as ResizeObserver,
						);
					});
					expect(queries.queryByText('Loading navigation')).not.toBeInTheDocument();
					expect(queries.getByTestId('server-navigation')).toBe(serverNavigation);
					expect(hydrated).not.toHaveBeenCalled();
				}
				await act(async () => {
					waitingForClient = false;
					releaseNavigation();
					await pendingNavigation;
				});
				expect(hydrated).toHaveBeenCalledTimes(1);
				expect(queries.getByTestId('server-navigation')).toBe(serverNavigation);
				expect(queries.getByRole('button', { name: 'Navigation action' })).toBe(serverButton);
				expect(queries.getByTestId('presentation')).toHaveTextContent(
					enabled && resizedWidth < 768 ? 'compact' : 'wide',
				);
				expect(recoverableError).not.toHaveBeenCalled();
			} finally {
				await act(async () => root?.unmount());
				container.remove();
			}
		},
	);
});

afterEach(() => {
	global.ResizeObserver = originalResizeObserver;
	jest.restoreAllMocks();
});
