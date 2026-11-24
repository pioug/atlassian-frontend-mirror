import React from 'react';

import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { ChatPanel } from '../../chat-panel';
import { chatPanelInlineWidthVar, chatPanelWidthVar } from '../../constants';
import { DangerouslyHoistSlotSizes } from '../../hoist-slot-sizes-context';
import { Root } from '../../root';
import * as cssLayout from '../../use-css-layout-area-states';

const noop = () => {};
const Surface = ({ hoist = true }: { hoist?: boolean }) => (
	<DangerouslyHoistSlotSizes.Provider value={hoist}>
		<ChatPanel label="Chat" onClose={noop}>
			Chat content
		</ChatPanel>
	</DangerouslyHoistSlotSizes.Provider>
);
afterEach(() => jest.restoreAllMocks());

it('publishes actual chat width, updates during resizing, and removes it when closed', () => {
	passGate('platform-dst-chat-panel-layout');
	let notifyResize: ResizeObserverCallback = noop;
	const disconnect = jest.fn();
	jest.spyOn(window, 'ResizeObserver').mockImplementation((callback) => {
		notifyResize = callback;
		return { observe: noop, disconnect, unobserve: noop };
	});
	jest
		.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
		.mockReturnValue({ width: 380 } as DOMRect);
	const { unmount } = render(<Surface />);
	expect(document.documentElement.style.getPropertyValue(chatPanelWidthVar)).toBe('380px');
	act(() =>
		notifyResize(
			[
				{
					target: screen.getByRole('region', { name: 'Chat' }),
					borderBoxSize: [{ inlineSize: 520 }],
				} as unknown as ResizeObserverEntry,
			],
			{} as ResizeObserver,
		),
	);
	expect(document.documentElement.style.getPropertyValue(chatPanelWidthVar)).toBe('520px');
	unmount();
	expect(disconnect).toHaveBeenCalled();
	expect(document.documentElement.style.getPropertyValue(chatPanelWidthVar)).toBe('');
});

it('updates the inline width when Chat changes mode without changing its rendered width', () => {
	passGate('platform-dst-chat-panel-layout');
	const modes = jest.spyOn(cssLayout, 'useCssLayoutAreaStates');
	const layout = (hoist: boolean) => (
		<Root UNSAFE_dangerouslyHoistSlotSizes={hoist}>
			<ChatPanel label="Chat" onClose={noop}>
				Chat content
			</ChatPanel>
		</Root>
	);
	const style = document.documentElement.style;
	modes.mockReturnValue({ 'chat-panel': 'inline' });
	const { rerender, unmount: unmountPrimary } = render(layout(true));
	const inlineWidth = `var(${chatPanelWidthVar}, 0px)`;
	expect(style.getPropertyValue(chatPanelInlineWidthVar)).toBe(inlineWidth);

	const { unmount: unmountSecondary } = render(layout(false));
	unmountSecondary();
	expect(style.getPropertyValue(chatPanelInlineWidthVar)).toBe(inlineWidth);

	modes.mockReturnValue({ 'chat-panel': 'overlay' });
	rerender(layout(true));
	expect(style.getPropertyValue(chatPanelInlineWidthVar)).toBe('');

	modes.mockReturnValue({ 'chat-panel': 'inline' });
	rerender(layout(true));
	expect(style.getPropertyValue(chatPanelInlineWidthVar)).toBe(inlineWidth);
	unmountPrimary();
	expect(style.getPropertyValue(chatPanelInlineWidthVar)).toBe('');
});

it('does not allow non-hoisting layouts to overwrite or clear the primary width', () => {
	passGate('platform-dst-chat-panel-layout');
	jest
		.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
		.mockReturnValue({ width: 480 } as DOMRect);
	const { unmount: unmountPrimary } = render(<Surface />);
	const { unmount: unmountSecondary } = render(<Surface hoist={false} />);
	expect(document.documentElement.style.getPropertyValue(chatPanelWidthVar)).toBe('480px');
	unmountSecondary();
	expect(document.documentElement.style.getPropertyValue(chatPanelWidthVar)).toBe('480px');
	unmountPrimary();
});

it('does not publish width with the layout gate off', () => {
	failGate('platform-dst-chat-panel-layout');
	render(<Surface />);
	expect(document.documentElement.style.getPropertyValue(chatPanelWidthVar)).toBe('');
});
