import React, { createRef } from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { act, fireEvent, render } from '@atlassian/testing-library/testing-library/react';

import AiGenerativeTextAnimatedIcon from '../../../animated/ai-generative-text';
import SignatureAnimatedIcon from '../../../animated/signature';
import type { AnimatedIconRef } from '../../../types';
import AnimatedIconTrigger from '../../animated-icon-trigger';

// The animation styles live on the wrapper around the icon, which has no role or test id of its own.
// eslint-disable-next-line testing-library/no-node-access
const getWrapperClassName = () => screen.getByTestId('icon').parentElement!.className;

describe('AnimatedIconTrigger', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	describe('with an icon that plays once and resets the trigger', () => {
		const renderTrigger = () =>
			render(
				<AnimatedIconTrigger testId="trigger">
					<button type="button">First</button>
					<button type="button">Second</button>
					<AiGenerativeTextAnimatedIcon testId="icon" label="" />
				</AnimatedIconTrigger>,
			);

		it('does nothing without a trigger above it', () => {
			render(<AiGenerativeTextAnimatedIcon testId="icon" label="" />);
			const resting = getWrapperClassName();

			fireEvent.mouseEnter(screen.getByTestId('icon'));

			expect(getWrapperClassName()).toBe(resting);
		});

		it('resets the trigger when the motion completes, even while still hovered', () => {
			renderTrigger();
			const resting = getWrapperClassName();

			fireEvent.mouseEnter(screen.getByTestId('trigger'));
			expect(getWrapperClassName()).not.toBe(resting);

			act(() => {
				jest.advanceTimersByTime(399);
			});
			expect(getWrapperClassName()).not.toBe(resting);

			act(() => {
				jest.advanceTimersByTime(1);
			});
			expect(getWrapperClassName()).toBe(resting);
		});

		it('plays again after leaving and re-entering the trigger', () => {
			renderTrigger();
			const resting = getWrapperClassName();

			fireEvent.mouseEnter(screen.getByTestId('trigger'));
			act(() => {
				jest.advanceTimersByTime(400);
			});
			fireEvent.mouseLeave(screen.getByTestId('trigger'));
			fireEvent.mouseEnter(screen.getByTestId('trigger'));

			expect(getWrapperClassName()).not.toBe(resting);
		});

		it('removes the interaction styles immediately when the trigger is left early', () => {
			renderTrigger();
			const resting = getWrapperClassName();

			fireEvent.mouseEnter(screen.getByTestId('trigger'));
			expect(getWrapperClassName()).not.toBe(resting);

			fireEvent.mouseLeave(screen.getByTestId('trigger'));

			expect(getWrapperClassName()).toBe(resting);
			expect(jest.getTimerCount()).toBe(0);
		});

		it('is active while focus is inside the trigger', () => {
			renderTrigger();
			const resting = getWrapperClassName();

			act(() => screen.getByText('First').focus());
			expect(getWrapperClassName()).not.toBe(resting);

			act(() => screen.getByText('First').blur());
			expect(getWrapperClassName()).toBe(resting);
		});

		it('stays active when focus moves between children', () => {
			renderTrigger();
			const resting = getWrapperClassName();

			act(() => screen.getByText('First').focus());
			act(() => screen.getByText('Second').focus());

			expect(getWrapperClassName()).not.toBe(resting);
		});

		it('can still be driven by a controlled isActive without rendering a wrapper', () => {
			const { rerender } = render(
				<AnimatedIconTrigger isActive={false} testId="trigger">
					<AiGenerativeTextAnimatedIcon testId="icon" label="" />
				</AnimatedIconTrigger>,
			);
			const resting = getWrapperClassName();
			expect(screen.queryByTestId('trigger')).not.toBeInTheDocument();

			rerender(
				<AnimatedIconTrigger isActive testId="trigger">
					<AiGenerativeTextAnimatedIcon testId="icon" label="" />
				</AnimatedIconTrigger>,
			);

			expect(getWrapperClassName()).not.toBe(resting);
		});

		it('calls onReset in controlled mode when the motion completes', () => {
			const onReset = jest.fn();
			render(
				<AnimatedIconTrigger isActive onReset={onReset}>
					<AiGenerativeTextAnimatedIcon testId="icon" label="" />
				</AnimatedIconTrigger>,
			);
			expect(onReset).not.toHaveBeenCalled();

			act(() => {
				jest.advanceTimersByTime(400);
			});

			expect(onReset).toHaveBeenCalledTimes(1);
		});

		it('does not call onReset when the motion is interrupted', () => {
			const onReset = jest.fn();
			const { rerender } = render(
				<AnimatedIconTrigger isActive onReset={onReset}>
					<AiGenerativeTextAnimatedIcon testId="icon" label="" />
				</AnimatedIconTrigger>,
			);

			rerender(
				<AnimatedIconTrigger isActive={false} onReset={onReset}>
					<AiGenerativeTextAnimatedIcon testId="icon" label="" />
				</AnimatedIconTrigger>,
			);
			act(() => {
				jest.advanceTimersByTime(400);
			});

			expect(onReset).not.toHaveBeenCalled();
		});

		it('ignores repeated activation while the motion is already playing', () => {
			const onReset = jest.fn();
			const { rerender } = render(
				<AnimatedIconTrigger isActive onReset={onReset}>
					<AiGenerativeTextAnimatedIcon testId="icon" label="" />
				</AnimatedIconTrigger>,
			);

			// A consumer setting `isActive` to true again (for example on every click) changes nothing.
			for (let i = 0; i < 3; i++) {
				act(() => {
					jest.advanceTimersByTime(100);
				});
				rerender(
					<AnimatedIconTrigger isActive onReset={onReset}>
						<AiGenerativeTextAnimatedIcon testId="icon" label="" />
					</AnimatedIconTrigger>,
				);
			}
			expect(jest.getTimerCount()).toBe(1);

			act(() => {
				jest.advanceTimersByTime(100);
			});
			expect(onReset).toHaveBeenCalledTimes(1);
		});

		it('does not restart the motion when onReset changes identity', () => {
			const first = jest.fn();
			const second = jest.fn();
			const { rerender } = render(
				<AnimatedIconTrigger isActive onReset={first}>
					<AiGenerativeTextAnimatedIcon testId="icon" label="" />
				</AnimatedIconTrigger>,
			);

			act(() => {
				jest.advanceTimersByTime(300);
			});
			rerender(
				<AnimatedIconTrigger isActive onReset={second}>
					<AiGenerativeTextAnimatedIcon testId="icon" label="" />
				</AnimatedIconTrigger>,
			);
			act(() => {
				jest.advanceTimersByTime(100);
			});

			expect(first).not.toHaveBeenCalled();
			expect(second).toHaveBeenCalledTimes(1);
		});

		it('lets the nearest trigger win', () => {
			render(
				<AnimatedIconTrigger isActive>
					<AnimatedIconTrigger isActive={false}>
						<AiGenerativeTextAnimatedIcon testId="icon" label="" />
					</AnimatedIconTrigger>
				</AnimatedIconTrigger>,
			);
			const nested = getWrapperClassName();

			render(<AiGenerativeTextAnimatedIcon testId="icon-resting" label="" />);

			// eslint-disable-next-line testing-library/no-node-access
			expect(screen.getByTestId('icon-resting').parentElement!.className).toBe(nested);
		});
	});

	describe('trigger="click"', () => {
		const renderClickTrigger = () =>
			render(
				<AnimatedIconTrigger trigger="click" testId="trigger">
					<button type="button">Press</button>
					<AiGenerativeTextAnimatedIcon testId="icon" label="" />
				</AnimatedIconTrigger>,
			);

		it('ignores hover and focus', () => {
			renderClickTrigger();
			const resting = getWrapperClassName();

			fireEvent.mouseEnter(screen.getByTestId('trigger'));
			act(() => screen.getByText('Press').focus());

			expect(getWrapperClassName()).toBe(resting);
		});

		it('plays on click and resets when the motion completes', () => {
			renderClickTrigger();
			const resting = getWrapperClassName();

			fireEvent.click(screen.getByText('Press'));
			expect(getWrapperClassName()).not.toBe(resting);

			act(() => {
				jest.advanceTimersByTime(400);
			});
			expect(getWrapperClassName()).toBe(resting);
		});

		it('plays through to completion when the pointer leaves', () => {
			renderClickTrigger();
			const resting = getWrapperClassName();

			fireEvent.mouseEnter(screen.getByTestId('trigger'));
			fireEvent.click(screen.getByText('Press'));
			fireEvent.mouseLeave(screen.getByTestId('trigger'));
			expect(getWrapperClassName()).not.toBe(resting);

			act(() => {
				jest.advanceTimersByTime(400);
			});
			expect(getWrapperClassName()).toBe(resting);
		});

		it('plays again on the next click after completing', () => {
			renderClickTrigger();
			const resting = getWrapperClassName();

			fireEvent.click(screen.getByText('Press'));
			act(() => {
				jest.advanceTimersByTime(400);
			});
			fireEvent.click(screen.getByText('Press'));

			expect(getWrapperClassName()).not.toBe(resting);
		});
	});

	describe('with icons of different durations', () => {
		// `ai-generative-text` plays for 400ms and `signature` for 1400ms.
		// eslint-disable-next-line testing-library/no-node-access
		const getClassName = (testId: string) => screen.getByTestId(testId).parentElement!.className;

		const renderTrigger = () =>
			render(
				<AnimatedIconTrigger testId="trigger">
					<AiGenerativeTextAnimatedIcon testId="fast" label="" />
					<SignatureAnimatedIcon testId="slow" label="" />
				</AnimatedIconTrigger>,
			);

		const advance = (ms: number) =>
			act(() => {
				jest.advanceTimersByTime(ms);
			});

		it('keeps playing the slower icon after the faster one has finished', () => {
			renderTrigger();
			const restingFast = getClassName('fast');
			const restingSlow = getClassName('slow');

			fireEvent.mouseEnter(screen.getByTestId('trigger'));
			expect(getClassName('fast')).not.toBe(restingFast);
			expect(getClassName('slow')).not.toBe(restingSlow);

			advance(400);
			expect(getClassName('fast')).toBe(restingFast);
			expect(getClassName('slow')).not.toBe(restingSlow);

			// The last phase of `signature` has no styles of its own, so check its timer rather than its class.
			advance(999);
			expect(jest.getTimerCount()).toBe(1);

			advance(1);
			expect(getClassName('slow')).toBe(restingSlow);
			expect(jest.getTimerCount()).toBe(0);
		});

		it('calls onReset once, after the slowest icon finishes, in controlled mode', () => {
			const onReset = jest.fn();
			render(
				<AnimatedIconTrigger isActive onReset={onReset}>
					<AiGenerativeTextAnimatedIcon testId="fast" label="" />
					<SignatureAnimatedIcon testId="slow" label="" />
				</AnimatedIconTrigger>,
			);

			advance(400);
			expect(onReset).not.toHaveBeenCalled();

			advance(1000);
			expect(onReset).toHaveBeenCalledTimes(1);
		});

		it('cancels every icon when the trigger is left early', () => {
			renderTrigger();
			const restingFast = getClassName('fast');
			const restingSlow = getClassName('slow');

			fireEvent.mouseEnter(screen.getByTestId('trigger'));
			advance(200);
			fireEvent.mouseLeave(screen.getByTestId('trigger'));

			expect(getClassName('fast')).toBe(restingFast);
			expect(getClassName('slow')).toBe(restingSlow);
			expect(jest.getTimerCount()).toBe(0);
		});

		it('plays every icon through again after an interrupted activation', () => {
			renderTrigger();
			const restingSlow = getClassName('slow');

			fireEvent.mouseEnter(screen.getByTestId('trigger'));
			advance(200);
			fireEvent.mouseLeave(screen.getByTestId('trigger'));
			fireEvent.mouseEnter(screen.getByTestId('trigger'));

			advance(400);
			expect(getClassName('slow')).not.toBe(restingSlow);

			advance(1000);
			expect(getClassName('slow')).toBe(restingSlow);
			expect(jest.getTimerCount()).toBe(0);
		});

		it('clears once the slower icon is gone when it unmounts part way through', async () => {
			const { rerender } = render(
				<AnimatedIconTrigger testId="trigger">
					<AiGenerativeTextAnimatedIcon testId="fast" label="" />
					<SignatureAnimatedIcon testId="slow" label="" />
				</AnimatedIconTrigger>,
			);
			const restingFast = getClassName('fast');

			fireEvent.mouseEnter(screen.getByTestId('trigger'));
			rerender(
				<AnimatedIconTrigger testId="trigger">
					<AiGenerativeTextAnimatedIcon testId="fast" label="" />
				</AnimatedIconTrigger>,
			);
			// The unmounted icon tells the trigger it is done in a microtask, so let that run.
			await act(async () => {
				await Promise.resolve();
			});
			advance(400);

			expect(getClassName('fast')).toBe(restingFast);
			expect(jest.getTimerCount()).toBe(0);

			// The trigger cleared, so entering it again plays the remaining icon.
			fireEvent.mouseLeave(screen.getByTestId('trigger'));
			fireEvent.mouseEnter(screen.getByTestId('trigger'));
			expect(getClassName('fast')).not.toBe(restingFast);
		});
	});

	describe('in React Strict Mode', () => {
		it('does not call onReset before a motion has played when it mounts active', async () => {
			const onReset = jest.fn();
			render(
				<React.StrictMode>
					<AnimatedIconTrigger isActive onReset={onReset}>
						<AiGenerativeTextAnimatedIcon testId="icon" label="" />
					</AnimatedIconTrigger>
				</React.StrictMode>,
			);
			// Let the microtask that Strict Mode's simulated unmount schedules run.
			await act(async () => {
				await Promise.resolve();
			});
			expect(onReset).not.toHaveBeenCalled();

			act(() => {
				jest.advanceTimersByTime(400);
			});
			expect(onReset).toHaveBeenCalledTimes(1);
		});
	});

	describe('when a ref-driven motion is already playing', () => {
		it('still resets the trigger when that motion completes', () => {
			const ref = createRef<AnimatedIconRef>();
			const onReset = jest.fn();
			const { rerender } = render(
				<AnimatedIconTrigger isActive={false} onReset={onReset}>
					<AiGenerativeTextAnimatedIcon ref={ref} testId="icon" label="" />
				</AnimatedIconTrigger>,
			);

			act(() => ref.current?.reanimate());
			act(() => {
				jest.advanceTimersByTime(200);
			});
			rerender(
				<AnimatedIconTrigger isActive onReset={onReset}>
					<AiGenerativeTextAnimatedIcon ref={ref} testId="icon" label="" />
				</AnimatedIconTrigger>,
			);
			expect(jest.getTimerCount()).toBe(1);

			act(() => {
				jest.advanceTimersByTime(200);
			});
			expect(onReset).toHaveBeenCalledTimes(1);
		});
	});
});
