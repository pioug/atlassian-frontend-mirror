import React from 'react';

import createStub from 'raf-stub';
import { RelayEnvironmentProvider } from 'react-relay';
import { createMockEnvironment } from 'relay-test-utils';

import * as elementAdapter from '@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { LayoutWithPanel } from '@atlassian/panel-system/layout-with-panel';
import { PanelProvider } from '@atlassian/panel-system/panel-provider';
import { act } from '@atlassian/testing-library/act';
import { fireEvent } from '@atlassian/testing-library/fire-event';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { ChatPanel } from '../../chat-panel';
import { Main } from '../../main/main';
import { PanelSplitter } from '../../panel-splitter/panel-splitter';
import { Root } from '../../root';

it.each([false, true])(
	'keeps flag-off drag registration stable (persistence: %s)',
	(persistence) => {
		failGate('platform-dst-chat-panel-layout');
		failGate('platform-dst-motion-uplift-panel');
		(persistence ? passGate : failGate)('platform-dst-panel-system-width-persistence');
		jest.useFakeTimers();
		const draggable = jest.spyOn(elementAdapter, 'draggable');
		const onResizeEnd = jest.fn();
		const initialState = {
			activePanels: [{ instanceId: 'panel', panelContent: <div>Panel content</div>, params: {} }],
		};
		const fixture = (content: string) => (
			<Root>
				<Main>
					<PanelProvider initialState={initialState}>
						<LayoutWithPanel panelWidth={400} onResizeEnd={onResizeEnd} testId="layout">
							{content}
						</LayoutWithPanel>
					</PanelProvider>
				</Main>
			</Root>
		);
		try {
			const { rerender, unmount } = render(fixture('Main content'));
			const splitter = screen.getByTestId('layout--panel-slot--splitter');
			const registrationCount = () =>
				draggable.mock.calls.filter(([options]) => options.element === splitter).length;
			const initialRegistrations = registrationCount();
			expect(initialRegistrations).toBeGreaterThan(0);
			for (const content of ['Updated main content', 'Another update']) {
				rerender(fixture(content));
				expect(registrationCount()).toBe(initialRegistrations);
			}
			// Verify the legacy object payload is still adapted to the public number callback.
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.change(screen.getByRole('slider', { name: 'Resize panel', hidden: true }), {
				target: { value: 480 },
			});
			act(() => jest.runOnlyPendingTimers());
			expect(onResizeEnd).toHaveBeenCalledTimes(1);
			expect(onResizeEnd).toHaveBeenCalledWith(480);
			unmount();
		} finally {
			jest.useRealTimers();
			jest.restoreAllMocks();
		}
	},
);

it.each([
	[false, 'panel'],
	[true, 'panel'],
	[false, 'chat'],
	[true, 'chat'],
] as const)(
	'keeps entry-point content and drag registration stable (persistence: %s, drag: %s)',
	async (persistence, area) => {
		passGate('platform-dst-chat-panel-layout');
		failGate('platform-dst-motion-uplift-panel');
		(persistence ? passGate : failGate)('platform-dst-panel-system-width-persistence');
		const originalWidth = window.innerWidth;
		window.innerWidth = 1800;
		const matchMedia = window.matchMedia;
		jest.spyOn(window, 'matchMedia').mockImplementation((query) => ({
			...matchMedia(query),
			matches: true,
		}));
		const raf = createStub();
		jest.spyOn(window, 'requestAnimationFrame').mockImplementation(raf.add);
		jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(raf.remove);
		jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1800);
		const draggable = jest.spyOn(elementAdapter, 'draggable');
		const onResizeEnd = jest.fn();
		const onRender = jest.fn();
		const onMount = jest.fn();
		function PanelContent() {
			onRender();
			React.useEffect(() => {
				onMount();
			}, []);
			return <div>Entry-point panel content</div>;
		}
		const entryPoint = {
			root: {
				getModuleId: () => 'test-panel',
				getModuleIfRequired: () => PanelContent,
				load: async () => PanelContent,
			},
			getPreloadProps: () => ({}),
		};
		const entryPointReference = {
			getComponent: () => PanelContent,
			dispose: jest.fn(),
			entryPoints: {},
			queries: {},
			extraProps: null,
			isDisposed: false,
			rootModuleID: 'test-panel',
		};
		const entryPointPanel = { instanceId: 'panel', entryPoint, entryPointReference, params: {} };
		try {
			const { unmount } = render(
				<RelayEnvironmentProvider environment={createMockEnvironment()}>
					<Root>
						<Main>
							<PanelProvider
								initialState={{
									activePanels: [entryPointPanel],
								}}
							>
								<LayoutWithPanel panelWidth={400} onResizeEnd={onResizeEnd} testId="layout">
									Main content
								</LayoutWithPanel>
							</PanelProvider>
						</Main>
						<ChatPanel onClose={jest.fn()} testId="chat" defaultWidth={1000}>
							<PanelSplitter label="Resize chat" testId="chat-splitter" />
						</ChatPanel>
					</Root>
				</RelayEnvironmentProvider>,
			);
			const panel = screen.getByTestId('layout--panel-slot');
			const main = screen.getByRole('main');
			expect(screen.getByText('Entry-point panel content')).toBeInTheDocument();
			const initialRenders = onRender.mock.calls.length;
			const initialMounts = onMount.mock.calls.length;
			jest.spyOn(main, 'getBoundingClientRect').mockReturnValue({ width: 800 } as DOMRect);
			jest.spyOn(panel, 'getBoundingClientRect').mockReturnValue({ width: 400 } as DOMRect);
			jest
				.spyOn(panel, 'offsetWidth', 'get')
				.mockImplementation(() => Number.parseFloat(panel.style.getPropertyValue('--p_lclPnlW')));
			const chat = screen.getByTestId('chat');
			jest
				.spyOn(chat, 'offsetWidth', 'get')
				.mockImplementation(() => Number.parseFloat(chat.style.getPropertyValue('--n_cPnlW')));
			const splitter = screen.getByTestId(
				area === 'panel' ? 'layout--panel-slot--splitter' : 'chat-splitter',
			);
			const registrationCount = () =>
				draggable.mock.calls.filter(([options]) => options.element === splitter).length;
			const initialRegistrations = registrationCount();
			expect(initialRegistrations).toBeGreaterThan(0);
			// PDD reads the mousedown origin before starting the native drag.
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseDown(splitter, { clientX: 1000 });
			fireEvent.dragStart(splitter, { clientX: 1000 });
			act(() => raf.step());
			for (const clientX of area === 'panel' ? [980, 960, 940] : [900, 880, 840]) {
				fireEvent.dragOver(splitter, { clientX });
				act(() => raf.step());
				expect(panel.style.getPropertyValue('--p_lclPnlW')).toBe(
					`${area === 'panel' ? 1400 - clientX : 400}px`,
				);
				expect(registrationCount()).toBe(initialRegistrations);
				expect(onRender).toHaveBeenCalledTimes(initialRenders);
				expect(onMount).toHaveBeenCalledTimes(initialMounts);
			}
			fireEvent.drop(splitter);
			if (area === 'panel') {
				expect(onResizeEnd).toHaveBeenCalledTimes(1);
				expect(onResizeEnd).toHaveBeenCalledWith(460);
			}
			unmount();
		} finally {
			fireEvent.dragEnd(window);
			await Promise.resolve();
			fireEvent.pointerMove(window);
			window.innerWidth = originalWidth;
			jest.restoreAllMocks();
		}
	},
);
