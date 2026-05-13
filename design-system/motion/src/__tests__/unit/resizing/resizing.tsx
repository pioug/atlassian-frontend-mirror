import React, { forwardRef } from 'react';

import replaceRaf from 'raf-stub';

import { token } from '@atlaskit/tokens';
import { render, screen } from '@atlassian/testing-library';

import { useResizing } from '../../../resizing/use-resizing';
import { isReducedMotion } from '../../../utils/is-reduced-motion';

type ResizingDimension = 'width' | 'height' | 'both';

jest.mock('../../../utils/is-reduced-motion');

replaceRaf();
const raf = window.requestAnimationFrame as any;

interface ContainerProps {
	id: string;
	width: number;
	height: number;
}

const Container: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ContainerProps> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, ContainerProps>(({ id, width, height, ...props }, ref) => {
	const getBoundingClientRect = () => ({ width, height });

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

const TestComponent = (props: {
	dimension: ResizingDimension;
	width: number;
	height: number;
	onFinishMotion?: () => void;
}) => (
	<Container
		{...useResizing({
			dimension: props.dimension,
			duration: token('motion.duration.medium'),
			easing: token('motion.easing.inout.bold'),
			onFinishMotion: props.onFinishMotion,
		})}
		width={props.width}
		height={props.height}
		id="element"
	/>
);

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('useResizing', () => {
	beforeEach(() => {
		(isReducedMotion as jest.Mock).mockReturnValue(false);
	});

	describe('dimension="width"', () => {
		it('should do nothing if width did not change over an update', () => {
			render(<TestComponent dimension="width" width={100} height={50} />);

			expect(screen.getByTestId('element')).not.toHaveAttribute('style');
		});

		it('should do nothing if user has turned on reduced motion', () => {
			(isReducedMotion as jest.Mock).mockReturnValue(true);
			const { rerender } = render(<TestComponent dimension="width" width={100} height={50} />);

			rerender(<TestComponent dimension="width" width={500} height={50} />);

			expect(screen.getByTestId('element')).not.toHaveAttribute('style');
		});

		it('should begin the animation from the before width', () => {
			const { rerender } = render(<TestComponent dimension="width" width={100} height={50} />);

			rerender(<TestComponent dimension="width" width={500} height={50} />);

			expect(screen.getByTestId('element').style).toMatchObject({
				width: '100px',
			});
		});

		it('should prepare to animate width with width-only transition properties', () => {
			const { rerender } = render(<TestComponent dimension="width" width={100} height={50} />);

			rerender(<TestComponent dimension="width" width={500} height={50} />);

			expect(screen.getByTestId('element').style).toMatchObject({
				'will-change': 'width',
				'transition-property': 'width',
				'transition-duration': 'var(--ds-duration-medium)',
				'transition-timing-function': 'var(--ds-easing-inout-bold)',
				'box-sizing': 'border-box',
			});
		});

		it('should not set height styles when only animating width', () => {
			const { rerender } = render(<TestComponent dimension="width" width={100} height={50} />);

			rerender(<TestComponent dimension="width" width={500} height={50} />);

			expect(screen.getByTestId('element')).not.toHaveStyle({ height: '50px' });
		});

		it('should set the new width after two frames so the DOM can flush changes', () => {
			const { rerender } = render(<TestComponent dimension="width" width={100} height={50} />);
			rerender(<TestComponent dimension="width" width={500} height={50} />);

			// Two ticks to start the motion.
			raf.step();
			raf.step();

			expect(screen.getByTestId('element').style).toMatchObject({
				width: '500px',
			});
		});

		it('should clear the styling from the element after the animation has finished', () => {
			jest.useFakeTimers({ doNotFake: ['requestAnimationFrame', 'cancelAnimationFrame'] });
			const { rerender } = render(<TestComponent dimension="width" width={100} height={50} />);
			rerender(<TestComponent dimension="width" width={500} height={50} />);

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

		it('should call onFinishMotion after the animation completes', () => {
			jest.useFakeTimers();
			const onFinishMotion = jest.fn();
			const { rerender } = render(
				<TestComponent dimension="width" width={100} height={50} onFinishMotion={onFinishMotion} />,
			);

			rerender(
				<TestComponent dimension="width" width={500} height={50} onFinishMotion={onFinishMotion} />,
			);

			expect(onFinishMotion).not.toHaveBeenCalled();

			jest.advanceTimersByTime(200);

			expect(onFinishMotion).toHaveBeenCalledTimes(1);

			jest.useRealTimers();
		});

		it('should not call onFinishMotion when reduced motion is enabled', () => {
			(isReducedMotion as jest.Mock).mockReturnValue(true);
			const onFinishMotion = jest.fn();
			const { rerender } = render(
				<TestComponent dimension="width" width={100} height={50} onFinishMotion={onFinishMotion} />,
			);

			rerender(
				<TestComponent dimension="width" width={500} height={50} onFinishMotion={onFinishMotion} />,
			);

			expect(onFinishMotion).not.toHaveBeenCalled();
		});

		it('should call onFinishMotion immediately if width did not change', () => {
			const onFinishMotion = jest.fn();
			const { rerender } = render(
				<TestComponent dimension="width" width={100} height={50} onFinishMotion={onFinishMotion} />,
			);

			rerender(
				<TestComponent
					dimension="width"
					width={100}
					height={500}
					onFinishMotion={onFinishMotion}
				/>,
			);

			// Width didn't change, even though height did - should short-circuit.
			expect(onFinishMotion).toHaveBeenCalledTimes(1);
		});

		it('should cleanup when unmounting and not throw an error', () => {
			jest.useFakeTimers();
			const { rerender, unmount } = render(
				<TestComponent dimension="width" width={100} height={50} />,
			);
			rerender(<TestComponent dimension="width" width={500} height={50} />);
			// Two ticks to start the motion.
			raf.step();
			raf.step();

			unmount();

			expect(() => {
				raf.step();
				raf.step();
				jest.runOnlyPendingTimers();
				jest.useRealTimers();
			}).not.toThrow();
		});
	});

	describe('dimension="height"', () => {
		it('should do nothing if height did not change over an update', () => {
			render(<TestComponent dimension="height" width={100} height={50} />);

			expect(screen.getByTestId('element')).not.toHaveAttribute('style');
		});

		it('should begin the animation from the before height', () => {
			const { rerender } = render(<TestComponent dimension="height" width={100} height={50} />);

			rerender(<TestComponent dimension="height" width={100} height={200} />);

			expect(screen.getByTestId('element').style).toMatchObject({
				height: '50px',
			});
		});

		it('should prepare to animate height with height-only transition properties', () => {
			const { rerender } = render(<TestComponent dimension="height" width={100} height={50} />);

			rerender(<TestComponent dimension="height" width={100} height={200} />);

			expect(screen.getByTestId('element').style).toMatchObject({
				'will-change': 'height',
				'transition-property': 'height',
				'box-sizing': 'border-box',
			});
		});

		it('should not set width styles when only animating height', () => {
			const { rerender } = render(<TestComponent dimension="height" width={100} height={50} />);

			rerender(<TestComponent dimension="height" width={100} height={200} />);

			expect(screen.getByTestId('element')).not.toHaveStyle({ width: '100px' });
		});

		it('should set the new height after two frames so the DOM can flush changes', () => {
			const { rerender } = render(<TestComponent dimension="height" width={100} height={50} />);
			rerender(<TestComponent dimension="height" width={100} height={200} />);

			raf.step();
			raf.step();

			expect(screen.getByTestId('element').style).toMatchObject({
				height: '200px',
			});
		});

		it('should call onFinishMotion immediately if height did not change', () => {
			const onFinishMotion = jest.fn();
			const { rerender } = render(
				<TestComponent
					dimension="height"
					width={100}
					height={50}
					onFinishMotion={onFinishMotion}
				/>,
			);

			rerender(
				<TestComponent
					dimension="height"
					width={500}
					height={50}
					onFinishMotion={onFinishMotion}
				/>,
			);

			// Height didn't change, even though width did - should short-circuit.
			expect(onFinishMotion).toHaveBeenCalledTimes(1);
		});
	});

	describe('dimension="both"', () => {
		it('should do nothing on initial mount', () => {
			render(<TestComponent dimension="both" width={100} height={50} />);

			expect(screen.getByTestId('element')).not.toHaveAttribute('style');
		});

		it('should animate when only width changes', () => {
			const { rerender } = render(<TestComponent dimension="both" width={100} height={50} />);

			rerender(<TestComponent dimension="both" width={500} height={50} />);

			expect(screen.getByTestId('element').style).toMatchObject({
				width: '100px',
				height: '50px',
				'will-change': 'width, height',
				'transition-property': 'width, height',
			});
		});

		it('should animate when only height changes', () => {
			const { rerender } = render(<TestComponent dimension="both" width={100} height={50} />);

			rerender(<TestComponent dimension="both" width={100} height={200} />);

			expect(screen.getByTestId('element').style).toMatchObject({
				width: '100px',
				height: '50px',
				'will-change': 'width, height',
				'transition-property': 'width, height',
			});
		});

		it('should begin the animation from the before width and height', () => {
			const { rerender } = render(<TestComponent dimension="both" width={100} height={50} />);

			rerender(<TestComponent dimension="both" width={500} height={200} />);

			expect(screen.getByTestId('element').style).toMatchObject({
				width: '100px',
				height: '50px',
			});
		});

		it('should set the new width and height after two frames so the DOM can flush changes', () => {
			const { rerender } = render(<TestComponent dimension="both" width={100} height={50} />);
			rerender(<TestComponent dimension="both" width={500} height={200} />);

			raf.step();
			raf.step();

			expect(screen.getByTestId('element').style).toMatchObject({
				width: '500px',
				height: '200px',
			});
		});

		it('should call onFinishMotion immediately if neither dimension changed', () => {
			const onFinishMotion = jest.fn();
			const { rerender } = render(
				<TestComponent dimension="both" width={100} height={50} onFinishMotion={onFinishMotion} />,
			);

			rerender(
				<TestComponent dimension="both" width={100} height={50} onFinishMotion={onFinishMotion} />,
			);

			expect(onFinishMotion).toHaveBeenCalledTimes(1);
		});
	});
});
