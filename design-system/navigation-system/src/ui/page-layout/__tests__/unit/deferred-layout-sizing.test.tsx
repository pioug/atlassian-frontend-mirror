import React, { useEffect, useRef, useState } from 'react';

import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';
import { waitFor } from '@atlassian/testing-library/wait-for';

import type { LayoutArea } from '../../layout-area-sizing-context';
import { LayoutAreaSizingProvider } from '../../layout-area-sizing-provider';
import { useLayoutAreaSizing } from '../../use-layout-area-sizing';
import { useLayoutMainSizing } from '../../use-layout-main-sizing';

it('reallocates adopted widths when Main minimum changes after activation', async () => {
	const rect = jest
		.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
		.mockImplementation(function (this: HTMLElement) {
			const width = Number.parseFloat(this.style.width) || 0;
			return {
				x: 0,
				y: 0,
				top: 0,
				left: 0,
				right: width,
				bottom: 600,
				width,
				height: 600,
				toJSON: () => ({}),
			};
		});
	const matchMedia = window.matchMedia;
	jest
		.spyOn(window, 'matchMedia')
		.mockImplementation((query) => ({ ...matchMedia(query), matches: true }));
	function Area({ area }: { area: 'side-nav' | 'chat-panel' }) {
		const defaultWidth = area === 'side-nav' ? 320 : 400;
		const sizing = useLayoutAreaSizing({
			area,
			config: { defaultWidth, minWidth: area === 'side-nav' ? 240 : 320, isOpen: true },
		});
		const Slot = area === 'side-nav' ? 'nav' : 'section';
		return (
			<Slot
				data-layout-slot
				data-layout-chat-panel={area === 'chat-panel' ? '' : undefined}
				// JSDOM cannot evaluate the CSS-first grid; model its initial geometry.
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={{ gridArea: area, width: sizing.state?.width ?? defaultWidth }}
			>
				<output data-testid={area}>{sizing.state?.width}</output>
				{area === 'chat-panel' && (
					<button type="button" onClick={() => void sizing.prepareResize?.()}>
						Load sizing
					</button>
				)}
			</Slot>
		);
	}
	function Layout() {
		const [minimum, setMinimum] = useState(320);
		useLayoutMainSizing(minimum);
		return (
			<>
				<Area area="side-nav" />
				<Area area="chat-panel" />
				<button type="button" onClick={() => setMinimum(600)}>
					Increase Main minimum
				</button>
				<div
					data-layout-slot
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					style={{ gridArea: 'aside', width: 400 }}
				/>
			</>
		);
	}
	function Fixture() {
		const ref = useRef<HTMLDivElement>(null);
		return (
			<LayoutAreaSizingProvider layoutRef={ref}>
				<div
					ref={ref}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					style={{ width: 1600, gridTemplateAreas: '"side-nav main aside chat-panel"' }}
				>
					<Layout />
				</div>
			</LayoutAreaSizingProvider>
		);
	}
	try {
		render(<Fixture />);
		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'Load sizing' }));
		await waitFor(() => expect(screen.getByTestId('chat-panel')).toHaveTextContent('400'));
		expect(screen.getByTestId('side-nav')).toHaveTextContent('320');
		await user.click(screen.getByRole('button', { name: 'Increase Main minimum' }));
		await waitFor(() => expect(screen.getByTestId('chat-panel')).toHaveTextContent('320'));
		expect(screen.getByTestId('side-nav')).toHaveTextContent('280');
	} finally {
		rect.mockRestore();
		jest.restoreAllMocks();
	}
});

it.each([false, true])(
	'coordinates overlays with the sizing runtime loaded: %s',
	async (loadRuntime) => {
		const matchMedia = window.matchMedia;
		jest.spyOn(window, 'matchMedia').mockImplementation((query) => ({
			...matchMedia(query),
			matches: false,
		}));
		const observe = jest.fn();
		jest.spyOn(window, 'ResizeObserver').mockImplementation(() => ({
			observe,
			unobserve: jest.fn(),
			disconnect: jest.fn(),
		}));
		function Area({ area }: { area: LayoutArea }) {
			const [isOpen, setIsOpen] = useState(false);
			const sizing = useLayoutAreaSizing({
				area,
				config: {
					defaultWidth: 320,
					minWidth: 320,
					isOpen,
					onRequestClose: () => setIsOpen(false),
				},
			});
			const Slot = area === 'side-nav' ? 'nav' : 'section';
			return (
				<Slot
					data-layout-slot
					data-layout-chat-panel={area === 'chat-panel' ? '' : undefined}
					data-layout-with-panel-slot={area === 'panel' ? '' : undefined}
				>
					<button type="button" onClick={() => setIsOpen(!isOpen)}>
						{area}
					</button>
					<output data-testid={area}>{isOpen ? 'open' : 'closed'}</output>
					<output data-testid={`${area}-sizing-status`}>{sizing.state ? 'ready' : 'css'}</output>
					{area === 'chat-panel' && (
						<>
							<button type="button" onClick={() => void sizing.prepareResize?.()}>
								Load sizing
							</button>
							<output data-testid="sizing-status">{sizing.state ? 'ready' : 'css'}</output>
						</>
					)}
				</Slot>
			);
		}
		function Fixture() {
			const ref = useRef<HTMLDivElement>(null);
			return (
				<LayoutAreaSizingProvider layoutRef={ref}>
					<div ref={ref} data-testid="css-root">
						<Area area="side-nav" />
						<Area area="panel" />
						<Area area="chat-panel" />
					</div>
				</LayoutAreaSizingProvider>
			);
		}
		try {
			render(<Fixture />);
			const user = userEvent.setup();
			await user.click(screen.getByRole('button', { name: 'panel' }));
			await user.click(screen.getByRole('button', { name: 'chat-panel' }));
			await user.click(screen.getByRole('button', { name: 'side-nav' }));
			expect(screen.getByTestId('chat-panel')).toHaveTextContent('closed');
			expect(screen.getByTestId('sizing-status')).toHaveTextContent('css');
			// Cold observation only watches the host, not any live resizing region.
			expect(
				observe.mock.calls.every(([element]) => element === screen.getByTestId('css-root')),
			).toBe(true);
			if (loadRuntime) {
				await user.click(screen.getByRole('button', { name: 'Load sizing' }));
				await waitFor(() =>
					expect(screen.getByTestId('side-nav-sizing-status')).toHaveTextContent('ready'),
				);
			}
			await user.click(screen.getByRole('button', { name: 'chat-panel' }));
			expect(screen.getByTestId('side-nav')).toHaveTextContent('closed');
			expect(screen.getByTestId('chat-panel')).toHaveTextContent('open');
			await user.click(screen.getByRole('button', { name: 'chat-panel' }));
			expect(screen.getByTestId('side-nav')).toHaveTextContent('closed');
			expect(screen.getByTestId('panel')).toHaveTextContent('open');
			if (!loadRuntime) {
				expect(screen.getByTestId('sizing-status')).toHaveTextContent('css');
			}
		} finally {
			jest.restoreAllMocks();
		}
	},
);

