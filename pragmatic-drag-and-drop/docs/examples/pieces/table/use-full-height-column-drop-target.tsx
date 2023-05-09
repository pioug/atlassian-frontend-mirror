/** @jsx jsx */
import { useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/addon/closest-edge';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-indicator/box';
import {
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/adapter/element';

import { cssVarTableHeight } from './constants';

const dropTargetStyles = css({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: `var(${cssVarTableHeight})`,
});

export function useFullHeightColumnDropTarget({
  id,
  index,
}: {
  id: string;
  index: number;
}) {
  const [isDraggingAnyColumn, setIsDraggingAnyColumn] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const dropTargetRef = useRef<HTMLDivElement>(null);

  const dropTargetJSX = isDraggingAnyColumn ? (
    <div ref={dropTargetRef} css={dropTargetStyles}>
      {closestEdge && <DropIndicator edge={closestEdge} />}
    </div>
  ) : null;

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return source.data.type === 'table-header';
      },
      onDragStart() {
        /**
         * Should cause a synchronous re-render.
         */
        setIsDraggingAnyColumn(true);
      },
      onDrop() {
        setIsDraggingAnyColumn(false);
      },
    });
  }, []);

  useEffect(() => {
    if (!isDraggingAnyColumn) {
      return;
    }

    const dropTarget = dropTargetRef.current;
    invariant(dropTarget);

    return dropTargetForElements({
      element: dropTarget,
      getIsSticky() {
        return true;
      },
      getData({ input, element }) {
        const data = { id, index };
        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges: ['left', 'right'],
        });
      },
      canDrop(args) {
        return args.source.data.type === 'table-header';
      },
      onDrag(args) {
        if (args.source.data.id !== id) {
          setClosestEdge(extractClosestEdge(args.self.data));
        }
      },
      onDragLeave() {
        setClosestEdge(null);
      },
      onDrop() {
        setClosestEdge(null);
      },
    });
  }, [id, index, isDraggingAnyColumn]);

  return { dropTargetJSX };
}
