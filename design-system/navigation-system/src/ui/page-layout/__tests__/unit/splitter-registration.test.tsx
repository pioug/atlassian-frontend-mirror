/* eslint-disable testing-library/prefer-user-event -- Dispatch isolated events synchronously to test loading triggers and interactions before the runtime is ready. */
import React, { StrictMode, useCallback, useRef } from 'react';

import createStub from 'raf-stub';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { LayoutWithPanel } from '@atlassian/panel-system/layout-with-panel';
import { PanelProvider } from '@atlassian/panel-system/panel-provider';
import { screen } from '@atlassian/testing-library/screen';
import { act, fireEvent, render } from '@atlassian/testing-library/testing-library/react';

import type { LayoutAreaSizingContextValue } from '../../layout-area-sizing-context';
import type { LayoutAreaSizingRuntime } from '../../layout-area-sizing-runtime';
import { Main } from '../../main/main';
import * as widthUtils from '../../panel-splitter/get-pixel-width';
import { PanelSplitter } from '../../panel-splitter/panel-splitter';
import { PanelSplitterProvider } from '../../panel-splitter/provider';
import { Root } from '../../root';
import { useLayoutAreaSizing } from '../../use-layout-area-sizing';

// Keep the import and runtime readiness separate so interactions can arrive while loading.
const mockRuntime = jest.fn((_props: React.ComponentProps<typeof LayoutAreaSizingRuntime>) => null);
const mockLoadRuntime = jest.fn(() => ({ LayoutAreaSizingRuntime: mockRuntime }));
jest.mock('../../layout-area-sizing-runtime', () => mockLoadRuntime());

let measuredWidth = 400;
const runtime: LayoutAreaSizingContextValue = {
	registerArea: jest.fn(),
	unregisterArea: jest.fn(),
	setMainMinWidth: jest.fn(),
	getResizeBounds: () => ({ min: '320px', max: '960px' }),
	startResize: jest.fn(),
	resize: jest.fn((_area, _mode, width) => {
		measuredWidth = width;
	}),
	completeResize: jest.fn(),
};

function Splitters({
	version = 0,
	visible = true,
	managed = true,
	multiple = false,
}: {
	version?: number;
	visible?: boolean;
	managed?: boolean;
	multiple?: boolean;
}) {
	const panelRef = useRef<HTMLDivElement>(null);
	const portalRef = useRef<HTMLDivElement>(null);
	const sizing = useLayoutAreaSizing({
		area: 'chat-panel',
		config: { defaultWidth: 400, minWidth: 320, isOpen: true },
	});
	const getResizeBounds = useCallback(
		() => sizing.getResizeBounds() ?? { min: '320px', max: '960px' },
		[sizing.getResizeBounds],
	);
	const startResize = useCallback(() => sizing.startResize('inline'), [sizing.startResize]);
	const resize = useCallback((width: number) => sizing.resize('inline', width), [sizing.resize]);
	const completeResize = useCallback(
		(width: number) => sizing.completeResize('inline', width),
		[sizing.completeResize],
	);
	return (
		<div ref={panelRef} data-layout-slot data-testid="panel">
			<button type="button">Unrelated</button>
			<PanelSplitterProvider
				panelRef={panelRef}
				portalRef={portalRef}
				panelWidth={400}
				prepareResize={managed ? sizing.prepareResize : undefined}
				getResizeBounds={getResizeBounds}
				onResizeStartInternal={startResize}
				onResizeInternal={resize}
				onCompleteResize={completeResize}
				resizingCssVar="--test-resizing"
			>
				{visible && <PanelSplitter label="Resize" testId="splitter" />}
				{multiple && <PanelSplitter label="Other resize" testId="other-splitter" />}
			</PanelSplitterProvider>
			<div key={version} ref={portalRef} />
		</div>
	);
}

function Fixture({ version, visible, managed, multiple }: React.ComponentProps<typeof Splitters>) {
	return (
		<Root testId="layout">
			<Splitters version={version} visible={visible} managed={managed} multiple={multiple} />
		</Root>
	);
}

async function flushLoading() {
	await act(() => Promise.resolve());
}

async function finishLoading(area: 'chat-panel' | 'panel' = 'chat-panel') {
	await flushLoading();
	const props = mockRuntime.mock.calls[mockRuntime.mock.calls.length - 1][0];
	await act(async () => {
		props.onReady?.(runtime);
		props.onUpdate?.({ [area]: { mode: 'inline', width: 400, minWidth: 320 } });
	});
}

