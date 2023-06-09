import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import {
  resizerHandleLeftClassName,
  resizerHandlerClassName,
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

  let mockHandleResizeStart: () => number;
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
      container.querySelector(`.${resizerHandlerClassName.medium}`),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll(`.${resizerHandlerClassName.medium}`).length,
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
        handlerHeightSize={'large'}
        className={customResizableClassName}
        handleClassName={customHandleClassName}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );
    expect(
      container.querySelector(`.${resizerHandlerClassName.large}`),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll(`.${resizerHandlerClassName.large}`).length,
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
        handlerHeightSize={'small'}
        className={customResizableClassName}
        handleClassName={customHandleClassName}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );
    expect(
      container.querySelector(`.${resizerHandlerClassName.small}`),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll(`.${resizerHandlerClassName.small}`).length,
    ).toBe(1);
  });
});
