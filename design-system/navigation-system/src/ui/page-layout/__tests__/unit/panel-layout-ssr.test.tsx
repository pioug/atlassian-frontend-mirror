import React from 'react';

import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { within } from '@atlassian/testing-library/within';

import { MainMinWidthContext } from '../../main-min-width-context';
import { Main } from '../../main/main';
import { PanelLayout } from '../../panel-layout';
import { PanelLayoutShell } from '../../panel-layout-shell';
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

it.each([
	{ props: {}, expected: 440 },
	{ props: { xlDefaultPanelWidth: 560 }, expected: 560 },
	{ props: { panelWidth: 460 }, expected: 460 },
	{ props: { panelMaxWidth: 420 }, expected: 420 },
])(
	'uses restored defaults and explicit overrides in the initial XL CSS: $props',
	({ props, expected }) => {
		passGate('platform-dst-chat-panel-layout');
		failGate('platform-dst-motion-uplift-panel');
		const errorsMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		try {
			const container = document.createElement('div');
			container.innerHTML = renderToString(
				<Root>
					<Main>
						<PanelLayout
							isPanelOpen
							defaultPanelWidth={440}
							{...props}
							panel="Preview content"
							testId="layout"
						>
							Main content
						</PanelLayout>
					</Main>
				</Root>,
			);
			expect(within(container).getByTestId('layout')).toHaveStyle({
				'--p_lclPnlXlW': `${expected}px`,
			});
			expect(
				errorsMock.mock.calls.filter(
					([message]) => !String(message).includes('useLayoutEffect does nothing on the server'),
				),
			).toEqual([]);
		} finally {
			jest.restoreAllMocks();
		}
	},
);

// A host hydration mismatch can retain the server ID while later renders use the client ID.
// The first open must still target the existing layout, without activating the resize runtime.
it.each([false, true])(
	'keeps initial query rules scoped after an ID mismatch (motion: %s)',
	async (motion) => {
		passGate('platform-dst-chat-panel-layout');
		const errorsMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const container = document.createElement('div');
		let root: ReturnType<typeof hydrateRoot> | undefined;
		const fixture = (open: boolean) => (
			<>
				{[320, 480.5].map((minimum) => (
					<MainMinWidthContext.Provider key={minimum} value={minimum}>
						<PanelLayoutShell
							isPanelOpen={open}
							panelWidth={400}
							compactPanelWidth={320}
							xlPanelWidth={500}
							xlDefaultPanelWidth={500}
							defaultPanelWidth={400}
							compactDefaultPanelWidth={320}
							isMotionEnabled={motion}
							panel="Preview"
							testId={`layout-${minimum}`}
						>
							Main
						</PanelLayoutShell>
					</MainMinWidthContext.Provider>
				))}
			</>
		);
		try {
			container.innerHTML = renderToString(fixture(false), { identifierPrefix: 'server-' });
			document.body.append(container);
			const layouts = [320, 480.5].map((minimum) =>
				within(container).getByTestId(`layout-${minimum}`),
			);
			await act(() => {
				root = hydrateRoot(container, fixture(false), { identifierPrefix: 'client-' });
			});
			await act(() => root?.render(fixture(true)));
			for (const layout of layouts) {
				expect(layout.id).toContain('server-');
				// eslint-disable-next-line testing-library/no-node-access -- Stylesheet scope has no accessible role.
				const styles = layout.parentElement!.querySelectorAll('style');
				expect(styles).toHaveLength(motion ? 2 : 1);
				for (const style of styles) {
					const selector = style.textContent!.split('{')[1].trim();
					// eslint-disable-next-line testing-library/no-node-access -- Verify the emitted CSS selector targets the retained DOM node.
					expect(Array.from(container.querySelectorAll(selector))).toEqual([layout]);
				}
			}
			await act(() => root?.render(fixture(false)));
			for (const layout of layouts) {
				// eslint-disable-next-line testing-library/no-node-access -- Closing must remove only the open-panel stylesheet.
				expect(layout.parentElement!.querySelectorAll('style')).toHaveLength(motion ? 1 : 0);
			}
		} finally {
			await act(() => root?.unmount());
			container.remove();
			errorsMock.mockRestore();
		}
	},
);
