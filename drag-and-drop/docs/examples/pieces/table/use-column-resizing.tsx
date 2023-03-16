/** @jsx jsx */
import { RefObject, useEffect, useLayoutEffect, useRef } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { draggable } from '@atlaskit/drag-and-drop/adapter/element';
import { cancelUnhandled } from '@atlaskit/drag-and-drop/addon/cancel-unhandled';
import { disableNativeDragPreview } from '@atlaskit/drag-and-drop/util/disable-native-drag-preview';
import { token } from '@atlaskit/tokens';

import { cssVarTableHeight } from './constants';

const resizeTargetStyles = css({
  width: token('space.300', '24px'),
  height: `var(${cssVarTableHeight})`,
  position: 'absolute',
  top: 0,
  left: `calc(-1 * ${token('space.150', '12px')})`,
  cursor: 'col-resize',
  ':active': {
    background: `linear-gradient(to right, transparent 11px, ${token(
      'color.border.focused',
      '#388BFF',
    )} 11px 13px, transparent 13px)`,
  },
});

function setColumnWidthStyle(th: HTMLElement, proportion: number) {
  th.style.width = `${(proportion * 100).toFixed(2)}%`;
}

function clamp({
  number,
  min,
  max,
}: {
  number: number;
  min: number;
  max: number;
}) {
  return Math.max(min, Math.min(number, max));
}

export function useColumnResizing({
  cellRef,
  index,
  width,
  onResize,
}: {
  cellRef: RefObject<HTMLUnknownElement>;
  index: number;
  width: number;
  onResize(args: { columnIndex: number; width: number }): void;
}) {
  const resizeTargetRef = useRef<HTMLDivElement>(null);

  const resizeTargetJSX = (
    <div ref={resizeTargetRef} css={resizeTargetStyles} />
  );

  /**
   * Sync the heading width to the value saved in state.
   *
   * This is in a layout effect to avoid a visual jump on mount.
   */
  useLayoutEffect(() => {
    const cell = cellRef.current;
    invariant(cell);

    setColumnWidthStyle(cell, width);
  }, [cellRef, width]);

  useEffect(() => {
    if (index === 0) {
      return;
    }

    const cell = cellRef.current;
    invariant(cell);

    const table = cell.closest('table');
    invariant(table);

    const resizeTarget = resizeTargetRef.current;
    invariant(resizeTarget);

    /**
     * The current width of the table, in pixels.
     */
    let tableWidth: number;

    /**
     * The current saved width, in pixels.
     */
    let savedWidth: number;

    /**
     * The width shown during a drag, in pixels.
     */
    let pendingWidth: number;

    /**
     * The saved width of the previous heading, in pixels.
     */
    let prevCellSavedWidth: number;

    return draggable({
      element: resizeTarget,
      onGenerateDragPreview({ nativeSetDragImage }) {
        disableNativeDragPreview({ nativeSetDragImage });
      },
      onDragStart() {
        const tableRect = table.getBoundingClientRect();
        tableWidth = tableRect.width;

        savedWidth = width * tableWidth;

        pendingWidth = savedWidth;

        const prevCell = cell.previousElementSibling;
        invariant(prevCell);
        const prevCellRect = prevCell.getBoundingClientRect();
        prevCellSavedWidth = prevCellRect.width;

        cancelUnhandled.start();
        document.body.style.pointerEvents = 'none';
      },
      onDrag({ location }) {
        const diffX =
          location.current.input.clientX - location.initial.input.clientX;

        const tenthOfTableWidth = tableWidth / 10;

        const diffWidth = clamp({
          number: diffX,
          min: tenthOfTableWidth - prevCellSavedWidth,
          max: savedWidth - tenthOfTableWidth,
        });

        pendingWidth = savedWidth - diffWidth;

        const prevCell = cell.previousElementSibling;
        invariant(prevCell instanceof HTMLElement);
        const prevCellPendingWidth = prevCellSavedWidth + diffWidth;

        setColumnWidthStyle(cell, pendingWidth / tableWidth);
        setColumnWidthStyle(prevCell, prevCellPendingWidth / tableWidth);
      },
      onDrop() {
        onResize({ columnIndex: index, width: pendingWidth / tableWidth });

        cancelUnhandled.stop();
        document.body.style.pointerEvents = 'auto';
      },
    });
  }, [cellRef, index, onResize, width]);

  return { resizeTargetJSX };
}
