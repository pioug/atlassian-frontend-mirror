import React, { useState } from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { fireEvent } from '@atlassian/testing-library/fire-event';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { waitFor } from '@atlassian/testing-library/wait-for';

import * as panelLayoutDefaults from '../../get-panel-layout-defaults';
import { Main } from '../../main/main';
import { PanelLayout, type PanelLayoutProps } from '../../panel-layout';
import { Root } from '../../root';

// Exercise allocation synchronously; deferred loading has separate navigation coverage.
jest.mock('../../layout-area-sizing-provider', () => ({
	LayoutAreaSizingProvider: jest.requireActual('../../layout-area-sizing-runtime')
		.LayoutAreaSizingRuntime,
}));

beforeEach(() => {
	failGate('platform-dst-motion-uplift-panel');
	jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1200);
	const getComputedStyle = window.getComputedStyle;
	jest.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
		const style = getComputedStyle(element);
		// Browsers resolve percentages to pixels; JSDOM leaves them as percentages.
		if (style.width.endsWith('%')) {
			style.width = `${element.clientWidth}px`;
		}
		return style;
	});
	const matchMedia = window.matchMedia;
	jest
		.spyOn(window, 'matchMedia')
		.mockImplementation((query) => ({ ...matchMedia(query), matches: true }));
});

afterEach(() => {
	jest.restoreAllMocks();
});

function Host(props: Partial<PanelLayoutProps>): JSX.Element {
	return (
		<Root>
			<Main>
				<PanelLayout
					isPanelOpen={props.isPanelOpen ?? true}
					panel={props.panel ?? 'Caller content'}
					panelWidth={props.panelWidth}
					panelMinWidth={props.panelMinWidth}
					panelMaxWidth={props.panelMaxWidth}
					onPanelWidthChange={props.onPanelWidthChange}
					onResizeEnd={props.onResizeEnd}
					testId="layout"
				>
					Main content
				</PanelLayout>
			</Main>
		</Root>
	);
}

it.each([false, true])(
	'reuses initial defaults while accepting minimum-width prop changes (chat gate: %s)',
	(enabled) => {
		(enabled ? passGate : failGate)('platform-dst-chat-panel-layout');
		const getDefaults = jest.spyOn(panelLayoutDefaults, 'getPanelLayoutDefaults');
		const { rerender } = render(<Host />);
		const initialCalls = getDefaults.mock.calls.length;
		expect(initialCalls).toBeGreaterThan(0);
		expect(screen.getByTestId('layout--panel-slot')).toHaveStyle({
			'--p_lclPnlW': enabled ? '400px' : '365px',
		});
		rerender(<Host panelMinWidth={500} />);
		expect(getDefaults).toHaveBeenCalledTimes(initialCalls);
		expect(screen.getByTestId('layout--panel-slot')).toHaveStyle({ '--p_lclPnlW': '500px' });
	},
);

it.each([false, true])(
	'opens, closes and replaces caller-owned content (chat gate: %s)',
	(enabled) => {
		(enabled ? passGate : failGate)('platform-dst-chat-panel-layout');
		const { rerender } = render(<Host />);
		expect(screen.getByRole('region', { name: 'Panel' })).toHaveTextContent('Caller content');
		rerender(<Host isPanelOpen={false} />);
		expect(screen.queryByRole('region', { name: 'Panel' })).not.toBeInTheDocument();
		expect(screen.getByText('Main content')).toBeInTheDocument();
		rerender(<Host panel="Replacement content" />);
		expect(screen.getByRole('region', { name: 'Panel' })).toHaveTextContent('Replacement content');
	},
);

