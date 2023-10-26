import type { MouseEventHandler } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import classnames from 'classnames';
import ReactDOM from 'react-dom';

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/util/set-custom-native-drag-preview';

import type { TableDirection } from '../../types';
import { TableCssClassName as ClassName } from '../../types';
import { DragPreview } from '../DragPreview';
import { DragHandleIcon } from '../icons';

type DragHandleAppearance = 'default' | 'selected' | 'disabled' | 'danger';

type DragHandleProps = {
  tableLocalId: string;
  indexes: number[];
  previewWidth?: number;
  previewHeight?: number;
  direction?: TableDirection;
  appearance?: DragHandleAppearance;
  onClick?: MouseEventHandler;
  onMouseOver?: MouseEventHandler;
  onMouseOut?: MouseEventHandler;
  onMouseUp?: MouseEventHandler;
};

export const DragHandle = ({
  tableLocalId,
  direction = 'row',
  appearance = 'default',
  indexes,
  previewWidth,
  previewHeight,
  onMouseOver,
  onMouseOut,
  onMouseUp,
  onClick,
}: DragHandleProps) => {
  const dragHandleDivRef = useRef<HTMLButtonElement>(null);
  const [previewContainer, setPreviewContainer] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    const dragHandleDivRefCurrent = dragHandleDivRef.current;
    if (dragHandleDivRefCurrent) {
      return draggable({
        element: dragHandleDivRefCurrent,
        getInitialData() {
          return {
            localId: tableLocalId,
            type: `table-${direction}`,
            indexes,
          };
        },
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            getOffset: ({ container }) => {
              const rect = container.getBoundingClientRect();
              if (direction === 'row') {
                return { x: 16, y: 16 };
              } else {
                return { x: rect.width / 2 + 16, y: 16 };
              }
            },
            render: function render({ container }) {
              setPreviewContainer(container);
              return () => setPreviewContainer(null);
            },
            nativeSetDragImage,
          });
        },
      });
    }
  }, [tableLocalId, direction, indexes]);

  return (
    <button
      className={classnames(ClassName.DRAG_HANDLE_BUTTON_CONTAINER, appearance)}
      ref={dragHandleDivRef}
      style={{
        transform: direction === 'column' ? 'none' : 'rotate(90deg)',
        pointerEvents: 'auto',
      }}
      data-testid="table-floating-column-controls-drag-handle"
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onMouseUp={onMouseUp}
      onClick={onClick}
    >
      <DragHandleIcon />
      {previewContainer &&
        previewWidth !== undefined &&
        previewHeight !== undefined &&
        ReactDOM.createPortal(
          <DragPreview
            direction={direction}
            width={previewWidth}
            height={previewHeight}
          />,
          previewContainer,
        )}
    </button>
  );
};
