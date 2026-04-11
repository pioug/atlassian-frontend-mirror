import React, { forwardRef } from 'react';

import { render, screen } from '@testing-library/react';
import replaceRaf from 'raf-stub';

import { token } from '@atlaskit/tokens';

import { useResizingWidth } from '../../../resizing/width';
import { isReducedMotion } from '../../../utils/accessibility';

jest.mock('../../../utils/accessibility');

replaceRaf();
const raf = window.requestAnimationFrame as any;

const Container: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<{ id: string; width: number }> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, { id: string; width: number }>(({ id, width, ...props }, ref) => {
	const getBoundingClientRect = () => ({ width });

	return (
		<div
			ref={(element) => {
				const newRef: HTMLDivElement | null = element
					? Object.assign(element, { getBoundingClientRect })
					: null;

				if (typeof ref === 'function') {
					ref(newRef);
				} else {
					Object.assign(ref || {}, { current: newRef });
				}
			}}
			{...props}
			data-testid={id}
		/>
	);
});

const TestComponent = (props: { width: number; onFinishMotion?: () => void }) => (
	<Container
		{...useResizingWidth({
			duration: token('motion.duration.medium'),
			easing: token('motion.easing.inout.bold'),
			onFinishMotion: props.onFinishMotion,
		})}
		width={props.width}
		id="element"
	/>
);

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<ResizingWidth />', () => {
	beforeEach(() => {
		(isReducedMotion as jest.Mock).mockReturnValue(false);
	});

	it('should do nothing if width did not change over an update', () => {
		render(<TestComponent width={100} />);

		expect(screen.getByTestId('element')).not.toHaveAttribute('style');
	});

	it('should do nothing if user has turned on reduced motion', () => {
		(isReducedMotion as jest.Mock).mockReturnValue(true);
		const { rerender } = render(<TestComponent width={100} />);

		rerender(<TestComponent width={500} />);

		expect(screen.getByTestId('element')).not.toHaveAttribute('style');
	});

	it('should begin the animation from the before width', () => {
		const { rerender } = render(<TestComponent width={100} />);

		rerender(<TestComponent width={500} />);

		expect(screen.getByTestId('element').style).toMatchObject({
			width: '100px',
		});
	});

	it('should prepare to animate between widths', () => {
		const { rerender } = render(<TestComponent width={100} />);

		rerender(<TestComponent width={500} />);

		expect(screen.getByTestId('element').style).toMatchObject({
			'will-change': 'width',
			'transition-property': 'width',
			'transition-duration': 'var(--ds-duration-medium)',
			'transition-timing-function': 'var(--ds-easing-inout-bold)',
		});
	});

	it('should set box sizing when prepping the animation to ensure the width is the same after the animation ends', () => {
		const { rerender } = render(<TestComponent width={100} />);

		rerender(<TestComponent width={500} />);

		expect(screen.getByTestId('element').style).toMatchObject({
			'box-sizing': 'border-box',
		});
	});

	it('should set the new width after two frames so the DOM can flush changes', () => {
		const { rerender } = render(<TestComponent width={100} />);
		rerender(<TestComponent width={500} />);

		// Two ticks to start the motion.
		raf.step();
		raf.step();

		expect(screen.getByTestId('element').style).toMatchObject({
			width: '500px',
		});
	});

	it('should clear the width styling from the element after the animation has finished', () => {
		jest.useFakeTimers({ doNotFake: ['requestAnimationFrame', 'cancelAnimationFrame'] });
		const { rerender } = render(<TestComponent width={100} />);
		rerender(<TestComponent width={500} />);

		// Two ticks to start the motion.
		raf.step();
		raf.step();
		// Run the timeout to cleanup the motion.
		jest.runOnlyPendingTimers();
		jest.useRealTimers();

		expect(screen.getByTestId('element').style).not.toMatchObject({
			width: '500px',
		});
	});

	it('should cleanup when unmounting and not throw an error', () => {
		jest.useFakeTimers();
		const { rerender, unmount } = render(<TestComponent width={100} />);
		rerender(<TestComponent width={500} />);
		// Two ticks to start the motion.
		raf.step();
		raf.step();

		unmount();

		expect(() => {
			// Two ticks to start the motion.
			raf.step();
			raf.step();
			// Run the timeout so we cleanup the motion.
			jest.runOnlyPendingTimers();
			jest.useRealTimers();
		}).not.toThrow();
	});

	it('should call onFinishMotion after the animation completes', () => {
		jest.useFakeTimers();
		const onFinishMotion = jest.fn();
		const { rerender } = render(<TestComponent width={100} onFinishMotion={onFinishMotion} />);

		rerender(<TestComponent width={500} onFinishMotion={onFinishMotion} />);

		expect(onFinishMotion).not.toHaveBeenCalled();

		jest.advanceTimersByTime(200);

		expect(onFinishMotion).toHaveBeenCalledTimes(1);

		jest.useRealTimers();
	});

	it('should not call onFinishMotion when reduced motion is enabled', () => {
		(isReducedMotion as jest.Mock).mockReturnValue(true);
		const onFinishMotion = jest.fn();
		const { rerender } = render(<TestComponent width={100} onFinishMotion={onFinishMotion} />);

		rerender(<TestComponent width={500} onFinishMotion={onFinishMotion} />);

		expect(onFinishMotion).not.toHaveBeenCalled();
	});
});
