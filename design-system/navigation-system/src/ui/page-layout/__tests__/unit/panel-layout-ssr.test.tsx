import React from 'react';

import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { within } from '@atlassian/testing-library/within';

import { Main } from '../../main/main';
import { PanelLayout } from '../../panel-layout';
import { Root } from '../../root';

it.each([false, true])(
	'uses the controlled width ahead of its default before and after hydration (chat gate: %s)',
	async (enabled) => {
		(enabled ? passGate : failGate)('platform-dst-chat-panel-layout');
		failGate('platform-dst-motion-uplift-panel');
		const fixture = (
			<Root>
				<Main minWidth={480}>
					<PanelLayout
						isPanelOpen
						defaultPanelWidth={400}
						panelWidth={600}
						panel="Preview content"
						testId="layout"
					>
						Main content
					</PanelLayout>
				</Main>
			</Root>
		);
		const errorsMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const recoverableError = jest.fn();
		jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1200);
		const matchMedia = window.matchMedia;
		jest.spyOn(window, 'matchMedia').mockImplementation((query) => ({
			...matchMedia(query),
			matches: true,
		}));
		const container = document.createElement('div');
		let root: ReturnType<typeof hydrateRoot> | undefined;
		try {
			const view = renderToString(fixture);
			container.innerHTML = view;
			document.body.append(container);
			const panel = within(container).getByRole('region', { name: 'Panel' });
			const layout = within(container).getByTestId('layout');
			// Custom Main minimums are available to SSR before registration effects run.
			expect(view).toContain(`@container local-panel-layout (min-width: ${enabled ? 800 : 640}px)`);
			// Assert the server markup before effects can replace the default with the controlled width.
			expect(panel).toHaveStyle({ '--p_lclPnlW': '600px' });
			expect(layout).toHaveStyle({ '--p_lclPnlTrackW': '600px' });
			await act(() => {
				root = hydrateRoot(container, fixture, { onRecoverableError: recoverableError });
			});
			expect(within(container).getByRole('region', { name: 'Panel' })).toBe(panel);
			expect(panel).toHaveStyle({ '--p_lclPnlW': '600px' });
			expect(layout).toHaveStyle({ '--p_lclPnlTrackW': '600px' });
			expect(recoverableError).not.toHaveBeenCalled();
			expect(
				errorsMock.mock.calls.filter(
					([message]) => !String(message).includes('useLayoutEffect does nothing on the server'),
				),
			).toEqual([]);
		} finally {
			await act(() => root?.unmount());
			container.remove();
			jest.restoreAllMocks();
		}
	},
);
