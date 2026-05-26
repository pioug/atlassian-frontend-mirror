import React from 'react';
import { render, fireEvent } from '@atlassian/testing-library';
import { createMouseEvent, createTouchEvent } from '@atlaskit/media-test-helpers';

import { ImagePlacerContainer, type ImagePlacerContainerProps } from '../../image-placer/container';

const setup = (props: Partial<ImagePlacerContainerProps> = {}) => {
	const onDragStart = jest.fn();
	const onDragMove = jest.fn();
	const onWheel = jest.fn();

	const result = render(
		<ImagePlacerContainer
			width={1}
			height={2}
			margin={3}
			onDragStart={onDragStart}
			onDragMove={onDragMove}
			onWheel={onWheel}
			{...props}
		/>,
	);

	const container = result.container.querySelector('#container-wrapper') as HTMLElement;

	return { ...result, container: container, onDragStart, onDragMove, onWheel };
};

/* simulate whether touch is available in environment, container.tsx isTouch accessor checks window property */
const setIsTouch = (isTouch: boolean) => {
	const win = window as any;
	if (isTouch) {
		win.ontouchstart = true;
	} else {
		delete win.ontouchstart;
	}
};

const mouseLeftEvent = {
	button: 1,
	clientX: 1,
	clientY: 2,
};
const mouseRightEvent = { button: 2 };
const touchStartEvent = { touches: [{ clientX: 1, clientY: 2 }] };
const touchMoveEvent = { touches: [{ clientX: 2, clientY: 3 } as Touch] };

describe('Image Placer Container', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});

	describe('Events', () => {
		describe('Touch vs Mouse', () => {
			let addEventListener: jest.SpyInstance;
			beforeEach(() => {
				addEventListener = jest.spyOn(document, 'addEventListener');
			});

			afterEach(() => {
				addEventListener.mockRestore();
			});

			it('should listen to touch events when touch present', () => {
				setIsTouch(true);
				setup();

				expect(addEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function));
				expect(addEventListener).toHaveBeenCalledWith('touchend', expect.any(Function));
				expect(addEventListener).toHaveBeenCalledWith('touchcancel', expect.any(Function));
			});

			it('should listen to mouse events when touch not present', () => {
				setIsTouch(false);
				setup();

				expect(addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
				expect(addEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function));
			});

			it('should call onDragStart prop when mousedown event', () => {
				setIsTouch(false);
				const { container, onDragStart } = setup();

				fireEvent.mouseDown(container, mouseLeftEvent);
				expect(onDragStart).toHaveBeenCalled();
			});

			it('should not call onDragStart prop when right-mousedown event', () => {
				setIsTouch(false);
				const { container, onDragStart } = setup();

				fireEvent.mouseDown(container, mouseRightEvent);
				expect(onDragStart).not.toHaveBeenCalled();
			});

			it('should call onDragStart prop when touchstart event', () => {
				setIsTouch(true);
				const { container, onDragStart } = setup();

				fireEvent.touchStart(container, touchStartEvent);
				expect(onDragStart).toHaveBeenCalled();
			});
		});

		it('should call onDragMove prop when mousemove event', () => {
			setIsTouch(false);
			const { container, onDragMove } = setup();

			fireEvent.mouseDown(container, mouseLeftEvent);
			document.dispatchEvent(createMouseEvent('mousemove', { clientX: 2, clientY: 3 }));
			expect(onDragMove).toHaveBeenCalledWith({ x: 1, y: 1 });
		});

		it('should call onDragMove prop when touchmove event', () => {
			setIsTouch(true);
			const { container, onDragMove } = setup();

			fireEvent.touchStart(container, touchStartEvent);
			document.dispatchEvent(createTouchEvent('touchmove', touchMoveEvent));
			expect(onDragMove).toHaveBeenCalledWith({ x: 1, y: 1 });
		});

		it('should clear dragClientStart when touchend event', () => {
			setIsTouch(true);
			const { container, onDragMove } = setup();

			fireEvent.touchStart(container, touchStartEvent);
			document.dispatchEvent(createTouchEvent('touchmove', touchMoveEvent));
			document.dispatchEvent(createTouchEvent('touchend'));

			// After touchend, further touchmove should not trigger onDragMove again
			onDragMove.mockClear();
			document.dispatchEvent(createTouchEvent('touchmove', touchMoveEvent));
			expect(onDragMove).not.toHaveBeenCalled();
		});

		it('should clear dragClientStart when mouseup event', () => {
			setIsTouch(false);
			const { container, onDragMove } = setup();

			fireEvent.mouseDown(container, mouseLeftEvent);
			document.dispatchEvent(createTouchEvent('mouseup'));

			// After mouseup, further mousemove should not trigger onDragMove
			onDragMove.mockClear();
			document.dispatchEvent(createMouseEvent('mousemove', { clientX: 5, clientY: 5 }));
			expect(onDragMove).not.toHaveBeenCalled();
		});

		it('should call onWheel prop when wheel event', () => {
			setIsTouch(false);
			const { container, onWheel } = setup();
			fireEvent.wheel(container, { deltaY: 1 });
			expect(onWheel).toHaveBeenCalledWith(1);
		});
	});

	describe('Rendering', () => {
		it('should apply correct events when touch present', () => {
			setIsTouch(true);
			const { container, onDragStart } = setup();

			// When touch is present, mouseDown should not trigger onDragStart
			fireEvent.mouseDown(container, mouseLeftEvent);
			expect(onDragStart).not.toHaveBeenCalled();

			// But touchStart should
			fireEvent.touchStart(container, touchStartEvent);
			expect(onDragStart).toHaveBeenCalled();
		});

		it('should apply correct events when mouse present', () => {
			setIsTouch(false);
			const { container, onDragStart } = setup();

			// When mouse is present, touchStart should not trigger onDragStart
			fireEvent.touchStart(container, touchStartEvent);
			expect(onDragStart).not.toHaveBeenCalled();

			// But mouseDown should
			fireEvent.mouseDown(container, mouseLeftEvent);
			expect(onDragStart).toHaveBeenCalled();
		});

		it('should listen to wrapper wheel event', () => {
			const { container, onWheel } = setup();
			fireEvent.wheel(container, { deltaY: 5 });
			expect(onWheel).toHaveBeenCalledWith(5);
		});
	});
});
