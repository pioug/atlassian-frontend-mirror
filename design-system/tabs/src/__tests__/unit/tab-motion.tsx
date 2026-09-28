import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';

import { skipA11yAudit } from '@af/accessibility-testing/skip-a11y-audit';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import Tab from '../../components/tab';
import TabList from '../../components/tab-list';
import TabPanel from '../../components/tab-panel';
import Tabs from '../../components/tabs';
import useTab from '../../use-tab';

const motionGate = 'platform-dst-motion-uplift-tab';
const tabTransition = 'var(--ds-tab,color opacity .15s cubic-bezier(.4,1,.6,1))';
const selectedBorder =
	'var(--ds-border-width-selected,2px) solid var(--ds-border-selected,#1868db)';
const neutralBorder = 'var(--ds-border-width-selected,2px) solid var(--ds-border,#0b120e24)';
const indicatorEnterLeft =
	'var(--ds-tab-indicator-enter-left,.15s cubic-bezier(0,.4,0,1) SlideInRight8px,.15s cubic-bezier(0,.4,0,1) FadeIn0to100)';
const indicatorEnterRight =
	'var(--ds-tab-indicator-enter-right,.15s cubic-bezier(0,.4,0,1) SlideInLeft8px,.15s cubic-bezier(0,.4,0,1) FadeIn0to100)';
const indicatorExitLeft =
	'var(--ds-tab-indicator-exit-left,.1s cubic-bezier(.6,0,.8,.6) SlideOutLeft8px,.1s cubic-bezier(.6,0,.8,.6) FadeOut100to0)';
const indicatorExitRight =
	'var(--ds-tab-indicator-exit-right,.1s cubic-bezier(.6,0,.8,.6) SlideOutRight8px,.1s cubic-bezier(.6,0,.8,.6) FadeOut100to0)';

class TestAnimationEvent extends Event {
	readonly animationName: string;
	readonly elapsedTime: number;
	readonly pseudoElement: string;

	constructor(type: string, eventInit: AnimationEventInit = {}) {
		super(type, eventInit);
		this.animationName = eventInit.animationName ?? '';
		this.elapsedTime = eventInit.elapsedTime ?? 0;
		this.pseudoElement = eventInit.pseudoElement ?? '';
	}
}

type MediaQueryChangeListener = (event: MediaQueryListEvent) => void;

const originalAnimationEvent = window.AnimationEvent;
const originalMatchMedia = window.matchMedia;

const mockPrefersReducedMotion = (initialValue: boolean) => {
	let prefersReducedMotion = initialValue;
	const listeners = new Set<MediaQueryChangeListener>();

	Object.defineProperty(window, 'matchMedia', {
		configurable: true,
		value: jest.fn(
			(query: string) =>
				({
					get matches() {
						return prefersReducedMotion;
					},
					media: query,
					onchange: null,
					addListener: (listener: MediaQueryChangeListener) => listeners.add(listener),
					removeListener: (listener: MediaQueryChangeListener) => listeners.delete(listener),
					addEventListener: (_type: string, listener: MediaQueryChangeListener) =>
						listeners.add(listener),
					removeEventListener: (_type: string, listener: MediaQueryChangeListener) =>
						listeners.delete(listener),
					dispatchEvent: () => true,
				}) as MediaQueryList,
		),
		writable: true,
	});

	return (nextValue: boolean) => {
		prefersReducedMotion = nextValue;
		const event = { matches: nextValue } as MediaQueryListEvent;
		listeners.forEach((listener) => listener(event));
	};
};

const fireIndicatorAnimationEnd = (target: HTMLElement, pseudoElement = '::after') => {
	fireEvent(
		target,
		new window.AnimationEvent('animationend', {
			bubbles: true,
			pseudoElement,
		}),
	);
};

const CustomTab = ({
	children,
	onAnimationEnd,
	testId,
}: {
	children: React.ReactNode;
	onAnimationEnd?: React.AnimationEventHandler<HTMLSpanElement>;
	testId: string;
}) => {
	const tabAttributes = useTab();

	return (
		<span {...tabAttributes} data-testid={testId} onAnimationEnd={onAnimationEnd}>
			{children}
		</span>
	);
};

const DefaultTabs = () => (
	<Tabs id="motion-tabs">
		<TabList>
			<Tab testId="tab-1">Tab 1</Tab>
			<Tab testId="tab-2">Tab 2</Tab>
			<Tab testId="tab-3">Tab 3</Tab>
		</TabList>
		<TabPanel>Panel 1</TabPanel>
		<TabPanel>Panel 2</TabPanel>
		<TabPanel>Panel 3</TabPanel>
	</Tabs>
);

