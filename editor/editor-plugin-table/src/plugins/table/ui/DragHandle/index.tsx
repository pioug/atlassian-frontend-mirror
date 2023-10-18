import type { MouseEventHandler } from 'react';
import React, { useEffect, useRef } from 'react';

import { DragHandleButton } from '@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-button';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
import { token } from '@atlaskit/tokens';

type DragHandleProps = {
  tableLocalId: string;
  indexes: number[];
  direction?: 'column' | 'row';
  onClick?: MouseEventHandler;
  onMouseOver?: MouseEventHandler;
  onMouseOut?: MouseEventHandler;
};

// TODO: use for now, in future replace with custom @atlaskit/icon/glyph/drag-handler
// width is too large (24px), should be 16px
export const DragHandle = ({
  tableLocalId,
  direction = 'row',
  indexes,
  onClick,
  onMouseOver,
  onMouseOut,
}: DragHandleProps) => {
  const dragHandleDivRef = useRef<HTMLDivElement>(null);

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
      });
    }
  }, [tableLocalId, direction, indexes]);
  return (
    <div
      ref={dragHandleDivRef}
      style={{
        backgroundColor: `${token('elevation.surface', 'white')}`,
        borderRadius: '4px',
        border: `2px solid ${token('elevation.surface', 'white')}`,
        transform: direction === 'column' ? 'rotate(90deg)' : 'none',
      }}
    >
      <DragHandleButton label="blah" />
    </div>
  );
};
