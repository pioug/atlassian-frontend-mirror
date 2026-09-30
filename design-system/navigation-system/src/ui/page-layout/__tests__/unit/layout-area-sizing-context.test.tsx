import React from 'react';

import { act } from '@atlassian/testing-library/act';
import { render as renderWithoutStrictMode } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { waitFor } from '@atlassian/testing-library/wait-for';

import { calculateLayoutAreaStates } from '../../calculate-layout-area-states';
import * as layoutAllocation from '../../calculate-layout-area-states';
import type { LayoutArea } from '../../layout-area-sizing-context';
import { LayoutAreaSizingProvider } from '../../layout-area-sizing-provider';
import { useLayoutAreaSizing } from '../../use-layout-area-sizing';
import { useLayoutMainSizing } from '../../use-layout-main-sizing';

const openAreas = {
	'side-nav': { defaultWidth: 320, minWidth: 240, isOpen: true },
	panel: { defaultWidth: 400, compactDefaultWidth: 320, minWidth: 320, isOpen: true },
	'chat-panel': { defaultWidth: 400, compactDefaultWidth: 320, minWidth: 320, isOpen: true },
} as const;

function calculate(
	viewportWidth: number,
	areas: Parameters<typeof calculateLayoutAreaStates>[0]['areas'] = openAreas,
) {
	return calculateLayoutAreaStates({
		viewportWidth,
		isChatPanelOverlay: viewportWidth < 640,
		isSideNavOverlay: viewportWidth < 1024,
		mainMinWidth: 320,
		areas,
	});
}

