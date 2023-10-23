import type { MouseEventHandler } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import ReactDOM from 'react-dom';

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/util/set-custom-native-drag-preview';
import { N200, N700 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { TableCssClassName as ClassName } from '../../types';
import { DragPreview } from '../DragPreview';
import { DragHandleIcon } from '../icons';

type DragHandleState = 'default' | 'selected' | 'disabled' | 'danger';

type DragHandleProps = {
  tableLocalId: string;
  indexes: number[];
  previewWidth?: number;
  previewHeight?: number;
  direction?: 'column' | 'row';
  state?: DragHandleState;
  onClick?: MouseEventHandler;
  onMouseOver?: MouseEventHandler;
  onMouseOut?: MouseEventHandler;
};

const mapStateToProps = (state: DragHandleState) => {
  switch (state) {
    case 'danger':
    case 'disabled':
    case 'selected':
    case 'default':
    default:
      return {
        backgroundColor: token('color.background.accent.gray.subtlest', N200),
        foregroundColor: token('color.icon.subtle', N700),
      };
  }
};

export const DragHandle = ({
  tableLocalId,
  direction = 'row',
  state = 'default',
  indexes,
  previewWidth,
  previewHeight,
  onClick,
  onMouseOver,
  onMouseOut,
}: DragHandleProps) => {
  const dragHandleDivRef = useRef<HTMLButtonElement>(null);
  const iconProps = mapStateToProps(state);
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
      className={ClassName.DRAG_HANDLE_BUTTON_CONTAINER}
      ref={dragHandleDivRef}
      style={{
        backgroundColor: `${token('elevation.surface', 'white')}`,
        borderRadius: '4px',
        border: `2px solid ${token('elevation.surface', 'white')}`,
        transform: direction === 'column' ? 'none' : 'rotate(90deg)',
        pointerEvents: 'auto',
      }}
      data-testid="table-floating-column-controls-drag-handle"
    >
      <DragHandleIcon {...iconProps} />
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