it.each([false, true])(
	'uses coordinator bounds and reports effective keyboard widths (chat gate: %s)',
	async (enabled) => {
		(enabled ? passGate : failGate)('platform-dst-chat-panel-layout');
		const onWidthChange = jest.fn();
		const onResizeEnd = jest.fn();
		render(
			<Host panelMaxWidth={600.5} onPanelWidthChange={onWidthChange} onResizeEnd={onResizeEnd} />,
		);
		const slider = screen.getByRole('slider', { name: 'Resize panel', hidden: true });
		fireEvent.focus(slider);
		expect(slider).toHaveAttribute('min', '320');
		expect(slider).toHaveAttribute('max', '600');
		// A synthetic value beyond the native range must still use the allocator's bound.
		fireEvent.change(slider, { target: { value: '800' } });
		expect(screen.getByTestId('layout--panel-slot')).toHaveStyle({ '--p_lclPnlW': '600px' });
		expect(onWidthChange).toHaveBeenLastCalledWith(600);
		await waitFor(() =>
			expect(onResizeEnd).toHaveBeenLastCalledWith(
				expect.objectContaining({ finalWidth: 600, mode: 'inline' }),
			),
		);
	},
);

it('retains a controlled preferred width while the available region shrinks and grows', () => {
	passGate('platform-dst-chat-panel-layout');
	let layoutWidth = 1200;
	jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => layoutWidth);
	const onResizeEnd = jest.fn();
	const { rerender } = render(<Host panelWidth={480} onResizeEnd={onResizeEnd} />);
	expect(screen.getByTestId('layout--panel-slot')).toHaveStyle({ '--p_lclPnlW': '480px' });
	layoutWidth = 700;
	fireEvent.resize(window);
	expect(screen.getByTestId('layout--panel-slot')).toHaveStyle({ '--p_lclPnlW': '380px' });
	layoutWidth = 1200;
	fireEvent.resize(window);
	expect(screen.getByTestId('layout--panel-slot')).toHaveStyle({ '--p_lclPnlW': '480px' });
	rerender(<Host panelWidth={540} onResizeEnd={onResizeEnd} />);
	expect(screen.getByTestId('layout--panel-slot')).toHaveStyle({ '--p_lclPnlW': '540px' });
	expect(onResizeEnd).not.toHaveBeenCalled();
});

it('shares an uncontrolled preference across modes and close/reopen without panel-system', () => {
	passGate('platform-dst-chat-panel-layout');
	const width = jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1200);
	const { rerender } = render(<Host />);
	const resize = (value: number) => {
		const slider = screen.getByRole('slider', { name: 'Resize panel', hidden: true });
		fireEvent.focus(slider);
		// Range inputs need an exact value change rather than text input.
		// eslint-disable-next-line testing-library/prefer-user-event
		fireEvent.change(slider, { target: { value } });
	};
	resize(500);
	width.mockReturnValue(600);
	fireEvent.resize(window);
	expect(screen.getByTestId('layout--panel-slot')).toHaveStyle({ '--p_lclPnlW': '500px' });
	rerender(<Host isPanelOpen={false} />);
	rerender(<Host />);
	expect(screen.getByTestId('layout--panel-slot')).toHaveStyle({ '--p_lclPnlW': '500px' });
	resize(460);
	width.mockReturnValue(1200);
	fireEvent.resize(window);
	expect(screen.getByTestId('layout--panel-slot')).toHaveStyle({ '--p_lclPnlW': '460px' });
});

it('does not replace a controlled preference until the caller accepts a resize', () => {
	passGate('platform-dst-chat-panel-layout');
	const width = jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1200);
	const onWidthChange = jest.fn();
	const { rerender } = render(<Host panelWidth={400} onPanelWidthChange={onWidthChange} />);
	const slider = screen.getByRole('slider', { name: 'Resize panel', hidden: true });
	fireEvent.focus(slider);
	// Range inputs need an exact value change rather than text input.
	// eslint-disable-next-line testing-library/prefer-user-event
	fireEvent.change(slider, { target: { value: 500 } });
	expect(onWidthChange).toHaveBeenCalledWith(500);
	expect(screen.getByTestId('layout--panel-slot')).toHaveStyle({ '--p_lclPnlW': '400px' });
	width.mockReturnValue(600);
	fireEvent.resize(window);
	expect(screen.getByTestId('layout--panel-slot')).toHaveStyle({ '--p_lclPnlW': '400px' });
	rerender(<Host panelWidth={500} onPanelWidthChange={onWidthChange} />);
	expect(screen.getByTestId('layout--panel-slot')).toHaveStyle({ '--p_lclPnlW': '500px' });
});

