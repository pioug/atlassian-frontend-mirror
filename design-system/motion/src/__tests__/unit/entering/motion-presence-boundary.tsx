import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import ExitingPersistence, { ExitingContext } from '../../../entering/exiting-persistence';
import MotionPresenceBoundary from '../../../entering/motion-presence-boundary';
import { Reanimate } from '../../../entering/reanimate';
import { useExitingPersistence } from '../../../entering/use-exiting-persistence';
import { useMotion, type UseMotionProps } from '../../../entering/use-motion';
import { isReducedMotion } from '../../../utils/is-reduced-motion';

jest.mock('../../../utils/is-reduced-motion');

function PresenceProbe({ id }: { id: string }) {
	const { appear, isExiting, isInsideExitingPersistence, onFinish } = useExitingPersistence();
	return (
		<button
			data-testid={id}
			data-appear={appear}
			data-exiting={isExiting}
			data-inside-presence={isInsideExitingPersistence}
			onClick={onFinish}
		>
			Complete {id}
		</button>
	);
}

function IndependentMotion(props: UseMotionProps) {
	const { ref, state, reanimate } = useMotion<HTMLButtonElement>(props);
	return (
		<button
			ref={ref}
			data-testid="motion"
			data-state={state}
			onClick={() => reanimate(Reanimate.exit_then_enter)}
		>
			Replay
		</button>
	);
}

describe('MotionPresenceBoundary', () => {
	afterEach(() => {
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	it('restores standalone presence without adding DOM or inheriting exit completion', () => {
		passGate('platform-dst-motion-isolate-presence');
		const onFinish = jest.fn();
		const { container } = render(
			<ExitingContext.Provider
				value={{ appear: true, isExiting: true, isInsideExitingPersistence: true, onFinish }}
			>
				<MotionPresenceBoundary>
					<PresenceProbe id="content" />
				</MotionPresenceBoundary>
			</ExitingContext.Provider>,
		);
		const content = screen.getByTestId('content');
		expect(container.firstChild).toBe(content);
		expect(content).toHaveAttribute('data-appear', 'true');
		expect(content).toHaveAttribute('data-inside-presence', 'false');
		expect(content).toHaveAttribute('data-exiting', 'false');
		act(() => content.click());
		expect(onFinish).not.toHaveBeenCalled();
	});

	it('preserves inherited presence when the rollout gate is off', () => {
		failGate('platform-dst-motion-isolate-presence');
		const onFinish = jest.fn();
		render(
			<ExitingContext.Provider
				value={{ appear: true, isExiting: true, isInsideExitingPersistence: true, onFinish }}
			>
				<MotionPresenceBoundary>
					<PresenceProbe id="content" />
				</MotionPresenceBoundary>
			</ExitingContext.Provider>,
		);
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('data-appear', 'true');
		expect(content).toHaveAttribute('data-exiting', 'true');
		act(() => content.click());
		expect(onFinish).toHaveBeenCalledTimes(1);
	});

	it('keeps container exit ownership while nested collections manage their own items', () => {
		passGate('platform-dst-motion-isolate-presence');
		const tree = (open: boolean, items: string[]) => (
			<ExitingPersistence appear>
				{open && (
					<section key="container">
						<PresenceProbe id="container" />
						<MotionPresenceBoundary>
							<PresenceProbe id="static-tag" />
							<ExitingPersistence>
								{items.map((id) => (
									<PresenceProbe key={id} id={id} />
								))}
							</ExitingPersistence>
						</MotionPresenceBoundary>
					</section>
				)}
			</ExitingPersistence>
		);
		const { rerender } = render(tree(false, []));
		rerender(tree(true, []));
		expect(screen.getByTestId('container')).toHaveAttribute('data-appear', 'true');
		expect(screen.getByTestId('static-tag')).toHaveAttribute('data-inside-presence', 'false');
		rerender(tree(true, ['added-tag']));
		expect(screen.getByTestId('added-tag')).toHaveAttribute('data-appear', 'true');
		rerender(tree(true, []));
		expect(screen.getByTestId('added-tag')).toHaveAttribute('data-exiting', 'true');
		act(() => screen.getByTestId('added-tag').click());
		expect(screen.queryByTestId('added-tag')).not.toBeInTheDocument();
		rerender(tree(false, []));
		expect(screen.getByTestId('container')).toHaveAttribute('data-exiting', 'true');
		expect(screen.getByTestId('static-tag')).toHaveAttribute('data-exiting', 'false');
		act(() => screen.getByTestId('static-tag').click());
		expect(screen.getByTestId('container')).toBeInTheDocument();
		act(() => screen.getByTestId('container').click());
		expect(screen.queryByTestId('container')).not.toBeInTheDocument();
	});

	it.each([false, true])(
		'preserves independent entry and exit-then-enter completion (reduced motion: %s)',
		(reducedMotion) => {
			passGate('platform-dst-motion-isolate-presence');
			jest.useFakeTimers();
			jest.mocked(isReducedMotion).mockReturnValue(reducedMotion);
			const style = new CSSStyleDeclaration();
			style.animationName = 'test-motion';
			style.animationDuration = '0.1s';
			style.animationDelay = '0s';
			jest.spyOn(window, 'getComputedStyle').mockReturnValue(style);
			const onStart = jest.fn();
			const onFinish = jest.fn();
			const onContainerFinish = jest.fn();
			render(
				<ExitingContext.Provider
					value={{
						appear: false,
						isExiting: true,
						isInsideExitingPersistence: true,
						onFinish: onContainerFinish,
					}}
				>
					<MotionPresenceBoundary>
						<IndependentMotion onStart={onStart} onFinish={onFinish} />
					</MotionPresenceBoundary>
				</ExitingContext.Provider>,
			);
			const motion = screen.getByTestId('motion');
			expect(onStart).toHaveBeenCalledWith('entering');
			if (!reducedMotion) {
				expect(motion).toHaveAttribute('data-state', 'entering');
				expect(onFinish).not.toHaveBeenCalled();
				act(() => jest.advanceTimersByTime(100));
			}
			expect(motion).toHaveAttribute('data-state', 'visible');
			expect(onFinish.mock.calls).toEqual([['entering']]);
			act(() => motion.click());
			if (!reducedMotion) {
				expect(motion).toHaveAttribute('data-state', 'exiting');
				act(() => jest.advanceTimersByTime(100));
				expect(motion).toHaveAttribute('data-state', 'entering');
				act(() => jest.advanceTimersByTime(100));
			}
			expect(motion).toHaveAttribute('data-state', 'visible');
			expect(onStart.mock.calls).toEqual([['entering'], ['exiting'], ['entering']]);
			expect(onFinish.mock.calls).toEqual([['entering'], ['exiting'], ['entering']]);
			expect(onContainerFinish).not.toHaveBeenCalled();
		},
	);
});