beforeEach(() => {
	// Only the deferred import is evaluated again; the fixture keeps its React/module instances.
	jest.resetModules();
	jest.clearAllMocks();
	mockLoadRuntime.mockImplementation(() => ({ LayoutAreaSizingRuntime: mockRuntime }));
	measuredWidth = 400;
	jest.spyOn(widthUtils, 'getPixelWidth').mockImplementation(() => measuredWidth);
});

afterEach(async () => {
	fireEvent.dragEnd(window);
	await flushLoading();
	fireEvent.pointerMove(window);
	jest.restoreAllMocks();
});

it.each(['pointerOver', 'focusIn', 'pointerDown'] as const)(
	'loads on %s only for registered splitters or their descendants',
	async (event) => {
		passGate('platform-dst-chat-panel-layout');
		const { unmount } = render(<Fixture />);
		await flushLoading();
		expect(mockLoadRuntime).not.toHaveBeenCalled();
		const unrelated = screen.getByRole('button', { name: 'Unrelated' });
		// An attribute alone must no longer opt an unrelated element into loading.
		unrelated.setAttribute('data-panel-splitter', '');
		fireEvent[event](unrelated);
		await flushLoading();
		expect(mockLoadRuntime).not.toHaveBeenCalled();
		const splitter = screen.getByTestId('splitter');
		expect(splitter).not.toHaveAttribute('data-panel-splitter');
		fireEvent[event](splitter);
		await flushLoading();
		expect(mockLoadRuntime).toHaveBeenCalledTimes(1);
		unmount();

		jest.resetModules();
		mockLoadRuntime.mockClear();
		render(<Fixture />);
		fireEvent[event](screen.getByRole('slider', { name: 'Resize', hidden: true }));
		await flushLoading();
		expect(mockLoadRuntime).toHaveBeenCalledTimes(1);
	},
);

it('deduplicates loading across multiple splitters and repeated events', async () => {
	passGate('platform-dst-chat-panel-layout');
	render(<Fixture multiple />);
	const splitter = screen.getByTestId('splitter');
	const other = screen.getByTestId('other-splitter');
	fireEvent.pointerOver(other);
	fireEvent.pointerDown(splitter);
	fireEvent.focusIn(other);
	await finishLoading();
	fireEvent.pointerOver(splitter);
	await flushLoading();
	expect(mockLoadRuntime).toHaveBeenCalledTimes(1);
});

it.each([
	['replace', 'splitter'],
	['replace', 'other-splitter'],
	['remount', 'splitter'],
	['remount', 'other-splitter'],
	['disable', 'splitter'],
] as const)(
	'unregisters the old element on %s and retains registration for %s',
	async (change, target) => {
		passGate('platform-dst-chat-panel-layout');
		const { rerender } = render(<Fixture multiple />);
		const oldSplitter = screen.getByTestId('splitter');
		if (change === 'replace') {
			rerender(<Fixture version={1} multiple />);
		} else if (change === 'remount') {
			rerender(<Fixture visible={false} multiple />);
			rerender(<Fixture multiple />);
		} else {
			rerender(<Fixture managed={false} />);
		}
		// Reattach a removed node within the same root: stale registration would load the runtime.
		const wasDetached = !oldSplitter.isConnected;
		if (wasDetached) {
			screen.getByTestId('panel').appendChild(oldSplitter);
		}
		fireEvent.pointerOver(oldSplitter);
		await flushLoading();
		expect(mockLoadRuntime).not.toHaveBeenCalled();
		if (wasDetached) {
			oldSplitter.remove();
		}
		if (change === 'disable') {
			rerender(<Fixture />);
		}
		fireEvent.pointerDown(screen.getByTestId(target));
		await flushLoading();
		expect(mockLoadRuntime).toHaveBeenCalledTimes(1);
	},
);

it('cleans up root listeners and registers again after the layout remounts', async () => {
	passGate('platform-dst-chat-panel-layout');
	const { unmount } = render(<Fixture />);
	const oldRoot = screen.getByTestId('layout');
	const oldSplitter = screen.getByTestId('splitter');
	const removeListener = jest.spyOn(oldRoot, 'removeEventListener');
	unmount();
	expect(removeListener.mock.calls.map(([type]) => type)).toEqual(
		expect.arrayContaining(['pointerover', 'focusin', 'pointerdown']),
	);
	fireEvent.pointerOver(oldSplitter);
	await flushLoading();
	expect(mockLoadRuntime).not.toHaveBeenCalled();
	render(<Fixture />);
	fireEvent.pointerOver(screen.getByTestId('splitter'));
	await flushLoading();
	expect(mockLoadRuntime).toHaveBeenCalledTimes(1);
});