const renderDefaultTabs = () => render(<DefaultTabs />);

const renderCustomTabs = (onAnimationEnd?: React.AnimationEventHandler<HTMLSpanElement>) =>
	render(
		<Tabs id="custom-motion-tabs">
			<TabList>
				<CustomTab testId="custom-tab-1" onAnimationEnd={onAnimationEnd}>
					Tab 1
				</CustomTab>
				<CustomTab testId="custom-tab-2">Tab 2</CustomTab>
			</TabList>
			<TabPanel>Panel 1</TabPanel>
			<TabPanel>Panel 2</TabPanel>
		</Tabs>,
	);

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('tab motion uplift', () => {
	let updatePrefersReducedMotion: (nextValue: boolean) => void;

	beforeAll(() => {
		Object.defineProperty(window, 'AnimationEvent', {
			configurable: true,
			value: TestAnimationEvent,
			writable: true,
		});
	});

	beforeEach(() => {
		skipA11yAudit();
		updatePrefersReducedMotion = mockPrefersReducedMotion(false);
	});

	afterEach(() => {
		Object.defineProperty(window, 'matchMedia', {
			configurable: true,
			value: originalMatchMedia,
			writable: true,
		});
		jest.restoreAllMocks();
	});

	afterAll(() => {
		Object.defineProperty(window, 'AnimationEvent', {
			configurable: true,
			value: originalAnimationEvent,
			writable: true,
		});
	});

	it('preserves legacy default tab roots when the gate is off', () => {
		failGate(motionGate);
		renderDefaultTabs();

		const tab = screen.getByTestId('tab-1');
		const tabList = screen.getByRole('tablist');
		expect(tab).not.toHaveAttribute('data-motion-capable');
		expect(tab).not.toHaveAttribute('data-motion-state');
		expect(tab).not.toHaveAttribute('data-motion-direction');
		expect(screen.queryByTestId('tab-1--indicator')).not.toBeInTheDocument();
		expect(tabList).toHaveCompiledCss('border-block-end', selectedBorder, {
			target: ' [role=tab][aria-selected=true]:after',
		});
		expect(tabList).not.toHaveCompiledCss('transition', tabTransition, {
			target: ' [role=tab]',
		});
	});

	it('preserves legacy custom tab roots when the gate is off', () => {
		failGate(motionGate);
		renderCustomTabs();

		const tab = screen.getByTestId('custom-tab-1');
		const tabList = screen.getByRole('tablist');
		expect(tab).toHaveAttribute('aria-selected', 'true');
		expect(tab).not.toHaveAttribute('data-motion-capable');
		expect(tab).not.toHaveAttribute('data-motion-state');
		expect(tab).not.toHaveAttribute('data-motion-direction');
		expect(screen.queryByTestId('custom-tab-1--indicator')).not.toBeInTheDocument();
		expect(tabList).toHaveCompiledCss('border-block-end', selectedBorder, {
			target: ' [role=tab][aria-selected=true]:after',
		});
	});

	it('uses the same root-owned indicator contract for default and custom tabs', () => {
		passGate(motionGate);
		const { unmount } = renderDefaultTabs();

		const defaultTab = screen.getByTestId('tab-1');
		const defaultTabList = screen.getByRole('tablist');
		expect(defaultTab).toHaveAttribute('data-motion-capable', 'true');
		expect(defaultTab).toHaveAttribute('data-motion-state', 'entering');
		expect(defaultTab).toHaveAttribute('data-motion-direction', 'right');
		expect(screen.getByTestId('tab-2')).toHaveAttribute('data-motion-capable', 'true');
		expect(screen.getByTestId('tab-2')).not.toHaveAttribute('data-motion-state');
		expect(screen.queryByTestId('tab-1--indicator')).not.toBeInTheDocument();
		expect(defaultTabList).toHaveCompiledCss('animation', indicatorEnterLeft, {
			target: ' [role=tab][data-motion-state=entering][data-motion-direction=right]:after',
		});
		unmount();

		renderCustomTabs();
		const customTab = screen.getByTestId('custom-tab-1');
		expect(customTab).toHaveAttribute('data-motion-capable', 'true');
		expect(customTab).toHaveAttribute('data-motion-state', 'entering');
		expect(customTab).toHaveAttribute('data-motion-direction', 'right');
		expect(screen.getByTestId('custom-tab-2')).toHaveAttribute('data-motion-capable', 'true');
		expect(screen.getByTestId('custom-tab-2')).not.toHaveAttribute('data-motion-state');
		expect(screen.queryByTestId('custom-tab-1--indicator')).not.toBeInTheDocument();
	});

	it('keeps the first render deterministic before reconciling reduced motion', () => {
		passGate(motionGate);
		updatePrefersReducedMotion(true);

		const view = renderToString(<DefaultTabs />);

		expect(view).toContain('data-motion-state="entering"');
		expect(view).toContain('data-motion-direction="right"');
		expect(view).not.toContain('data-motion-state="visible"');
	});

	it('captures indicator completion before a custom tab stops bubbling', () => {
		passGate(motionGate);
		const onAnimationEnd = jest.fn((event: React.AnimationEvent<HTMLSpanElement>) => {
			event.stopPropagation();
		});
		renderCustomTabs(onAnimationEnd);
		const tab = screen.getByTestId('custom-tab-1');

		expect(tab).toHaveAttribute('data-motion-state', 'entering');
		fireIndicatorAnimationEnd(tab);

		expect(onAnimationEnd).toHaveBeenCalledTimes(1);
		expect(tab).toHaveAttribute('data-motion-state', 'visible');
	});

	it('maps right and left selection changes to matching enter and exit tokens', () => {
		passGate(motionGate);
		renderDefaultTabs();
		const tabList = screen.getByRole('tablist');
		const tab1 = screen.getByTestId('tab-1');
		const tab3 = screen.getByTestId('tab-3');

		fireIndicatorAnimationEnd(tab1);
		fireEvent.click(tab3);

		expect(tab1).toHaveAttribute('data-motion-state', 'exiting');
		expect(tab1).toHaveAttribute('data-motion-direction', 'right');
		expect(tab3).toHaveAttribute('data-motion-state', 'entering');
		expect(tab3).toHaveAttribute('data-motion-direction', 'right');
		expect(tabList).toHaveCompiledCss('animation', indicatorExitRight, {
			target: ' [role=tab][data-motion-state=exiting][data-motion-direction=right]:after',
		});
		expect(tabList).toHaveCompiledCss('animation', indicatorEnterLeft, {
			target: ' [role=tab][data-motion-state=entering][data-motion-direction=right]:after',
		});

		fireIndicatorAnimationEnd(tab1);
		fireIndicatorAnimationEnd(tab3);
		fireEvent.click(tab1);

		expect(tab3).toHaveAttribute('data-motion-state', 'exiting');
		expect(tab3).toHaveAttribute('data-motion-direction', 'left');
		expect(tab1).toHaveAttribute('data-motion-state', 'entering');
		expect(tab1).toHaveAttribute('data-motion-direction', 'left');
		expect(tabList).toHaveCompiledCss('animation', indicatorExitLeft, {
			target: ' [role=tab][data-motion-state=exiting][data-motion-direction=left]:after',
		});
		expect(tabList).toHaveCompiledCss('animation', indicatorEnterRight, {
			target: ' [role=tab][data-motion-state=entering][data-motion-direction=left]:after',
		});
	});

	it('settles only matching root pseudo-element animation completions', () => {
		passGate(motionGate);
		renderDefaultTabs();
		const tab1 = screen.getByTestId('tab-1');
		const tab3 = screen.getByTestId('tab-3');

		expect(tab1).toHaveAttribute('data-motion-state', 'entering');
		fireIndicatorAnimationEnd(tab1);
		expect(tab1).toHaveAttribute('data-motion-state', 'visible');

		fireEvent.click(tab3);
		fireIndicatorAnimationEnd(tab1);
		expect(tab1).not.toHaveAttribute('data-motion-state');
		expect(tab3).toHaveAttribute('data-motion-state', 'entering');
		fireIndicatorAnimationEnd(tab3);
		expect(tab3).toHaveAttribute('data-motion-state', 'visible');

		fireIndicatorAnimationEnd(tab3);
		expect(tab3).toHaveAttribute('data-motion-state', 'visible');
	});

	it('ignores descendant, non-indicator, invalid, and stale animation events', () => {
		passGate(motionGate);
		renderDefaultTabs();
		const tab = screen.getByTestId('tab-1');
		const descendant = screen.getByText('Tab 1');
		expect(descendant).not.toBe(tab);

		fireIndicatorAnimationEnd(descendant);
		expect(tab).toHaveAttribute('data-motion-state', 'entering');

		fireIndicatorAnimationEnd(tab, '::before');
		expect(tab).toHaveAttribute('data-motion-state', 'entering');

		tab.setAttribute('aria-posinset', '0');
		fireIndicatorAnimationEnd(tab);
		tab.setAttribute('aria-posinset', '1');
		expect(tab).toHaveAttribute('data-motion-state', 'entering');

		tab.setAttribute('data-motion-direction', 'left');
		fireIndicatorAnimationEnd(tab);
		tab.setAttribute('data-motion-direction', 'right');
		expect(tab).toHaveAttribute('data-motion-state', 'entering');

		fireIndicatorAnimationEnd(tab);
		expect(tab).toHaveAttribute('data-motion-state', 'visible');
	});

	it('preserves multiple captured exit directions and completes each independently', () => {
		passGate(motionGate);
		renderDefaultTabs();
		const tab1 = screen.getByTestId('tab-1');
		const tab2 = screen.getByTestId('tab-2');
		const tab3 = screen.getByTestId('tab-3');

		fireIndicatorAnimationEnd(tab1);
		fireEvent.click(tab3);
		fireEvent.click(tab2);

		expect(tab1).toHaveAttribute('data-motion-state', 'exiting');
		expect(tab1).toHaveAttribute('data-motion-direction', 'right');
		expect(tab3).toHaveAttribute('data-motion-state', 'exiting');
		expect(tab3).toHaveAttribute('data-motion-direction', 'left');
		expect(tab2).toHaveAttribute('data-motion-state', 'entering');
		expect(tab2).toHaveAttribute('data-motion-direction', 'left');

		fireIndicatorAnimationEnd(tab1);
		expect(tab1).not.toHaveAttribute('data-motion-state');
		expect(tab3).toHaveAttribute('data-motion-state', 'exiting');
		expect(tab2).toHaveAttribute('data-motion-state', 'entering');

		fireIndicatorAnimationEnd(tab3);
		expect(tab3).not.toHaveAttribute('data-motion-state');
		expect(tab2).toHaveAttribute('data-motion-state', 'entering');
		fireIndicatorAnimationEnd(tab2);
		expect(tab2).toHaveAttribute('data-motion-state', 'visible');
	});

	it('removes a reselected tab from exits while other exits finish independently', () => {
		passGate(motionGate);
		renderDefaultTabs();
		const tab1 = screen.getByTestId('tab-1');
		const tab2 = screen.getByTestId('tab-2');
		const tab3 = screen.getByTestId('tab-3');

		fireIndicatorAnimationEnd(tab1);
		fireEvent.click(tab3);
		fireEvent.click(tab2);
		fireEvent.click(tab1);

		expect(tab1).toHaveAttribute('data-motion-state', 'entering');
		expect(tab1).toHaveAttribute('data-motion-direction', 'left');
		expect(tab2).toHaveAttribute('data-motion-state', 'exiting');
		expect(tab2).toHaveAttribute('data-motion-direction', 'left');
		expect(tab3).toHaveAttribute('data-motion-state', 'exiting');
		expect(tab3).toHaveAttribute('data-motion-direction', 'left');

		fireIndicatorAnimationEnd(tab3);
		expect(tab3).not.toHaveAttribute('data-motion-state');
		expect(tab2).toHaveAttribute('data-motion-state', 'exiting');
		expect(tab1).toHaveAttribute('data-motion-state', 'entering');

		fireIndicatorAnimationEnd(tab2);
		fireIndicatorAnimationEnd(tab1);
		expect(tab2).not.toHaveAttribute('data-motion-state');
		expect(tab1).toHaveAttribute('data-motion-state', 'visible');
	});

	it('renders and changes selection without exits when reduced motion is initially preferred', () => {
		passGate(motionGate);
		updatePrefersReducedMotion(true);
		renderDefaultTabs();
		const tab1 = screen.getByTestId('tab-1');
		const tab3 = screen.getByTestId('tab-3');

		expect(tab1).toHaveAttribute('data-motion-state', 'visible');
		expect(tab1).toHaveAttribute('data-motion-direction', 'right');
		fireEvent.click(tab3);
		expect(tab1).not.toHaveAttribute('data-motion-state');
		expect(tab3).toHaveAttribute('data-motion-state', 'visible');
		expect(tab3).toHaveAttribute('data-motion-direction', 'right');
	});

	it('clears exits and settles the selected tab when reduced motion changes at runtime', () => {
		passGate(motionGate);
		renderDefaultTabs();
		const tab1 = screen.getByTestId('tab-1');
		const tab2 = screen.getByTestId('tab-2');
		const tab3 = screen.getByTestId('tab-3');

		fireEvent.click(tab3);
		expect(tab1).toHaveAttribute('data-motion-state', 'exiting');
		expect(tab3).toHaveAttribute('data-motion-state', 'entering');

		act(() => updatePrefersReducedMotion(true));
		expect(tab1).not.toHaveAttribute('data-motion-state');
		expect(tab3).toHaveAttribute('data-motion-state', 'visible');

		act(() => updatePrefersReducedMotion(false));
		expect(tab3).toHaveAttribute('data-motion-state', 'visible');
		fireEvent.click(tab2);
		expect(tab3).toHaveAttribute('data-motion-state', 'exiting');
		expect(tab2).toHaveAttribute('data-motion-state', 'entering');
	});

	it('keeps text and neutral-line transitions while layering the selected indicator', () => {
		passGate(motionGate);
		renderDefaultTabs();
		const tabList = screen.getByRole('tablist');

		expect(tabList).toHaveCompiledCss('transition', tabTransition, {
			target: ' [role=tab]',
		});
		expect(tabList).toHaveCompiledCss('transition', tabTransition, {
			target: ' [role=tab]:before',
		});
		expect(tabList).toHaveCompiledCss('border-block-end', neutralBorder, {
			target: ' [role=tab]:before',
		});
		expect(tabList).toHaveCompiledCss('opacity', '1', {
			target: ' [role=tab]:hover:before',
		});
		expect(tabList).toHaveCompiledCss('opacity', '1', {
			target: ' [role=tab]:active:before',
		});
		expect(tabList).toHaveCompiledCss('z-index', '1', {
			target: ' [role=tab][data-motion-state]:after',
		});
		expect(tabList).toHaveCompiledCss('pointer-events', 'none', {
			target: ' [role=tab][data-motion-state]:after',
		});
		expect(tabList).toHaveCompiledCss('border-block-end', selectedBorder, {
			target: ' [role=tab][data-motion-state]:after',
		});
		expect(tabList).toHaveCompiledCss('content', 'none', {
			target: ' [role=tab][aria-selected=false]:not([data-motion-state=exiting]):active:after',
		});
		expect(tabList).toHaveCompiledCss('color', 'var(--ds-text,#292a2e)', {
			target: ' [role=tab]:active',
		});
		expect(tabList).toHaveCompiledCss('color', 'var(--ds-text-selected,#1868db)', {
			target: ' [role=tab][aria-selected=true]:active',
		});
		expect(tabList).toHaveCompiledCss('border-block-end', selectedBorder, {
			target: ' [role=tab][aria-selected=true]:active:after',
		});
		expect(tabList).toHaveCompiledCss('transition', 'none', {
			media: '(prefers-reduced-motion: reduce)',
			target: ' [role=tab]',
		});
		expect(tabList).toHaveCompiledCss('transition', 'none', {
			media: '(prefers-reduced-motion: reduce)',
			target: ' [role=tab]:before',
		});
		expect(tabList).toHaveCompiledCss('animation-name', 'none', {
			media: '(prefers-reduced-motion: reduce)',
			target: ' [role=tab][data-motion-state][data-motion-direction]:after',
		});
		expect(tabList).toHaveCompiledCss('animation', indicatorEnterRight, {
			target: ' [role=tab]:dir(rtl)[data-motion-state=entering][data-motion-direction=right]:after',
		});
		expect(tabList).toHaveCompiledCss('animation', indicatorEnterLeft, {
			target: ' [role=tab]:dir(rtl)[data-motion-state=entering][data-motion-direction=left]:after',
		});
		expect(tabList).toHaveCompiledCss('animation', indicatorExitLeft, {
			target: ' [role=tab]:dir(rtl)[data-motion-state=exiting][data-motion-direction=right]:after',
		});
		expect(tabList).toHaveCompiledCss('animation', indicatorExitRight, {
			target: ' [role=tab]:dir(rtl)[data-motion-state=exiting][data-motion-direction=left]:after',
		});
		expect(tabList).toHaveCompiledCss('animation-name', 'none', {
			media: '(prefers-reduced-motion: reduce)',
			target: ' [role=tab]:dir(rtl)[data-motion-state][data-motion-direction]:after',
		});
	});
});
