import React, { useEffect, useRef } from 'react';

import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/addon/closest-edge';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';

import type { DraggableSourceData } from '../../../types';

export interface Props {
  index: number;
  localId?: string;
  width?: number;
  height?: number;
  marginTop?: number;
}

export const ColumnDropTarget: React.FC<Props> = ({
  index,
  localId,
  width,
  height,
  marginTop,
}) => {
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
          data.type === 'table-column' &&
          // Only draggables which came from the same table can be dropped on this target
          data.localId === localId &&
          // Only draggables which DO NOT include this drop targets index can be dropped
          !!data.indexes?.length &&
          data.indexes?.indexOf(index) === -1
        );
      },
      getIsSticky: () => true,
      getData({ input, element }) {
        const data = {
          localId,
          type: 'table-column',
          targetIndex: index,
        };
        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges: ['left', 'right'],
        });
      },
    });
  }, [index, localId]);

  return (
    <div
      ref={dropTargetRef}
      style={{
        width: width && `${width - 1}px`,
        height: height && `${height}px`,
        marginTop: marginTop && `${marginTop}px`,
        pointerEvents: 'auto',
        flexShrink: 0,
      }}
      data-drop-target-index={index}
      data-drop-target-localid={localId}
      data-testid="table-floating-column-controls-drop-target"
    />
  );
};
