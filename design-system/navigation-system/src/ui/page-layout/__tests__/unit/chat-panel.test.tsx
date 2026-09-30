import React from 'react';

import { renderToString } from 'react-dom/server';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { fireEvent } from '@atlassian/testing-library/fire-event';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { ChatPanel } from '../../chat-panel';
import { Main } from '../../main/main';
import { PanelSplitter } from '../../panel-splitter/panel-splitter';
import * as panelSplitterProvider from '../../panel-splitter/provider';
import { Root } from '../../root';
import { useLayoutAreaSizing } from '../../use-layout-area-sizing';

function ResizeBoundsSiblings({ overlayNav }: { overlayNav: boolean }) {
	useLayoutAreaSizing({
		area: 'side-nav',
		config: { isOpen: true, defaultWidth: overlayNav ? 620 : 320, minWidth: '20vw' },
	});
	useLayoutAreaSizing({
		area: 'panel',
		config: { isOpen: true, defaultWidth: 400, minWidth: 320 },
	});
	return (
		<>
			<nav data-layout-slot data-testid="nav" />
			<Main minWidth={320} testId="main">
				<div data-layout-with-panel-slot data-testid="local" />
			</Main>
		</>
	);
}

it.each([600, 300])('keeps overlay keyboard values and completion within a %ipx Root', (width) => {
	passGate('platform-dst-chat-panel-layout');
	const originalWidth = window.innerWidth;
	window.innerWidth = width;
	jest.useFakeTimers();
	const matchMedia = window.matchMedia;
	jest.spyOn(window, 'matchMedia').mockImplementation((query) => ({
		...matchMedia(query),
		matches: false,
	}));
	jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(width);
	const onResizeEnd = jest.fn();
	try {
		render(
			<Root>
				<Main>main</Main>
				<ChatPanel onClose={jest.fn()} testId="chat" maxWidth="1000px">
					<PanelSplitter label="Resize chat" onResizeEnd={onResizeEnd} />
				</ChatPanel>
			</Root>,
		);
		const slider = screen.getByRole('slider', { name: 'Resize chat', hidden: true });
		// eslint-disable-next-line testing-library/prefer-user-event
		fireEvent.focus(slider);
		const maximum = width * 0.9;
		expect(slider).toHaveAttribute('min', String(Math.min(320, maximum)));
		expect(slider).toHaveAttribute('max', String(maximum));
		// Simulate an input event queued with stale bounds before Root contracted.
		slider.setAttribute('max', '1000');
		// eslint-disable-next-line testing-library/prefer-user-event
		fireEvent.change(slider, { target: { value: 800 } });
		act(() => jest.runOnlyPendingTimers());
		expect(slider).toHaveValue(String(maximum));
		expect(screen.getByTestId('chat')).toHaveStyle({ '--n_cPnlW': `${maximum}px` });
		expect(onResizeEnd).toHaveBeenCalledWith(expect.objectContaining({ finalWidth: maximum }));
	} finally {
		window.innerWidth = originalWidth;
		jest.useRealTimers();
		jest.restoreAllMocks();
	}
});

it.each([false, true])(
	'aligns keyboard bounds, rendered width and completion with overlay nav: %s',
	(overlayNav) => {
		passGate('platform-dst-chat-panel-layout');
		const originalWidth = window.innerWidth;
		window.innerWidth = 1600;
		jest.useFakeTimers();
		const matchMedia = window.matchMedia;
		jest.spyOn(window, 'matchMedia').mockImplementation((query) => ({
			...matchMedia(query),
			matches: query === '(min-width: 64rem)' ? !overlayNav : true,
		}));
		jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1600);
		const onResizeEnd = jest.fn();
		try {
			render(
				<Root>
					<ResizeBoundsSiblings overlayNav={overlayNav} />
					<ChatPanel onClose={jest.fn()} testId="chat" defaultWidth={400}>
						<PanelSplitter label="Resize chat" onResizeEnd={onResizeEnd} />
					</ChatPanel>
				</Root>,
			);
			const chat = screen.getByTestId('chat');
			const main = screen.getByTestId('main');
			const nav = screen.getByTestId('nav');
			const local = screen.getByTestId('local');
			// JSDOM has no layout. Model the allocator's initial geometry and CSS minimums.
			for (const [element, width] of [
				[chat, 400],
				[main, overlayNav ? 1200 : 880],
				[nav, overlayNav ? 620 : 320],
				[local, 400],
			] as const) {
				jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({ width } as DOMRect);
			}
			const getComputedStyle = window.getComputedStyle;
			jest.spyOn(window, 'getComputedStyle').mockImplementation((element) => ({
				...getComputedStyle(element),
				gridArea:
					element === chat
						? 'chat-panel'
						: element === local
							? 'panel'
							: element === nav && !overlayNav
								? 'side-nav'
								: 'auto',
				getPropertyValue: (name: string) => getComputedStyle(element).getPropertyValue(name),
			}));
			const slider = screen.getByRole('slider', { name: 'Resize chat', hidden: true });
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.focus(slider);
			const maximum = overlayNav ? 880 : 560;
			expect(slider).toHaveAttribute('max', String(maximum));
			// An over-limit keyboard request is clamped by the range input.
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.change(slider, { target: { value: 1500 } });
			act(() => jest.runOnlyPendingTimers());
			expect(slider).toHaveValue(String(maximum));
			expect(chat).toHaveStyle({ '--n_cPnlW': `${maximum}px` });
			expect(onResizeEnd).toHaveBeenCalledWith({ initialWidth: 400, finalWidth: maximum });
		} finally {
			window.innerWidth = originalWidth;
			jest.useRealTimers();
			jest.restoreAllMocks();
		}
	},
);

