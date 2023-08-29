import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import {
  resizerHandleClassName,
  resizerHandleThumbClassName,
  resizerHandleTrackClassName,
  resizerItemClassName,
} from '../../../styles/shared/resizer';
import { ResizerNext } from '../../index';
import type { HandleResize } from '../../types';

describe('Resizer', () => {
  let initialWidth: number;
  let customHandleClassName: string;
  let customResizableClassName: string;

  let mockHandleResizeStart: () => void;
  let mockHandleResize: HandleResize;
  let mockHandleResizeStop: HandleResize;

  beforeEach(() => {
    initialWidth = 50;
    customHandleClassName = 'test-handle';
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
      `.${resizerHandleClassName}.left`,
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
      container.querySelector(`.${resizerHandleClassName}.left`),
    ).toBeNull();
    expect(
      container.querySelector(`.${resizerHandleClassName}.right`),
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
      `.${resizerHandleClassName}.left`,
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
      container.querySelector(`.${resizerHandleClassName}.left`),
    ).toBeInTheDocument();
    expect(
      container.querySelector(`.${resizerHandleClassName}.right`),
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
      container.querySelector(`.${customHandleClassName}.left`),
    ).toBeInTheDocument();
    expect(
      container.querySelector(`.${customHandleClassName}.right`),
    ).toBeInTheDocument();

    expect(
      container.querySelector(`.${resizerHandleClassName}.left`),
    ).toBeNull();
    expect(
      container.querySelector(`.${resizerHandleClassName}.right`),
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
      `.${resizerHandleClassName}.left`,
    );
    const rightHandle = container.querySelector(
      `.${resizerHandleClassName}.right`,
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
      container.querySelector(`.${customHandleClassName}.medium`),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll(`.${customHandleClassName}.medium`).length,
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
      container.querySelector(`.${customHandleClassName}.large`),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll(`.${customHandleClassName}.large`).length,
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
      container.querySelector(`.${customHandleClassName}.small`),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll(`.${customHandleClassName}.small`).length,
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
      `.${resizerHandleClassName}.right`,
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
      `.${resizerHandleClassName}.right`,
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
      `.${resizerHandleClassName}.right`,
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
      `.${resizerHandleClassName}.right`,
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

  it('should apply correct class name to resizer when appearance is set to "danger"', () => {
    const { container } = render(
      <ResizerNext
        enable={{ left: true, right: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        appearance="danger"
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    expect(container.querySelector('.danger')).toBeInTheDocument();
  });

  it('should not apply any appearance classes to resizer when appearance is unset', () => {
    const { container } = render(
      <ResizerNext
        enable={{ left: true, right: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        appearance={undefined}
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    // NOTE: Check for all available appearance classes
    expect(container.querySelector('.danger')).not.toBeInTheDocument();
  });

  it('should apply correct class name to resizer when handleAlignmentMethod not set', () => {
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

    expect(
      container.querySelector(`.${resizerHandleClassName}.center`),
    ).toBeInTheDocument();
  });

  it('should apply correct class name to resizer when handleAlignmentMethod set to "center"', () => {
    const { container } = render(
      <ResizerNext
        enable={{ left: true, right: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        handleAlignmentMethod="center"
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    expect(
      container.querySelector(`.${resizerHandleClassName}.center`),
    ).toBeInTheDocument();
  });

  it('should apply correct class name to resizer when handleAlignmentMethod set to "sticky"', () => {
    const { container } = render(
      <ResizerNext
        enable={{ left: true, right: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        handleAlignmentMethod="sticky"
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    expect(
      container.querySelector(`.${resizerHandleClassName}.sticky`),
    ).toBeInTheDocument();
  });

  it('should apply correct class name to resizer when handleHighlight not set', () => {
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

    expect(
      container.querySelector(`.${resizerHandleThumbClassName}`),
    ).toBeInTheDocument();
    expect(
      container.querySelector(`.${resizerHandleTrackClassName}`),
    ).toBeNull();
  });

  it('should apply correct class name to resizer when handleHighlight set to "none"', () => {
    const { container } = render(
      <ResizerNext
        enable={{ left: true, right: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        handleHighlight="none"
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    expect(
      container.querySelector(`.${resizerHandleThumbClassName}`),
    ).toBeInTheDocument();
    expect(
      container.querySelector(`.${resizerHandleTrackClassName}`),
    ).toBeNull();
  });

  it('should apply correct class name to resizer when handleHighlight set to "shadow"', () => {
    const { container } = render(
      <ResizerNext
        enable={{ left: true, right: true }}
        handleResizeStart={mockHandleResizeStart}
        handleResize={mockHandleResize}
        handleResizeStop={mockHandleResizeStop}
        width={initialWidth}
        handleHighlight="shadow"
      >
        <div>resizable div</div>
      </ResizerNext>,
    );

    expect(
      container.querySelector(`.${resizerHandleThumbClassName}`),
    ).toBeInTheDocument();
    expect(
      container.querySelector(`.${resizerHandleTrackClassName}.shadow`),
    ).toBeInTheDocument();
  });
});