it('caps overlay width below the configured minimum in a narrow host', () => {
	passGate('platform-dst-chat-panel-layout');
	jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300);
	render(<Host panelWidth={480} panelMinWidth={320} />);
	const slider = screen.getByRole('slider', { name: 'Resize panel', hidden: true });
	fireEvent.focus(slider);
	expect(slider).toHaveAttribute('min', '270');
	expect(slider).toHaveAttribute('max', '270');
	expect(screen.getByTestId('layout--panel-slot')).toHaveStyle({ '--p_lclPnlW': '270px' });
	expect(screen.getByTestId('layout--panel-slot')).toHaveCompiledCss('grid-area', 'main');
});

it('delivers resize completion to the latest host callbacks', async () => {
	passGate('platform-dst-chat-panel-layout');
	const onResizeEnd = jest.fn();
	function Caller(): JSX.Element {
		const [width, setWidth] = useState(400);
		return (
			<Host
				panelWidth={width}
				onPanelWidthChange={setWidth}
				onResizeEnd={(event) => onResizeEnd(width, event)}
			/>
		);
	}
	render(<Caller />);
	const slider = screen.getByRole('slider', { name: 'Resize panel', hidden: true });
	fireEvent.focus(slider);
	fireEvent.change(slider, { target: { value: '480' } });
	await waitFor(() =>
		expect(onResizeEnd).toHaveBeenLastCalledWith(
			480,
			expect.objectContaining({ initialWidth: 400, finalWidth: 480 }),
		),
	);
});

it.each([false, true])(
	'reports the resized mode even if layout changes before keyboard completion (chat gate: %s)',
	async (enabled) => {
		(enabled ? passGate : failGate)('platform-dst-chat-panel-layout');
		const width = jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1200);
		const onResizeEnd = jest.fn();
		render(<Host onResizeEnd={onResizeEnd} />);
		const slider = screen.getByRole('slider', { name: 'Resize panel', hidden: true });
		const panel = screen.getByTestId('layout--panel-slot');
		fireEvent.focus(slider);
		expect(slider).toHaveAttribute('max', '880');
		fireEvent.change(slider, { target: { value: '480' } });
		expect(panel).toHaveStyle({ '--p_lclPnlW': '480px' });
		expect(onResizeEnd).not.toHaveBeenCalled();

		width.mockReturnValue(600);
		fireEvent.resize(window);
		fireEvent.focus(slider);
		expect(slider).toHaveAttribute('max', '540');
		await waitFor(() =>
			expect(onResizeEnd).toHaveBeenLastCalledWith({
				initialWidth: enabled ? 400 : 365,
				finalWidth: 480,
				mode: 'inline',
			}),
		);

		// The next interaction must capture its own mode, not retain the first interaction's.
		fireEvent.focus(slider);
		fireEvent.change(slider, { target: { value: '500' } });
		expect(panel).toHaveStyle({ '--p_lclPnlW': '500px' });
		width.mockReturnValue(1200);
		fireEvent.resize(window);
		fireEvent.focus(slider);
		expect(slider).toHaveAttribute('max', '880');
		await waitFor(() =>
			expect(onResizeEnd).toHaveBeenLastCalledWith(
				expect.objectContaining({ finalWidth: 500, mode: 'overlay' }),
			),
		);
		expect(onResizeEnd).toHaveBeenCalledTimes(2);
	},
);
