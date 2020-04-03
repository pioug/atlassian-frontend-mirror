import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import {
  createMouseEvent,
  createTouchEvent,
} from '@atlaskit/media-test-helpers';

import {
  ImagePlacerContainer,
  ImagePlacerContainerProps,
} from '../../image-placer/container';
import { ContainerWrapper } from '../../image-placer/styled';

interface SetupInfo {
  wrapper: ShallowWrapper;
  instance: ImagePlacerContainer;
  onDragStart: () => void;
  onDragMove: () => void;
  onWheel: () => void;
}

const setup = (props: Partial<ImagePlacerContainerProps> = {}): SetupInfo => {
  const onDragStart = jest.fn();
  const onDragMove = jest.fn();
  const onWheel = jest.fn();

  let wrapper = shallow(
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

  const instance = wrapper.instance() as ImagePlacerContainer;
  return { wrapper, instance, onDragStart, onDragMove, onWheel };
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

const mouseLeftEvent: Partial<MouseEvent> = {
  button: 1,
  clientX: 1,
  clientY: 2,
};
const mouseRightEvent: Partial<MouseEvent> = { button: 2 };
const touchStartEvent = { touches: [{ clientX: 1, clientY: 2 }] };
const touchMoveEvent = { touches: [{ clientX: 2, clientY: 3 } as Touch] };

describe('Image Placer Container', () => {
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
        const { instance } = setup();

        expect(instance.isTouch).toEqual(true);
        expect(addEventListener).toHaveBeenCalledWith(
          'touchmove',
          instance.onTouchMove,
        );
        expect(addEventListener).toHaveBeenCalledWith(
          'touchend',
          instance.onMouseUp,
        );
        expect(addEventListener).toHaveBeenCalledWith(
          'touchcancel',
          instance.onMouseUp,
        );
      });

      it('should listen to mouse events when touch not present', () => {
        setIsTouch(false);
        const { instance } = setup();

        expect(instance.isTouch).toEqual(false);
        expect(addEventListener).toHaveBeenCalledWith(
          'mousemove',
          instance.onMouseMove,
        );
        expect(addEventListener).toHaveBeenCalledWith(
          'mouseup',
          instance.onMouseUp,
        );
      });

      it('should call onDragStart prop when mousedown event', () => {
        setIsTouch(false);
        const { wrapper, onDragStart } = setup();

        wrapper.simulate('mousedown', mouseLeftEvent);
        expect(onDragStart).toHaveBeenCalled();
      });

      it('should not call onDragStart prop when right-mousedown event', () => {
        setIsTouch(false);
        const { wrapper, onDragStart } = setup();

        wrapper.simulate('mousedown', mouseRightEvent);
        expect(onDragStart).not.toHaveBeenCalled();
      });

      it('should call onDragStart prop when touchstart event', () => {
        setIsTouch(true);
        const { wrapper, onDragStart } = setup();

        wrapper.simulate('touchstart', touchStartEvent);
        expect(onDragStart).toHaveBeenCalled();
      });
    });

    it('should call onDragMove prop when mousemove event', () => {
      setIsTouch(false);
      const { wrapper, onDragMove } = setup();

      wrapper.simulate('mousedown', mouseLeftEvent);
      document.dispatchEvent(
        createMouseEvent('mousemove', { clientX: 2, clientY: 3 }),
      );
      expect(onDragMove).toHaveBeenCalledWith({ x: 1, y: 1 });
    });

    it('should call onDragMove prop when touchmove event', () => {
      setIsTouch(true);
      const { wrapper, onDragMove } = setup();

      wrapper.simulate('touchstart', touchStartEvent);
      document.dispatchEvent(createTouchEvent('touchmove', touchMoveEvent));
      expect(onDragMove).toHaveBeenCalledWith({ x: 1, y: 1 });
    });

    it('should clear dragClientStart when touchend event', () => {
      setIsTouch(true);
      const { wrapper, instance } = setup();

      wrapper.simulate('touchstart', touchStartEvent);
      document.dispatchEvent(createTouchEvent('touchmove', touchMoveEvent));
      document.dispatchEvent(createTouchEvent('touchend'));
      expect(instance.isDragging).toBeFalsy();
    });

    it('should clear dragClientStart when mouseup event', () => {
      setIsTouch(false);
      const { wrapper, instance } = setup();

      wrapper.simulate('mousedown', mouseLeftEvent);
      document.dispatchEvent(createTouchEvent('touchmove'));
      document.dispatchEvent(createTouchEvent('mouseup'));
      expect(instance.isDragging).toBeFalsy();
    });

    it('should call onWheel prop when wheel event', () => {
      setIsTouch(false);
      const { onWheel, instance } = setup();
      instance.onWheel({ deltaY: 1 } as React.WheelEvent<HTMLDivElement>);
      expect(onWheel).toHaveBeenCalledWith(1);
    });
  });

  describe('Rendering', () => {
    it('should apply correct events when touch present', () => {
      setIsTouch(true);
      const { wrapper, instance } = setup();
      const containerWrapper = wrapper.find(ContainerWrapper).get(0);
      const { onMouseDown, onTouchStart } = containerWrapper.props;
      expect(onMouseDown).toBeUndefined();
      expect(onTouchStart).toEqual(instance.onTouchStart);
    });

    it('should apply correct events when mouse present', () => {
      setIsTouch(false);
      const { wrapper, instance } = setup();
      const containerWrapper = wrapper.find(ContainerWrapper).get(0);
      const { onMouseDown, onTouchStart } = containerWrapper.props;
      expect(onMouseDown).toEqual(instance.onMouseDown);
      expect(onTouchStart).toBeUndefined();
    });

    it('should listen to wrapper wheel event', () => {
      const { wrapper, instance } = setup();
      const containerWrapper = wrapper.find(ContainerWrapper).get(0);
      const { onWheel } = containerWrapper.props;
      expect(onWheel).toEqual(instance.onWheel);
    });
  });
});