it('keeps SSR content and CSS widths through hydration and deferred activation without remounting', async () => {
	const mounts = jest.fn();
	const observe = jest.fn();
	const resizeObserver = jest.spyOn(window, 'ResizeObserver').mockImplementation(() => ({
		observe,
		unobserve: jest.fn(),
		disconnect: jest.fn(),
	}));
	const width = jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1000);
	const rect = jest
		.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
		.mockImplementation(function () {
			return {
				x: 0,
				y: 0,
				top: 0,
				left: 0,
				right: 360,
				bottom: 600,
				width: 360,
				height: 600,
				toJSON: () => ({}),
			};
		});
	function Chat() {
		const sizing = useLayoutAreaSizing({
			area: 'chat-panel',
			config: { defaultWidth: 400, minWidth: 320, isOpen: true },
		});
		useEffect(() => {
			mounts();
		}, []);
		return (
			<section
				aria-label="Chat"
				data-layout-chat-panel=""
				// JSDOM cannot evaluate Compiled grid styles; model the CSS-first layout explicitly.
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={{ gridArea: 'chat-panel', width: sizing.state?.width ?? 360 }}
			>
				<button data-panel-splitter="" type="button">
					Resize
				</button>
				{/* Native uncontrolled input deliberately detects remounts across activation. */}
				{/* eslint-disable-next-line @atlaskit/design-system/no-html-text-input */}
				<input aria-label="Draft" defaultValue="Draft survives loading" />
				<output data-testid="sizing-status">{sizing.state ? 'ready' : 'css'}</output>
			</section>
		);
	}
	function Fixture() {
		const ref = useRef<HTMLDivElement>(null);
		return (
			<LayoutAreaSizingProvider layoutRef={ref}>
				<div ref={ref} data-testid="hydration-root">
					<Chat />
				</div>
			</LayoutAreaSizingProvider>
		);
	}
	const container = document.createElement('div');
	container.innerHTML = renderToString(<Fixture />);
	document.body.appendChild(container);
	const section = screen.getByRole('region', { name: 'Chat' });
	const input = screen.getByRole('textbox', { name: 'Draft' });
	const errors = jest.fn();
	let root: ReturnType<typeof hydrateRoot> | undefined;
	try {
		expect(section).toHaveStyle({ width: '360px' });
		expect(observe).not.toHaveBeenCalled();
		await act(async () => {
			root = hydrateRoot(container, <Fixture />, { onRecoverableError: errors });
		});
		expect(section).toHaveStyle({ width: '360px' });
		expect(screen.getByTestId('sizing-status')).toHaveTextContent('css');
		expect(
			observe.mock.calls.every(([element]) => element === screen.getByTestId('hydration-root')),
		).toBe(true);
		const observations = observe.mock.calls.length;
		await userEvent.hover(section);
		expect(observe).toHaveBeenCalledTimes(observations);
		await userEvent.hover(screen.getByRole('button', { name: 'Resize' }));
		await waitFor(() => expect(screen.getByTestId('sizing-status')).toHaveTextContent('ready'));
		expect(section).toHaveStyle({ width: '360px' });
		expect(screen.getByRole('region', { name: 'Chat' })).toBe(section);
		expect(screen.getByRole('textbox', { name: 'Draft' })).toBe(input);
		expect(input).toHaveValue('Draft survives loading');
		expect(mounts).toHaveBeenCalledTimes(1);
		expect(errors).not.toHaveBeenCalled();
	} finally {
		act(() => root?.unmount());
		container.remove();
		resizeObserver.mockRestore();
		width.mockRestore();
		rect.mockRestore();
	}
});
