/* eslint-disable @atlassian/a11y/require-jest-coverage -- Hook tests use plain measurement fixtures; Lozenge provides component accessibility coverage. */
import React from 'react';

import { act, render, screen } from '@testing-library/react';

import { token } from '@atlaskit/tokens';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { type ResizingOpts, useResizing } from '../../../resizing/use-resizing';
import { isReducedMotion } from '../../../utils/is-reduced-motion';

jest.mock('../../../utils/is-reduced-motion');
const originalObserver = global.ResizeObserver;
const originalAnimate = HTMLElement.prototype.animate;
const animations: Array<{
	effect: { target: Element | null };
	cancel: jest.Mock;
	onfinish: (() => void) | null;
	currentTime: number;
}> = [];
const animate = jest.fn(function (this: HTMLElement) {
	const animation = {
		effect: { target: this as Element | null },
		cancel: jest.fn(),
		onfinish: null as (() => void) | null,
		currentTime: 0,
	};
	animations.push(animation);
	return animation;
});
function latestAnimation() {
	return animations[animations.length - 1];
}
function expectWidth(from: number, to: number) {
	expect(animate).toHaveBeenLastCalledWith(
		[
			expect.objectContaining({ width: `${from}px` }),
			expect.objectContaining({ width: `${to}px` }),
		],
		expect.any(Object),
	);
}
let notify: ResizeObserverCallback;
const observe = jest.fn();
const unobserve = jest.fn();
const disconnect = jest.fn();

function TestComponent({ label = 'Ready', ...opts }: Partial<ResizingOpts> & { label?: string }) {
	return <Content label={label} options={opts} />;
}
function Content({ label, options }: { options: Partial<ResizingOpts>; label: string }) {
	const resizing = useResizing({
		dimension: 'width',
		duration: token('motion.duration.medium'),
		easing: token('motion.easing.inout.bold'),
		...options,
	});
	return (
		<div data-testid="parent">
			<div {...resizing} data-testid="element">
				<span>{label}</span>
			</div>
		</div>
	);
}
function resize(width: number, height = 20) {
	// jsdom does not inherit custom properties from the document theme.
	const element = screen.getByTestId('element');
	if (!element.style.getPropertyValue('--ds-duration-medium')) {
		element.style.setProperty('--ds-duration-medium', '200ms');
		element.style.setProperty('--ds-easing-inout-bold', 'cubic-bezier(0.4, 0, 0, 1)');
	}
	act(() =>
		notify(
			[
				{
					target: screen.getByTestId('element'),
					borderBoxSize: [{ inlineSize: width, blockSize: height }],
				} as unknown as ResizeObserverEntry,
			],
			{} as ResizeObserver,
		),
	);
}
function finish() {
	act(() => {
		latestAnimation()?.onfinish?.();
	});
}