describe('layout area allocation', () => {
	it.each([0, 200, 500])(
		'caps overlay SideNav to Main after %ipx of occupied tracks',
		(occupiedWidth) => {
			const max = (700 - occupiedWidth) * 0.9;
			expect(
				calculateLayoutAreaStates({
					viewportWidth: 1000,
					layoutWidth: 700,
					occupiedWidth,
					isChatPanelOverlay: false,
					isSideNavOverlay: true,
					mainMinWidth: 320,
					areas: { 'side-nav': { defaultWidth: 900, minWidth: 240, isOpen: true } },
				})['side-nav'],
			).toEqual({
				mode: 'overlay',
				width: max,
				minWidth: Math.min(240, max),
				resizeBounds: { min: Math.min(240, max), max },
			});
		},
	);
	it.each([
		{ viewportWidth: 1000, chatMinWidth: 800, isChatPanelOverlay: false },
		{ viewportWidth: 700, chatMinWidth: 320, isChatPanelOverlay: true },
	])(
		'does not reserve inline space for overlay chat (%j)',
		({ viewportWidth, chatMinWidth, isChatPanelOverlay }) => {
			expect(
				calculateLayoutAreaStates({
					viewportWidth,
					isChatPanelOverlay,
					isSideNavOverlay: true,
					mainMinWidth: 320,
					areas: {
						panel: openAreas.panel,
						'chat-panel': { ...openAreas['chat-panel'], minWidth: chatMinWidth },
					},
				}),
			).toMatchObject({
				panel: { mode: 'inline', width: 320 },
				'chat-panel': { mode: 'overlay' },
			});
		},
	);
	it('allocates against Root content width while resolving vw against the viewport', () => {
		expect(
			calculateLayoutAreaStates({
				viewportWidth: 1200,
				isChatPanelOverlay: false,
				isSideNavOverlay: false,
				layoutWidth: 1185,
				mainMinWidth: 320,
				areas: openAreas,
			}).panel?.mode,
		).toBe('overlay');
		expect(
			calculateLayoutAreaStates({
				viewportWidth: 1200,
				isChatPanelOverlay: false,
				isSideNavOverlay: false,
				layoutWidth: 1185,
				mainMinWidth: '25vw',
				areas: { 'chat-panel': { defaultWidth: 1000, minWidth: '20vw', isOpen: true } },
			})['chat-panel'],
		).toMatchObject({ width: 885, minWidth: 240 });
	});

	it('does not select an implicit chat grid area when custom minimums fit below 40rem', () => {
		expect(
			calculateLayoutAreaStates({
				viewportWidth: 500,
				isChatPanelOverlay: true,
				isSideNavOverlay: true,
				mainMinWidth: 200,
				areas: { 'chat-panel': { defaultWidth: 400, minWidth: '200px', isOpen: true } },
			})['chat-panel']?.mode,
		).toBe('overlay');
	});

	it('reserves occupied tracks and overlays SideNav when its minimum cannot fit', () => {
		expect(
			calculateLayoutAreaStates({
				viewportWidth: 1024,
				isChatPanelOverlay: false,
				isSideNavOverlay: false,
				occupiedWidth: 512,
				mainMinWidth: 320,
				areas: { 'side-nav': openAreas['side-nav'] },
			}),
		).toMatchObject({ 'side-nav': { mode: 'overlay' } });
	});

	it('compresses managed areas after subtracting Ribbon, Aside and legacy Panel', () => {
		expect(
			calculateLayoutAreaStates({
				viewportWidth: 2000,
				isChatPanelOverlay: false,
				isSideNavOverlay: false,
				occupiedWidth: 700,
				mainMinWidth: 320,
				areas: openAreas,
			}),
		).toMatchObject({
			'side-nav': { width: 320 },
			panel: { width: 320 },
			'chat-panel': { width: 340 },
		});
	});

	it('uses the remaining Main region to constrain local overlays', () => {
		expect(
			calculateLayoutAreaStates({
				viewportWidth: 1440,
				isChatPanelOverlay: false,
				isSideNavOverlay: false,
				occupiedWidth: 600,
				mainMinWidth: 320,
				areas: openAreas,
			}),
		).toMatchObject({
			'side-nav': { mode: 'inline', width: 320 },
			panel: { mode: 'overlay', width: 400 },
			'chat-panel': { mode: 'overlay' },
		});
	});

	it('fits all areas at their large default widths when space allows', () => {
		expect(calculate(2048)).toMatchObject({
			'side-nav': { mode: 'inline', width: 320 },
			panel: { mode: 'inline', width: 400 },
			'chat-panel': { mode: 'inline', width: 400 },
		});
	});

	it('shrinks areas in panel, chat panel, then side nav order', () => {
		expect(calculate(1300)).toMatchObject({
			'side-nav': { width: 320 },
			panel: { width: 320 },
			'chat-panel': { width: 340 },
		});
	});

	it('does not protect previously resized regions from viewport compression', () => {
		expect(
			calculate(1300, {
				...openAreas,
				panel: { ...openAreas.panel, preferredInlineWidth: 400 },
				'chat-panel': {
					...openAreas['chat-panel'],
					preferredInlineWidth: 400,
				},
			}),
		).toMatchObject({
			'side-nav': { width: 320 },
			panel: { width: 320 },
			'chat-panel': { width: 340 },
		});
	});

	it.each([undefined, 560])(
		'keeps ChatPanel fixed during local panel growth (preferred width: %s)',
		(preferredInlineWidth) => {
			expect(
				calculateLayoutAreaStates({
					viewportWidth: 1440,
					isChatPanelOverlay: false,
					isSideNavOverlay: false,
					mainMinWidth: 320,
					areas: {
						'side-nav': { defaultWidth: 240, minWidth: 240, isOpen: true },
						panel: {
							defaultWidth: 320,
							minWidth: 320,
							isOpen: true,
							liveResize: { mode: 'inline', width: 503 },
						},
						'chat-panel': {
							defaultWidth: 560,
							minWidth: 320,
							isOpen: true,
							preferredInlineWidth,
						},
					},
					resizeSession: {
						area: 'panel',
						baselineWidths: { 'side-nav': 240, panel: 320, 'chat-panel': 560 },
					},
				}),
			).toMatchObject({
				'side-nav': { width: 240 },
				panel: { width: 320 },
				'chat-panel': { width: 560 },
			});
		},
	);

	it('promotes the panel to overlay before the chat panel', () => {
		expect(calculate(1024)).toMatchObject({
			'side-nav': { mode: 'inline' },
			panel: { mode: 'overlay' },
			'chat-panel': { mode: 'inline' },
		});
		expect(calculate(960)).toMatchObject({
			'side-nav': { mode: 'overlay' },
			panel: { mode: 'inline' },
			'chat-panel': { mode: 'inline' },
		});
		expect(calculate(959)).toMatchObject({
			panel: { mode: 'overlay' },
			'chat-panel': { mode: 'inline' },
		});
		expect(calculate(639)).toMatchObject({
			panel: { mode: 'overlay' },
			'chat-panel': { mode: 'overlay' },
		});
	});

	it('derives overlay thresholds from overridden minimum widths', () => {
		const areas = {
			...openAreas,
			'chat-panel': { ...openAreas['chat-panel'], minWidth: 280 },
		};

		expect(calculate(640, areas)['chat-panel']?.mode).toBe('inline');
		expect(calculate(639, areas)['chat-panel']?.mode).toBe('overlay');
		expect(calculate(599, areas)['chat-panel']?.mode).toBe('overlay');
	});

	it('uses compact panel and chat defaults below 64rem', () => {
		expect(calculate(960)).toMatchObject({
			panel: { width: 320 },
			'chat-panel': { width: 320 },
		});
	});

	it('uses the 64rem query instead of assuming a 16px browser font', () => {
		const inputs = {
			viewportWidth: 1100,
			isChatPanelOverlay: false,
			mainMinWidth: 320,
			areas: openAreas,
		};
		expect(calculateLayoutAreaStates({ ...inputs, isSideNavOverlay: true })).toMatchObject({
			'side-nav': { mode: 'overlay' },
			panel: { mode: 'inline', width: 320 },
			'chat-panel': { mode: 'inline', width: 320 },
		});
	});
});