it('retains registrations through StrictMode effect cleanup and setup', async () => {
	passGate('platform-dst-chat-panel-layout');
	render(
		<StrictMode>
			<Fixture />
		</StrictMode>,
	);
	await flushLoading();
	expect(mockLoadRuntime).not.toHaveBeenCalled();
	fireEvent.pointerOver(screen.getByTestId('splitter'));
	await flushLoading();
	expect(mockLoadRuntime).toHaveBeenCalledTimes(1);
});

it('does not load sizing for an unmanaged splitter when the layout gate is disabled', async () => {
	failGate('platform-dst-chat-panel-layout');
	render(<Fixture />);
	const splitter = screen.getByTestId('splitter');
	fireEvent.pointerOver(splitter);
	fireEvent.pointerDown(splitter);
	fireEvent.focusIn(screen.getByRole('slider', { name: 'Resize', hidden: true }));
	await flushLoading();
	expect(mockLoadRuntime).not.toHaveBeenCalled();
});

it('preserves the first keyboard resize until the runtime is ready', async () => {
	passGate('platform-dst-chat-panel-layout');
	render(<Fixture />);
	const slider = screen.getByRole('slider', { name: 'Resize', hidden: true });
	fireEvent.focusIn(slider);
	fireEvent.keyDown(slider, { key: 'End' });
	await flushLoading();
	expect(runtime.completeResize).not.toHaveBeenCalled();
	await finishLoading();
	expect(slider).toHaveValue('960');
	expect(runtime.completeResize).toHaveBeenCalledTimes(1);
	expect(runtime.completeResize).toHaveBeenCalledWith('chat-panel', 'inline', 960);
});

it('replays the first pointer resize in order after loading', async () => {
	passGate('platform-dst-chat-panel-layout');
	const raf = createStub();
	jest.spyOn(window, 'requestAnimationFrame').mockImplementation(raf.add);
	render(<Fixture />);
	const splitter = screen.getByTestId('splitter');
	fireEvent.pointerDown(splitter);
	fireEvent.mouseDown(splitter, { clientX: 400 });
	fireEvent.dragStart(splitter, { clientX: 400 });
	fireEvent.dragOver(splitter, { clientX: 440 });
	act(() => raf.step());
	fireEvent.drop(splitter);
	await flushLoading();
	expect(runtime.startResize).not.toHaveBeenCalled();
	expect(runtime.resize).not.toHaveBeenCalled();
	expect(runtime.completeResize).not.toHaveBeenCalled();
	await finishLoading();
	expect(runtime.startResize).toHaveBeenCalledWith('chat-panel', 'inline');
	expect(runtime.resize).toHaveBeenCalledWith('chat-panel', 'inline', 440);
	expect(runtime.completeResize).toHaveBeenCalledTimes(1);
	expect(runtime.completeResize).toHaveBeenCalledWith('chat-panel', 'inline', 440);
	expect((runtime.startResize as jest.Mock).mock.invocationCallOrder[0]).toBeLessThan(
		(runtime.resize as jest.Mock).mock.invocationCallOrder[0],
	);
	expect((runtime.resize as jest.Mock).mock.invocationCallOrder[0]).toBeLessThan(
		(runtime.completeResize as jest.Mock).mock.invocationCallOrder[0],
	);
});

it('abandons a failed keyboard interaction and retries on the next registered interaction', async () => {
	passGate('platform-dst-chat-panel-layout');
	mockLoadRuntime.mockImplementationOnce(() => {
		throw new Error('Chunk unavailable');
	});
	render(<Fixture />);
	const slider = screen.getByRole('slider', { name: 'Resize', hidden: true });
	fireEvent.focusIn(slider);
	fireEvent.keyDown(slider, { key: 'End' });
	await flushLoading();
	expect(mockLoadRuntime).toHaveBeenCalledTimes(1);
	expect(runtime.completeResize).not.toHaveBeenCalled();
	fireEvent.pointerOver(screen.getByTestId('splitter'));
	await finishLoading();
	expect(mockLoadRuntime).toHaveBeenCalledTimes(2);
	expect(runtime.completeResize).not.toHaveBeenCalled();
});