it('should pass basic accessibility checks', async () => {
	const { container } = render(
		<ChatPanel onClose={jest.fn()} testId="chat-panel">
			chat panel
		</ChatPanel>,
	);

	await expect(container).toBeAccessible();
});

it('should use the default width and resize bounds', () => {
	const PanelSplitterProvider = jest.spyOn(panelSplitterProvider, 'PanelSplitterProvider');
	PanelSplitterProvider.mockClear();

	render(
		<ChatPanel onClose={jest.fn()} testId="chat-panel">
			chat panel
		</ChatPanel>,
	);

	expect(screen.getByTestId('chat-panel')).toHaveStyle({
		'--n_cPnlW': 'clamp(320px, 400px, 100vw)',
		'--n_cPnlOverlayW': 'clamp(320px, 320px, min(90vw, 100vw))',
	});

	const [{ getResizeBounds }] = PanelSplitterProvider.mock.calls[0];
	expect(getResizeBounds()).toEqual({ min: '320px', max: '90vw' });
});

it('should use provided width values', () => {
	const PanelSplitterProvider = jest.spyOn(panelSplitterProvider, 'PanelSplitterProvider');
	PanelSplitterProvider.mockClear();

	render(
		<ChatPanel
			onClose={jest.fn()}
			testId="chat-panel"
			defaultWidth={500}
			minWidth="360px"
			maxWidth="80vw"
		>
			chat panel
		</ChatPanel>,
	);

	expect(screen.getByTestId('chat-panel')).toHaveStyle({
		'--n_cPnlW': 'clamp(360px, 500px, 80vw)',
		'--n_cPnlOverlayW': 'clamp(360px, 500px, min(90vw, 80vw))',
	});

	const [{ getResizeBounds }] = PanelSplitterProvider.mock.calls[0];
	expect(getResizeBounds()).toEqual({ min: '360px', max: '80vw' });
});

it('should overlay the app only when Main and ChatPanel cannot both fit at their minimum widths', () => {
	render(
		<ChatPanel onClose={jest.fn()} testId="chat-panel">
			chat panel
		</ChatPanel>,
	);

	expect(screen.getByTestId('chat-panel')).toHaveCompiledCss('grid-area', '2/1/-1/-1');
	expect(screen.getByTestId('chat-panel')).toHaveCompiledCss('grid-area', 'chat-panel', {
		media: '(min-width: 40rem)',
	});
});

it('should use separate compact overlay and large inline defaults', () => {
	render(
		<ChatPanel onClose={jest.fn()} testId="chat-panel">
			chat panel
		</ChatPanel>,
	);

	expect(screen.getByTestId('chat-panel')).toHaveCompiledCss(
		'width',
		'var(--n_cPnlRsz,clamp(320px, 320px, min(90vw, 100vw)))',
	);
	expect(screen.getByTestId('chat-panel')).toHaveCompiledCss(
		'width',
		'var(--n_cPnlRsz,clamp(320px, 400px, 100vw))',
		{
			media: '(min-width: 40rem)',
		},
	);
});

it('should set the accessible label and test ID', () => {
	render(
		<ChatPanel onClose={jest.fn()} label="Rovo chat" testId="chat-panel">
			chat panel
		</ChatPanel>,
	);

	expect(screen.getByTestId('chat-panel')).toHaveAccessibleName('Rovo chat');
});

it('keeps the overlay above existing layout layers without raising the inline panel', () => {
	render(
		<ChatPanel onClose={jest.fn()} testId="chat-panel">
			chat panel
		</ChatPanel>,
	);
	expect(screen.getByTestId('chat-panel')).toHaveCompiledCss('z-index', '5');
	expect(screen.getByTestId('chat-panel')).toHaveCompiledCss('z-index', 'auto', {
		media: '(min-width: 40rem)',
	});
});

it('constrains the server-rendered chat track before hydration at the inline breakpoint', () => {
	passGate('platform-dst-chat-panel-layout');
	const originalWidth = window.innerWidth;
	window.innerWidth = 640;
	const matchMedia = window.matchMedia;
	const media = jest.spyOn(window, 'matchMedia').mockImplementation((query) => ({
		...matchMedia(query),
		matches: query === '(min-width: 40rem)',
	}));
	const width = jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(640);
	const element = (
		<Root testId="root">
			<Main testId="main">main</Main>
			<ChatPanel onClose={jest.fn()} testId="chat">
				chat
			</ChatPanel>
		</Root>
	);
	try {
		// renderToString returns HTML, not a Testing Library render result.
		// eslint-disable-next-line testing-library/render-result-naming-convention
		const markup = renderToString(element);
		// The server cannot measure Root. Its CSS must let the chat track shrink,
		// and constrain the chat element to that track before any effects run.
		expect(markup).toContain('minmax(var(--n_mainMinW),1fr) minmax(0,max-content)');
		expect(markup).toContain('max-width:100%');
		const container = document.createElement('div');
		container.innerHTML = markup;
		document.body.appendChild(container);
		const { unmount } = render(element, { container, hydrate: true });
		expect(screen.getByTestId('chat')).toHaveStyle({ '--n_cPnlW': '320px' });
		unmount();
	} finally {
		window.innerWidth = originalWidth;
		media.mockRestore();
		width.mockRestore();
	}
});
