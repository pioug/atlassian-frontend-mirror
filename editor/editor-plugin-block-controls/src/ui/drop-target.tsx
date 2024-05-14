import React, { useEffect, useRef, useState } from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import type { BlockControlsPlugin } from '../types';

export const DropTarget = ({
  api,
  index,
}: {
  api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
  index: number;
}) => {
  const ref = useRef(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    return dropTargetForElements({
      element,
      getIsSticky: () => true,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => {
        const { activeNode, decorationState } =
          api?.blockControls?.sharedState.currentState() || {};
        if (!activeNode || !decorationState) {
          return;
        }
        const { pos } = decorationState.find(dec => dec.index === index) || {};

        if (activeNode && pos !== undefined) {
          const { pos: start } = activeNode;
          api?.core?.actions.execute(
            api?.blockControls?.commands?.moveNode(start, pos),
          );
        }
      },
    });
  }, [index, api]);

  return (
    // Note: Firefox has trouble with using a button element as the handle for drag and drop
    <div
      style={{
        height: '20px',
        marginTop: '-22px',
        top: '10px',
        position: 'relative',
        borderBottom: `solid ${isDraggedOver ? 'blue' : 'transparent'} 2px`,
      }}
      ref={ref}
    />
  );
};
