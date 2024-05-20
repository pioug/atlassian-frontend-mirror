/** @jsx jsx */
import { useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { token } from '@atlaskit/tokens';

import type { BlockControlsPlugin } from '../types';

const styleDropTarget = css({
  height: token('space.100'),
  marginTop: `calc(${token('space.negative.100')})`,
  position: 'relative',
});

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
      css={styleDropTarget}
      ref={ref}
    >
      {
        //4px gap to clear expand node border
        isDraggedOver && <DropIndicator edge="bottom" gap="4px" />
      }
    </div>
  );
};
