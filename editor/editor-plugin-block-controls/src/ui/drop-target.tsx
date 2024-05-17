/** @jsx jsx */
import { useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { B300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { BlockControlsPlugin } from '../types';

import { DROP_TARGET_CIRCLE_DIAMETER, DROP_TARGET_LINE_WIDTH } from './consts';

const styleHighlighted = css({
  height: token('space.100'),
  marginTop: `calc(${token('space.negative.100')} - ${DROP_TARGET_LINE_WIDTH}px)`,
  marginLeft: token('space.negative.100'),
  top: `calc(${token('space.100')} / 2 - 1px)`, //1px to help clear expand node margin
  position: 'relative',
  borderBottom: `solid ${token('color.border.selected', B300)} ${DROP_TARGET_LINE_WIDTH}px`,
  "&:before": {
    content: '""',
    width: `${DROP_TARGET_CIRCLE_DIAMETER}px`,
    height: `${DROP_TARGET_CIRCLE_DIAMETER}px`,
    marginTop: `${DROP_TARGET_CIRCLE_DIAMETER}px`,
    borderRadius: '50%',
    border: `solid ${token('color.border.selected', B300)} ${DROP_TARGET_LINE_WIDTH}px`,
    backgroundColor: token('color.background.input', 'white'),
    display: 'block',
    position: 'absolute',
    bottom: `${-(DROP_TARGET_CIRCLE_DIAMETER + DROP_TARGET_LINE_WIDTH) / 2}px`,
    boxSizing: 'border-box',
  },
});

const styleDisabled = css({
  height: token('space.100'),
  marginTop: `calc(${token('space.negative.100')} - ${DROP_TARGET_LINE_WIDTH}px)`,
  position: 'relative',
  borderBottom: `solid transparent ${DROP_TARGET_LINE_WIDTH}px`,
  "&:before": {
    border: `solid transparent ${DROP_TARGET_LINE_WIDTH}px`,
  },
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
      css={isDraggedOver ? styleHighlighted : styleDisabled}
      ref={ref}
    />
  );
};
