import React, { useEffect, useRef } from 'react';

import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/addon/closest-edge';

import type { DraggableSourceData } from '../../../types';

export type RowDropTargetProps = {
  index: number;
  localId?: string;
  style?: React.CSSProperties;
};

const RowDropTarget = ({ index, localId, style }: RowDropTargetProps) => {
  const dropTargetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!dropTargetRef.current) {
      return;
    }

    return dropTargetForElements({
      element: dropTargetRef.current,
      canDrop({ source }) {
        const data = source.data as DraggableSourceData;
        return (
          // Only draggables of row type can be dropped on this target
          data.type === 'table-row' &&
          // Only draggables which came from the same table can be dropped on this target
          data.localId === localId &&
          // Only draggables which DO NOT include this drop targets index can be dropped
          !!data.indexes?.length &&
          data.indexes?.indexOf(index) === -1
        );
      },
      getData({ input, element }) {
        const data = {
          localId,
          type: 'table-row',
          targetIndex: index,
        };
        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges: ['top', 'bottom'],
        });
      },
    });
  }, [index, localId]);

  return (
    <div
      ref={dropTargetRef}
      style={style}
      data-drop-target-index={index}
      data-drop-target-localid={localId}
      data-testid="table-floating-row-controls-drop-target"
    ></div>
  );
};

export default RowDropTarget;