describe('useResizing', () => {
	beforeEach(() => {
		passGate('platform-dst-motion-uplift');
		passGate('platform-dst-motion-observed-resizing');
		animations.length = 0;
		HTMLElement.prototype.animate = animate as unknown as typeof HTMLElement.prototype.animate;
		jest.clearAllMocks();
		(isReducedMotion as jest.Mock).mockReturnValue(false);
		global.ResizeObserver = jest.fn((callback) => {
			notify = callback;
			return { observe, unobserve, disconnect };
		}) as unknown as typeof ResizeObserver;
	});
	afterEach(() => {
		global.ResizeObserver = originalObserver;
		jest.restoreAllMocks();
		HTMLElement.prototype.animate = originalAnimate;
	});

	it('establishes the initial size without motion or synchronous geometry reads', () => {
		const measure = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
		const onStartMotion = jest.fn();
		const { rerender } = render(<TestComponent onStartMotion={onStartMotion} />);
		resize(100);
		rerender(<TestComponent onStartMotion={onStartMotion} />);
		rerender(<TestComponent onStartMotion={onStartMotion} label="Updated" />);
		expect(onStartMotion).not.toHaveBeenCalled();
		expect(measure).not.toHaveBeenCalled();
		expect(screen.getByTestId('element')).toHaveStyle({ width: '' });
	});

	it.each(['width', 'height', 'both'] as const)(
		'animates observed %s changes with the existing duration and easing',
		(dimension) => {
			const onStartMotion = jest.fn();
			const onFinishMotion = jest.fn();
			render(
				<TestComponent
					dimension={dimension}
					onStartMotion={onStartMotion}
					onFinishMotion={onFinishMotion}
				/>,
			);
			resize(100, 20);
			resize(300, 40);
			expect(animate).toHaveBeenCalledWith(
				[
					{
						boxSizing: 'border-box',
						...(dimension !== 'height' && { width: '100px' }),
						...(dimension !== 'width' && { height: '20px' }),
					},
					{
						boxSizing: 'border-box',
						...(dimension !== 'height' && { width: '300px' }),
						...(dimension !== 'width' && { height: '40px' }),
					},
				],
				{ duration: 200, easing: 'cubic-bezier(0.4, 0, 0, 1)' },
			);
			expect(onStartMotion).toHaveBeenCalledTimes(1);
			finish();
			expect(latestAnimation().cancel).toHaveBeenCalledTimes(1);
			expect(onFinishMotion).toHaveBeenCalledTimes(1);
		},
	);

	it('ignores resize notifications from its own animation and survives unrelated renders', () => {
		const onStartMotion = jest.fn();
		const onFinishMotion = jest.fn();
		const { rerender } = render(
			<TestComponent onStartMotion={onStartMotion} onFinishMotion={onFinishMotion} />,
		);
		resize(100);
		resize(300);
		resize(150);
		resize(250);
		rerender(<TestComponent onStartMotion={onStartMotion} onFinishMotion={onFinishMotion} />);
		expect(onStartMotion).toHaveBeenCalledTimes(1);
		finish();
		expect(onFinishMotion).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('element')).toHaveStyle({ width: '' });
	});

	it.each(['content', 'parent constraint'] as const)(
		'retargets a running animation after a %s mutation from its last observed frame',
		async (mutation) => {
			const onFinishMotion = jest.fn();
			render(<TestComponent onFinishMotion={onFinishMotion} />);
			resize(100);
			resize(300);
			resize(180);
			await act(async () => {
				if (mutation === 'content') screen.getByText('Ready').textContent = 'Done';
				else screen.getByTestId('parent').style.maxWidth = '250px';
			});
			expect(unobserve).toHaveBeenCalled();
			resize(80);
			expectWidth(180, 80);
			expect(animations[0].cancel).toHaveBeenCalledTimes(1);
			finish();
			expect(onFinishMotion).toHaveBeenCalledTimes(1);
		},
	);

	it.each(['parent ARIA', 'content ARIA', 'color', 'same-size content'] as const)(
		'preserves the same animation and clock after a %s change',
		async (mutation) => {
			const onStartMotion = jest.fn();
			const onFinishMotion = jest.fn();
			render(<TestComponent onStartMotion={onStartMotion} onFinishMotion={onFinishMotion} />);
			resize(100);
			resize(300);
			resize(180);
			const animation = latestAnimation();
			animation.currentTime = 75;
			await act(async () => {
				if (mutation === 'parent ARIA')
					screen.getByTestId('parent').setAttribute('aria-label', 'Status');
				else if (mutation === 'content ARIA')
					screen.getByTestId('element').setAttribute('aria-label', 'Status');
				else if (mutation === 'color') screen.getByTestId('element').style.color = 'red';
				else screen.getByText('Ready').textContent = 'Other';
			});
			expect(animation.effect.target).toBeNull();
			resize(300);
			expect(animation.effect.target).toBe(screen.getByTestId('element'));
			expect(animation.currentTime).toBe(75);
			expect(animate).toHaveBeenCalledTimes(1);
			expect(animation.cancel).not.toHaveBeenCalled();
			expect(onStartMotion).toHaveBeenCalledTimes(1);
			finish();
			expect(onFinishMotion).toHaveBeenCalledTimes(1);
		},
	);

	it('cancels motion when reduced motion is enabled', () => {
		const onStartMotion = jest.fn();
		const { rerender } = render(<TestComponent onStartMotion={onStartMotion} />);
		resize(100);
		resize(300);
		(isReducedMotion as jest.Mock).mockReturnValue(true);
		rerender(<TestComponent onStartMotion={onStartMotion} />);
		resize(400);
		finish();
		expect(screen.getByTestId('element')).toHaveStyle({ width: '' });
		expect(onStartMotion).toHaveBeenCalledTimes(1);
		expect(latestAnimation().cancel).toHaveBeenCalledTimes(1);
	});

	it('resolves CSS fallback values for duration and easing', () => {
		render(
			<TestComponent
				duration={'var(--missing-duration, 0.2s)' as ResizingOpts['duration']}
				easing={'var(--missing-easing, cubic-bezier(0.4, 0, 0, 1))' as ResizingOpts['easing']}
			/>,
		);
		resize(100);
		resize(300);
		expect(animate).toHaveBeenCalledWith(expect.any(Array), {
			duration: 200,
			easing: 'cubic-bezier(0.4, 0, 0, 1)',
		});
	});

	it.each([false, true])(
		'resolves nested timing fallbacks with custom properties set: %s',
		(defined) => {
			render(
				<TestComponent
					duration={
						'var(--missing-duration, var(--fallback-duration, 0.2s))' as ResizingOpts['duration']
					}
					easing={
						'var(--missing-easing, var(--fallback-easing, cubic-bezier(0.4, 0, 0, 1)))' as ResizingOpts['easing']
					}
				/>,
			);
			if (defined) {
				const element = screen.getByTestId('element');
				element.style.setProperty('--fallback-duration', '350ms');
				element.style.setProperty('--fallback-easing', 'linear');
			}
			resize(100);
			resize(300);
			expect(animate).toHaveBeenCalledWith(expect.any(Array), {
				duration: defined ? 350 : 200,
				easing: defined ? 'linear' : 'cubic-bezier(0.4, 0, 0, 1)',
			});
		},
	);

	it('does not animate changes on the unselected axis', () => {
		const onStartMotion = jest.fn();
		render(<TestComponent onStartMotion={onStartMotion} />);
		resize(100, 20);
		resize(100, 40);
		expect(onStartMotion).not.toHaveBeenCalled();
	});

	it('preserves unrelated inline styles', () => {
		render(<TestComponent />);
		const el = screen.getByTestId('element');
		el.style.color = 'red';
		resize(100);
		resize(300);
		finish();
		expect(el).toHaveStyle({ color: 'rgb(255, 0, 0)' });
	});

	it('disconnects observers and cancels pending work on unmount', () => {
		const onFinishMotion = jest.fn();
		const { unmount } = render(<TestComponent onFinishMotion={onFinishMotion} />);
		resize(100);
		resize(300);
		unmount();
		finish();
		expect(disconnect).toHaveBeenCalled();
		expect(latestAnimation().cancel).toHaveBeenCalledTimes(1);
		expect(onFinishMotion).not.toHaveBeenCalled();
	});
});

it('does not attach observers when the rollout gate is disabled', () => {
	passGate('platform-dst-motion-uplift');
	failGate('platform-dst-motion-observed-resizing');
	(isReducedMotion as jest.Mock).mockReturnValue(false);
	const observerConstructor = jest.fn();
	global.ResizeObserver = observerConstructor;
	const measure = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
	try {
		const { rerender, unmount } = render(<TestComponent />);
		rerender(<TestComponent label="Updated" />);
		expect(observerConstructor).not.toHaveBeenCalled();
		expect(measure).toHaveBeenCalled();
		unmount();
	} finally {
		global.ResizeObserver = originalObserver;
		measure.mockRestore();
	}
});
