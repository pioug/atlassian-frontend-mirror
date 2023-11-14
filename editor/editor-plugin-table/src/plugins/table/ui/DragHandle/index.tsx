import type { MouseEventHandler } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import classnames from 'classnames';
import ReactDOM from 'react-dom';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/util/set-custom-native-drag-preview';

import { getPluginState } from '../../pm-plugins/plugin-factory';
import type { TableDirection } from '../../types';
import { TableCssClassName as ClassName } from '../../types';
import { hasMergedCellsInColumn, hasMergedCellsInRow } from '../../utils';
import { DragPreview } from '../DragPreview';
import { DragHandleDisabledIcon, DragHandleIcon } from '../icons';

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
  editorView: EditorView;
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
  editorView,
}: DragHandleProps) => {
  const dragHandleDivRef = useRef<HTMLButtonElement>(null);
  const [previewContainer, setPreviewContainer] = useState<HTMLElement | null>(
    null,
  );
  const { isDragAndDropEnabled } = getPluginState(editorView.state);
  const { selection } = editorView.state;

  const hasMergedCells = useMemo(
    () =>
      direction === 'row'
        ? hasMergedCellsInRow(indexes[0])(selection)
        : hasMergedCellsInColumn(indexes[0])(selection),
    [indexes, direction, selection],
  );

  useEffect(() => {
    const dragHandleDivRefCurrent = dragHandleDivRef.current;

    if (dragHandleDivRefCurrent) {
      return draggable({
        element: dragHandleDivRefCurrent,
        canDrag: () => {
          return !hasMergedCells;
        },
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
  }, [
    tableLocalId,
    direction,
    indexes,
    editorView.state.selection,
    hasMergedCells,
  ]);

  return (
    <button
      className={classnames(
        ClassName.DRAG_HANDLE_BUTTON_CONTAINER,
        appearance,
        isDragAndDropEnabled &&
          hasMergedCells &&
          ClassName.DRAG_HANDLE_DISABLED,
      )}
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
      {hasMergedCells ? <DragHandleDisabledIcon /> : <DragHandleIcon />}
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