describe.each([false, true])('layout area sizing (Strict Mode: %s)', (strictMode) => {
	beforeEach(() => {
		const matchMedia = window.matchMedia;
		jest.spyOn(window, 'matchMedia').mockImplementation((query) => ({
			...matchMedia(query),
			get matches() {
				return window.innerWidth >= (query === '(min-width: 64rem)' ? 1024 : 640);
			},
		}));
	});
	afterEach(() => jest.restoreAllMocks());

	const render = (ui: React.ReactElement) =>
		renderWithoutStrictMode(ui, { wrapper: strictMode ? React.StrictMode : React.Fragment });

	it('does not reallocate for callback-only changes and dismisses using the latest callback', () => {
		const originalWidth = window.innerWidth;
		window.innerWidth = 600;
		const allocate = jest.spyOn(layoutAllocation, 'calculateLayoutAreaStates');
		const onClose = jest.fn();
		function Areas({ version, navOpen }: { version: string; navOpen: boolean }) {
			useLayoutAreaSizing({
				area: 'side-nav',
				config: { ...openAreas['side-nav'], isOpen: navOpen },
			});
			const chat = useLayoutAreaSizing({
				area: 'chat-panel',
				config: { ...openAreas['chat-panel'], onRequestClose: () => onClose(version) },
			});
			return <output data-testid="chat">{chat.state?.width}</output>;
		}
		const fixture = (version: string, navOpen = false) => (
			<LayoutAreaSizingProvider>
				<Areas version={version} navOpen={navOpen} />
			</LayoutAreaSizingProvider>
		);
		try {
			const { rerender } = render(fixture('first'));
			expect(screen.getByTestId('chat')).toHaveTextContent('320');
			allocate.mockClear();
			rerender(fixture('second'));
			rerender(fixture('latest'));
			expect(allocate).not.toHaveBeenCalled();
			expect(onClose).not.toHaveBeenCalled();
			// Opening navigation replaces chat; its close handler must not retain
			// the closure captured at registration, even when both update together.
			rerender(fixture('opening navigation', true));
			expect(onClose).toHaveBeenCalledWith('opening navigation');
			expect(onClose.mock.calls.every(([version]) => version === 'opening navigation')).toBe(true);
		} finally {
			window.innerWidth = originalWidth;
			allocate.mockRestore();
		}
	});

	it('restores a controlled drag preview until its completed request is accepted', () => {
		const originalWidth = window.innerWidth;
		window.innerWidth = 1600;
		let actions: ReturnType<typeof useLayoutAreaSizing>;
		function Area({ area, requestedWidth }: { area: LayoutArea; requestedWidth?: number }) {
			const sizing = useLayoutAreaSizing({ area, config: { ...openAreas[area], requestedWidth } });
			if (area === 'panel') {
				actions = sizing;
			}
			return <output data-testid={area}>{sizing.state?.width}</output>;
		}
		const fixture = (width: number) => (
			<LayoutAreaSizingProvider>
				<Area area="side-nav" />
				<Area area="panel" requestedWidth={width} />
				<Area area="chat-panel" />
			</LayoutAreaSizingProvider>
		);
		try {
			const { rerender } = render(fixture(400));
			act(() => actions.startResize('inline'));
			act(() => actions.resize('inline', 560));
			expect(screen.getByTestId('panel')).toHaveTextContent('560');
			expect(screen.getByTestId('side-nav')).toHaveTextContent('320');
			act(() => actions.completeResize('inline', 560));
			expect(screen.getByTestId('panel')).toHaveTextContent('400');
			expect(screen.getByTestId('side-nav')).toHaveTextContent('320');
			rerender(fixture(560));
			expect(screen.getByTestId('panel')).toHaveTextContent('560');
			expect(screen.getByTestId('side-nav')).toHaveTextContent('320');
		} finally {
			window.innerWidth = originalWidth;
		}
	});

	it('retains preferences while closed but clears them when the registration owner unmounts', () => {
		const originalWidth = window.innerWidth;
		window.innerWidth = 1600;
		let actions: ReturnType<typeof useLayoutAreaSizing>;
		function Panel({ isOpen, defaultWidth }: { isOpen: boolean; defaultWidth: number }) {
			actions = useLayoutAreaSizing({
				area: 'panel',
				config: { defaultWidth, minWidth: 320, isOpen },
			});
			return <output data-testid="panel-width">{actions.state?.width}</output>;
		}
		const fixture = (key: string, isOpen: boolean, defaultWidth: number) => (
			<LayoutAreaSizingProvider>
				<Panel key={key} isOpen={isOpen} defaultWidth={defaultWidth} />
			</LayoutAreaSizingProvider>
		);
		try {
			const { rerender } = render(fixture('first', true, 400));
			act(() => actions.completeResize('inline', 600));
			expect(screen.getByTestId('panel-width')).toHaveTextContent('600');
			rerender(fixture('first', false, 400));
			rerender(fixture('first', true, 400));
			expect(screen.getByTestId('panel-width')).toHaveTextContent('600');
			rerender(fixture('replacement', true, 450));
			expect(screen.getByTestId('panel-width')).toHaveTextContent('450');
		} finally {
			window.innerWidth = originalWidth;
		}
	});

	it('observes Root content changes without a window resize and uses the measured width on completion', () => {
		const originalWidth = window.innerWidth;
		window.innerWidth = 1200;
		const callbacks: ResizeObserverCallback[] = [];
		jest.spyOn(window, 'ResizeObserver').mockImplementation((callback) => {
			callbacks.push(callback);
			return { observe: jest.fn(), unobserve: jest.fn(), disconnect: jest.fn() };
		});
		jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1185);
		let chatActions: ReturnType<typeof useLayoutAreaSizing> | undefined;
		function Area({ area }: { area: LayoutArea }) {
			const sizing = useLayoutAreaSizing({ area, config: openAreas[area] });
			if (area === 'chat-panel') {
				chatActions = sizing;
			}
			return (
				<output data-testid={area}>
					{sizing.state?.mode}:{sizing.state?.width}
				</output>
			);
		}
		function Fixture() {
			const ref = React.useRef<HTMLDivElement>(null);
			return (
				<LayoutAreaSizingProvider layoutRef={ref}>
					<div ref={ref} data-testid="root">
						<Area area="side-nav" />
						<Area area="panel" />
						<Area area="chat-panel" />
					</div>
				</LayoutAreaSizingProvider>
			);
		}
		try {
			const { unmount } = render(<Fixture />);
			expect(screen.getByTestId('panel')).toHaveTextContent('overlay');
			act(() => chatActions?.completeResize('inline', 1000));
			expect(screen.getByTestId('chat-panel')).toHaveTextContent('inline:545');
			const root = screen.getByTestId('root');
			act(() =>
				callbacks.forEach((callback) =>
					callback(
						[
							{
								target: root,
								contentRect: { ...root.getBoundingClientRect(), width: 1200 },
								borderBoxSize: [],
								contentBoxSize: [],
								devicePixelContentBoxSize: [],
							},
						],
						{} as ResizeObserver,
					),
				),
			);
			expect(window.innerWidth).toBe(1200);
			expect(screen.getByTestId('panel')).toHaveTextContent('inline:320');
			unmount();
		} finally {
			window.innerWidth = originalWidth;
		}
	});

	it.each(['chat-panel', 'side-nav'] as const)(
		'follows the rem media query for %s even when custom minimum widths would fit',
		(area) => {
			const originalWidth = window.innerWidth;
			window.innerWidth = area === 'side-nav' ? 1100 : 700;
			const query = new EventTarget();
			let matches = false;
			jest.spyOn(window, 'matchMedia').mockImplementation(() => ({
				get matches() {
					return matches;
				},
				media: '(min-width: 40rem)',
				onchange: null,
				addListener: jest.fn(),
				removeListener: jest.fn(),
				addEventListener: query.addEventListener.bind(query),
				removeEventListener: query.removeEventListener.bind(query),
				dispatchEvent: query.dispatchEvent.bind(query),
			}));
			function Chat() {
				useLayoutMainSizing(200);
				const { state } = useLayoutAreaSizing({
					area,
					config: { defaultWidth: 300, minWidth: 200, isOpen: true },
				});
				return <output data-testid="chat">{state?.mode}</output>;
			}
			try {
				render(
					<LayoutAreaSizingProvider>
						<Chat />
					</LayoutAreaSizingProvider>,
				);
				expect(screen.getByTestId('chat')).toHaveTextContent('overlay');
				act(() => {
					matches = true;
					query.dispatchEvent(new Event('change'));
				});
				expect(screen.getByTestId('chat')).toHaveTextContent('inline');
			} finally {
				window.innerWidth = originalWidth;
			}
		},
	);

	it.each<LayoutArea>(['side-nav', 'panel', 'chat-panel'])(
		'resizes %s only against Main, including below its minimum and after completion',
		(area) => {
			const originalWidth = window.innerWidth;
			window.innerWidth = 1600;
			let actions: ReturnType<typeof useLayoutAreaSizing>;
			function Area({ name }: { name: LayoutArea }) {
				const sizing = useLayoutAreaSizing({ area: name, config: openAreas[name] });
				if (name === area) {
					actions = sizing;
				}
				return <output data-testid={name}>{sizing.state?.width}</output>;
			}
			const expectWidths = (width: number) => {
				for (const name of ['side-nav', 'panel', 'chat-panel'] as const) {
					expect(screen.getByTestId(name)).toHaveTextContent(
						new RegExp(`^${name === area ? width : openAreas[name].defaultWidth}$`),
					);
				}
			};
			try {
				render(
					<LayoutAreaSizingProvider>
						<Area name="side-nav" />
						<Area name="panel" />
						<Area name="chat-panel" />
					</LayoutAreaSizingProvider>,
				);
				const maximum = openAreas[area].defaultWidth + 160;
				act(() => actions.startResize('inline'));
				expectWidths(openAreas[area].defaultWidth);
				act(() => actions.resize('inline', 2000));
				expectWidths(maximum);
				act(() => actions.completeResize('inline', maximum));
				expectWidths(maximum);
				act(() => actions.startResize('inline'));
				act(() => actions.resize('inline', 0));
				expectWidths(openAreas[area].minWidth);
				act(() => actions.completeResize('inline', openAreas[area].minWidth));
				expectWidths(openAreas[area].minWidth);
			} finally {
				window.innerWidth = originalWidth;
			}
		},
	);

	it('keeps compressed siblings fixed through successive resizes, then responds to viewport changes', () => {
		const originalWidth = window.innerWidth;
		window.innerWidth = 1300;
		const actions: Partial<Record<LayoutArea, ReturnType<typeof useLayoutAreaSizing>>> = {};
		function Area({ area }: { area: LayoutArea }) {
			const sizing = useLayoutAreaSizing({ area, config: openAreas[area] });
			actions[area] = sizing;
			return <output data-testid={area}>{sizing.state?.width}</output>;
		}
		try {
			render(
				<LayoutAreaSizingProvider>
					<Area area="side-nav" />
					<Area area="panel" />
					<Area area="chat-panel" />
				</LayoutAreaSizingProvider>,
			);
			for (const area of ['chat-panel', 'panel', 'side-nav'] as const) {
				const before = ['side-nav', 'panel', 'chat-panel'].map(
					(name) => screen.getByTestId(name).textContent,
				);
				act(() => actions[area]?.startResize('inline'));
				act(() => actions[area]?.resize('inline', 2000));
				act(() =>
					actions[area]?.completeResize('inline', Number(screen.getByTestId(area).textContent)),
				);
				expect(
					['side-nav', 'panel', 'chat-panel'].map((name) => screen.getByTestId(name).textContent),
				).toEqual(before);
			}
			act(() => {
				window.innerWidth = 1200;
				window.dispatchEvent(new Event('resize'));
			});
			expect(screen.getByTestId('side-nav')).toHaveTextContent('240');
			expect(screen.getByTestId('panel')).toHaveTextContent('320');
			expect(screen.getByTestId('chat-panel')).toHaveTextContent('320');
		} finally {
			window.innerWidth = originalWidth;
		}
	});

	it('keeps resize callbacks stable and only renders regions whose sizing changes', () => {
		const originalWidth = window.innerWidth;
		window.innerWidth = 1800;
		const renders = { 'side-nav': 0, panel: 0, 'chat-panel': 0, main: 0 };
		let chatActions: ReturnType<typeof useLayoutAreaSizing> | undefined;
		function Area({ area }: { area: LayoutArea }) {
			const sizing = useLayoutAreaSizing({ area, config: openAreas[area] });
			renders[area]++;
			if (area === 'chat-panel') {
				chatActions = sizing;
			}
			return <output data-testid={area}>{sizing.state?.width}</output>;
		}
		function Main() {
			useLayoutMainSizing(320);
			renders.main++;
			return null;
		}
		try {
			render(
				<LayoutAreaSizingProvider>
					<Main />
					<Area area="side-nav" />
					<Area area="panel" />
					<Area area="chat-panel" />
				</LayoutAreaSizingProvider>,
			);
			const initialRenders = { ...renders };
			const completeResize = chatActions?.completeResize;
			act(() => chatActions?.startResize('inline'));
			act(() => chatActions?.resize('inline', 500));
			expect(screen.getByTestId('chat-panel')).toHaveTextContent('500');
			expect(renders['side-nav']).toBe(initialRenders['side-nav']);
			expect(renders.panel).toBe(initialRenders.panel);
			expect(renders.main).toBe(initialRenders.main);
			const rendersAfterDrag = { ...renders };
			act(() => chatActions?.resize('inline', 500));
			expect(renders).toEqual(rendersAfterDrag);
			act(() => chatActions?.completeResize('inline', 500));
			act(() => chatActions?.startResize('inline'));
			act(() => chatActions?.resize('inline', 2000));
			const rendersAtLimit = { ...renders };
			act(() => chatActions?.resize('inline', 2100));
			expect(renders).toEqual(rendersAtLimit);
			act(() => {
				window.innerWidth = 1700;
				window.dispatchEvent(new Event('resize'));
			});
			expect(chatActions?.completeResize).toBe(completeResize);
			expect(renders.main).toBe(initialRenders.main);
		} finally {
			window.innerWidth = originalWidth;
		}
	});

	it('closes the older overlay above 639px when rem queries select the mobile layout', async () => {
		const originalInnerWidth = window.innerWidth;
		window.innerWidth = 700;
		const matchMedia = jest.mocked(window.matchMedia).getMockImplementation()!;
		jest.spyOn(window, 'matchMedia').mockImplementation((query) => ({
			...matchMedia(query),
			matches: false,
		}));
		const closeSideNav = jest.fn();
		const closeChatPanel = jest.fn();

		function Area({ area, onRequestClose }: { area: LayoutArea; onRequestClose: () => void }) {
			useLayoutAreaSizing({
				area,
				config: {
					defaultWidth: 320,
					minWidth: 320,
					isOpen: true,
					onRequestClose,
				},
			});
			return null;
		}

		render(
			<LayoutAreaSizingProvider>
				<Area area="side-nav" onRequestClose={closeSideNav} />
				<Area area="chat-panel" onRequestClose={closeChatPanel} />
			</LayoutAreaSizingProvider>,
		);

		await waitFor(() => expect(closeSideNav).toHaveBeenCalled());
		expect(closeChatPanel).not.toHaveBeenCalled();
		window.innerWidth = originalInnerWidth;
	});
});
