import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import {
  resizerHandleClassName,
  resizerHandleLeftClassName,
  resizerHandleRightClassName,
  resizerItemClassName,
} from '../../../styles/shared/resizer';
import { ResizerNext } from '../../index';
import { HandleResize } from '../../types';

describe('Resizer', () => {
  let initialWidth: number;
  let customHandleClassName: string;
  let customHandleLeftClassName: string;
  let customHandleRightClassName: string;
  let customResizableClassName: string;

  let mockHandleResizeStart: () => void;
  let mockHandleResize: HandleResize;
  let mockHandleResizeStop: HandleResize;

  beforeEach(() => {
    initialWidth = 50;
    customHandleClassName = 'test-handle';
    customHandleLeftClassName = `${customHandleClassName}-left`;
    customHandleRightClassName = `${customHandleClassName}-right`;
    customResizableClassName = 'test-resizable-item';

    mockHandleResizeStart = jest.fn(() => 60);
    mockHandleResize = jest.fn((originalState, delta) => {
      return originalState.width + delta.width + 15;
    });
    mockHandleResizeStop = jest.fn((originalState, delta) => {
      return originalState.width + delta.width + 30;
    });
  });

  it('should not call life cycle methods when no resizing happens', () => {
    render(
      <ResizerNext
        enable={{ left: true, right: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    expect(mockHandleResizeStart).not.toHaveBeenCalled();
    expect(mockHandleResize).not.toHaveBeenCalled();
    expect(mockHandleResizeStop).not.toHaveBeenCalled();
  });

  it('should call life cycle methods on resizing', async () => {
    const { container } = render(
      <ResizerNext
        enable={{ left: true, right: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    const handleRight = container.querySelector(
      `.${resizerHandleLeftClassName}`,
    );
    const resizable = container.querySelector(`.${resizerItemClassName}`);

    if (handleRight && resizable) {
      fireEvent.mouseDown(handleRight, { clientX: 99 });
      expect(mockHandleResizeStart).toHaveBeenCalledTimes(1);

      fireEvent.mouseMove(handleRight, { clientX: 120 });
      fireEvent.mouseMove(handleRight, { clientX: 130 });
      expect(mockHandleResize).toHaveBeenCalledTimes(2);

      fireEvent.mouseUp(handleRight, { clientX: 150 });
      expect(mockHandleResizeStop).toHaveBeenCalledTimes(1);
    }
  });

  it('should create only right handle when enabled', () => {
    const { container } = render(
      <ResizerNext
        enable={{ right: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );
    expect(
      container.querySelector(`.${resizerHandleLeftClassName}`),
    ).toBeNull();
    expect(
      container.querySelector(`.${resizerHandleRightClassName}`),
    ).toBeInTheDocument();
  });

  it('should correct add and remove class name for resizing', async () => {
    const { container } = render(
      <ResizerNext
        enable={{ left: true, right: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    const handleRight = container.querySelector(
      `.${resizerHandleLeftClassName}`,
    );
    const resizable = container.querySelector(`.${resizerItemClassName}`);

    if (handleRight && resizable) {
      fireEvent.mouseDown(handleRight, { clientX: 99 });
      expect(resizable).toHaveClass('is-resizing');

      fireEvent.mouseUp(handleRight, { clientX: 150 });
      expect(resizable).not.toHaveClass('is-resizing');
    }
  });

  it('should create left and right handles when both are enabled', () => {
    const { container } = render(
      <ResizerNext
        enable={{ right: true, left: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );
    expect(
      container.querySelector(`.${resizerHandleLeftClassName}`),
    ).toBeInTheDocument();
    expect(
      container.querySelector(`.${resizerHandleRightClassName}`),
    ).toBeInTheDocument();
  });

  it('should set custom classes on the resize handlers', () => {
    const { container } = render(
      <ResizerNext
        enable={{ right: true, left: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        className={customResizableClassName}
        handleClassName={customHandleClassName}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    expect(
      container.querySelector(`.${customHandleLeftClassName}`),
    ).toBeInTheDocument();
    expect(
      container.querySelector(`.${customHandleRightClassName}`),
    ).toBeInTheDocument();

    expect(
      container.querySelector(`.${resizerHandleLeftClassName}`),
    ).toBeNull();
    expect(
      container.querySelector(`.${resizerHandleRightClassName}`),
    ).toBeNull();
  });

  it('should set custom class on the resize item in addition to the generic class', () => {
    const { container } = render(
      <ResizerNext
        enable={{ right: true, left: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        className={customResizableClassName}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    const resizableItem = container.querySelector(
      `.${customResizableClassName}`,
    );
    expect(resizableItem).toBeInTheDocument();
    expect(
      resizableItem?.classList.contains(resizerItemClassName),
    ).toBeTruthy();
  });

  it('should position handles based on provided innerPadding value', () => {
    const customInnerPadding = 45;

    const { container } = render(
      <ResizerNext
        enable={{ right: true, left: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        innerPadding={customInnerPadding}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    const leftHandle = container.querySelector(
      `.${resizerHandleLeftClassName}`,
    );
    const rightHandle = container.querySelector(
      `.${resizerHandleRightClassName}`,
    );

    expect(leftHandle?.getAttribute('style')).toContain(
      `left: -${customInnerPadding}px;`,
    );
    expect(rightHandle?.getAttribute('style')).toContain(
      `right: -${customInnerPadding}px;`,
    );
  });

  it('should have both handler class name default as "medium"', () => {
    const { container } = render(
      <ResizerNext
        enable={{ right: true, left: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        className={customResizableClassName}
        handleClassName={customHandleClassName}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );
    expect(
      container.querySelector(`.${resizerHandleClassName.medium}`),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll(`.${resizerHandleClassName.medium}`).length,
    ).toBe(2);
  });

  it('should have both handler class name "large"', () => {
    const { container } = render(
      <ResizerNext
        enable={{ right: true, left: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        handleHeightSize={'large'}
        className={customResizableClassName}
        handleClassName={customHandleClassName}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );
    expect(
      container.querySelector(`.${resizerHandleClassName.large}`),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll(`.${resizerHandleClassName.large}`).length,
    ).toBe(2);
  });

  it('should have one handler class name "small" ', () => {
    const { container } = render(
      <ResizerNext
        enable={{ right: true, left: false }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        handleHeightSize={'small'}
        className={customResizableClassName}
        handleClassName={customHandleClassName}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );
    expect(
      container.querySelector(`.${resizerHandleClassName.small}`),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll(`.${resizerHandleClassName.small}`).length,
    ).toBe(1);
  });

  it('should only resize to snap points when default snapGap is defined', () => {
    const mockHandleResizeMockWithSnapping = jest.fn();
    const { container } = render(
      <ResizerNext
        enable={{ left: true, right: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResizeMockWithSnapping}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        snap={{ x: [100, 200] }}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    const handleRight = container.querySelector(
      `.${resizerHandleRightClassName}`,
    );
    const resizable = container.querySelector(`.${resizerItemClassName}`);

    if (handleRight && resizable) {
      fireEvent.mouseDown(handleRight, { clientX: 0 });
      expect(mockHandleResizeStart).toHaveBeenCalledTimes(1);

      fireEvent.mouseMove(handleRight, { clientX: 50 });
      fireEvent.mouseMove(handleRight, { clientX: 100 });
      expect(mockHandleResizeMockWithSnapping).toHaveBeenCalledTimes(2);
      expect(mockHandleResizeMockWithSnapping).toHaveBeenNthCalledWith(
        1,
        expect.any(Object),
        { width: 100, height: 10 },
      );
      expect(mockHandleResizeMockWithSnapping).toHaveBeenNthCalledWith(
        2,
        expect.any(Object),
        { width: 100, height: 10 },
      );
    }
  });

  it('should only resize to snap points when it is within the threshold defined by snapGap', () => {
    const mockHandleResizeMockWithSnapping = jest.fn();
    const { container } = render(
      <ResizerNext
        enable={{ left: true, right: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResizeMockWithSnapping}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        snap={{ x: [100, 200] }}
        snapGap={5}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    const handleRight = container.querySelector(
      `.${resizerHandleRightClassName}`,
    );
    const resizable = container.querySelector(`.${resizerItemClassName}`);

    if (handleRight && resizable) {
      fireEvent.mouseDown(handleRight, { clientX: 0 });
      expect(mockHandleResizeStart).toHaveBeenCalledTimes(1);

      fireEvent.mouseMove(handleRight, { clientX: 94 });
      fireEvent.mouseMove(handleRight, { clientX: 96 });
      expect(mockHandleResizeMockWithSnapping).toHaveBeenCalledTimes(2);
      expect(mockHandleResizeMockWithSnapping).toHaveBeenNthCalledWith(
        1,
        expect.any(Object),
        { width: 94, height: 10 },
      );
      expect(mockHandleResizeMockWithSnapping).toHaveBeenNthCalledWith(
        2,
        expect.any(Object),
        { width: 100, height: 10 },
      );
    }
  });
  it('should not restrict resizing when snap gap is defined, but there are not snap points on x', () => {
    const mockHandleResizeMockWithSnapping = jest.fn();
    const { container } = render(
      <ResizerNext
        enable={{ left: true, right: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResizeMockWithSnapping}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        snap={{ x: [] }}
        snapGap={5}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    const handleRight = container.querySelector(
      `.${resizerHandleRightClassName}`,
    );
    const resizable = container.querySelector(`.${resizerItemClassName}`);

    if (handleRight && resizable) {
      fireEvent.mouseDown(handleRight, { clientX: 0 });
      expect(mockHandleResizeStart).toHaveBeenCalledTimes(1);

      fireEvent.mouseMove(handleRight, { clientX: 94 });
      fireEvent.mouseMove(handleRight, { clientX: 96 });
      expect(mockHandleResizeMockWithSnapping).toHaveBeenCalledTimes(2);
      expect(mockHandleResizeMockWithSnapping).toHaveBeenNthCalledWith(
        1,
        expect.any(Object),
        { width: 94, height: 10 },
      );
      expect(mockHandleResizeMockWithSnapping).toHaveBeenNthCalledWith(
        2,
        expect.any(Object),
        { width: 96, height: 10 },
      );
    }
  });
  it('should not restrict resizing when snap gap is defined, but there are not snap points on y', () => {
    const mockHandleResizeMockWithSnapping = jest.fn();
    const { container } = render(
      <ResizerNext
        enable={{ left: true, right: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResizeMockWithSnapping}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        snap={{ y: [] }}
        snapGap={5}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    const handleRight = container.querySelector(
      `.${resizerHandleRightClassName}`,
    );
    const resizable = container.querySelector(`.${resizerItemClassName}`);

    if (handleRight && resizable) {
      fireEvent.mouseDown(handleRight, { clientX: 0 });
      expect(mockHandleResizeStart).toHaveBeenCalledTimes(1);

      fireEvent.mouseMove(handleRight, { clientX: 94 });
      fireEvent.mouseMove(handleRight, { clientX: 96 });
      expect(mockHandleResizeMockWithSnapping).toHaveBeenCalledTimes(2);
      expect(mockHandleResizeMockWithSnapping).toHaveBeenNthCalledWith(
        1,
        expect.any(Object),
        { width: 94, height: 10 },
      );
      expect(mockHandleResizeMockWithSnapping).toHaveBeenNthCalledWith(
        2,
        expect.any(Object),
        { width: 96, height: 10 },
      );
    }
  });

  it('should apply correct class name to display handle when isHandleVisible is true', () => {
    const { container } = render(
      <ResizerNext
        enable={{ left: true, right: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        isHandleVisible={true}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    expect(container.querySelector('.display-handle')).toBeInTheDocument();
  });

  it('should not apply class name to display handle when isHandleVisible is false', () => {
    const { container } = render(
      <ResizerNext
        enable={{ left: true, right: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        isHandleVisible={false}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    expect(container.querySelector('.display-handle')).not.toBeInTheDocument();
  });
});