it('settles a pending interaction without committing after layout unmount', async () => {
	passGate('platform-dst-chat-panel-layout');
	const { unmount } = render(<Fixture />);
	const slider = screen.getByRole('slider', { name: 'Resize', hidden: true });
	fireEvent.focusIn(slider);
	fireEvent.keyDown(slider, { key: 'End' });
	unmount();
	await flushLoading();
	expect(mockRuntime).not.toHaveBeenCalled();
	expect(runtime.completeResize).not.toHaveBeenCalled();
});

function LocalPanelFixture() {
	return (
		<Root>
			<Main>
				<PanelProvider
					initialState={{
						activePanel: { instanceId: 'panel', panelContent: 'Panel content', params: {} },
					}}
				>
					<LayoutWithPanel defaultPanelWidth={400} testId="local-layout">
						<button type="button">Local main content</button>
					</LayoutWithPanel>
				</PanelProvider>
			</Main>
		</Root>
	);
}

describe.each([false, true])('LayoutWithPanel registration (chat gate: %s)', (enabled) => {
	beforeEach(() => {
		(enabled ? passGate : failGate)('platform-dst-chat-panel-layout');
		failGate('platform-dst-motion-uplift-panel');
		const getComputedStyle = window.getComputedStyle;
		jest.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
			const style = getComputedStyle(element);
			// Model the browser's container-query placement before the runtime measures it.
			if (element.hasAttribute('data-layout-with-panel-slot')) {
				style.gridArea = 'panel';
			}
			return style;
		});
	});

	it.each(['pointerOver', 'focusIn', 'pointerDown'] as const)(
		'loads on %s from the local splitter descendant without loading on mount or unrelated events',
		async (event) => {
			render(<LocalPanelFixture />);
			await flushLoading();
			expect(mockLoadRuntime).not.toHaveBeenCalled();
			fireEvent[event](screen.getByRole('button', { name: 'Local main content' }));
			await flushLoading();
			expect(mockLoadRuntime).not.toHaveBeenCalled();
			expect(screen.getByTestId('local-layout--panel-slot--splitter')).not.toHaveAttribute(
				'data-panel-splitter',
			);
			fireEvent[event](screen.getByRole('slider', { name: 'Resize panel', hidden: true }));
			await flushLoading();
			expect(mockLoadRuntime).toHaveBeenCalledTimes(1);
		},
	);

	it('preserves the first local keyboard resize while loading', async () => {
		render(<LocalPanelFixture />);
		const slider = screen.getByRole('slider', { name: 'Resize panel', hidden: true });
		fireEvent.focusIn(slider);
		fireEvent.keyDown(slider, { key: 'End' });
		await flushLoading();
		expect(runtime.completeResize).not.toHaveBeenCalled();
		await finishLoading('panel');
		expect(slider).toHaveValue('960');
		expect(runtime.completeResize).toHaveBeenCalledTimes(1);
		expect(runtime.completeResize).toHaveBeenCalledWith('panel', 'inline', 960);
	});

	it('preserves the first local pointer resize while loading', async () => {
		const raf = createStub();
		jest.spyOn(window, 'requestAnimationFrame').mockImplementation(raf.add);
		render(<LocalPanelFixture />);
		const splitter = screen.getByTestId('local-layout--panel-slot--splitter');
		fireEvent.pointerDown(splitter);
		fireEvent.mouseDown(splitter, { clientX: 400 });
		fireEvent.dragStart(splitter, { clientX: 400 });
		fireEvent.dragOver(splitter, { clientX: 360 });
		act(() => raf.step());
		fireEvent.drop(splitter);
		await flushLoading();
		expect(runtime.startResize).not.toHaveBeenCalled();
		expect(runtime.resize).not.toHaveBeenCalled();
		expect(runtime.completeResize).not.toHaveBeenCalled();
		await finishLoading('panel');
		expect(runtime.startResize).toHaveBeenCalledWith('panel', 'inline');
		expect(runtime.resize).toHaveBeenCalledWith('panel', 'inline', 440);
		expect(runtime.completeResize).toHaveBeenCalledTimes(1);
		expect(runtime.completeResize).toHaveBeenCalledWith('panel', 'inline', 440);
	});
});
