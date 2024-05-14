/** @jsx jsx */
import { useEffect, useRef } from 'react';

import { css, jsx } from '@emotion/react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';

import { key } from '../pm-plugins/main';
import type { BlockControlsPlugin } from '../types';

import { DRAG_HANDLE_HEIGHT, DRAG_HANDLE_WIDTH } from './consts';
import { dragPreview } from './drag-preview';

const styles = css({
  position: 'absolute',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  background: 'grey',
  zIndex: 1,
  height: DRAG_HANDLE_HEIGHT,
  width: DRAG_HANDLE_WIDTH,
  left: -DRAG_HANDLE_WIDTH,
});

export const DragHandle = ({
  dom,
  api,
  start,
}: {
  dom: HTMLElement;
  api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
  start: number;
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const domRef = useRef<HTMLElement>(dom);

  useEffect(() => {
    const element = buttonRef.current;
    if (!element) {
      return;
    }

    return draggable({
      element,

      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        setCustomNativeDragPreview({
          getOffset: () => {
            const rect = domRef.current.getBoundingClientRect();
            // Offset the drag preview to the center of the element
            return { x: 0, y: rect.height / 2 };
          },
          render: ({ container }) => {
            return dragPreview(container, domRef);
          },
          nativeSetDragImage,
        });
      },
      onDragStart() {
        api?.core?.actions.execute(({ tr }) =>
          tr.setMeta(key, {
            isDragging: true,
            start,
          }),
        );
      },
      onDrop() {
        api?.core?.actions.execute(({ tr }) =>
          tr.setMeta(key, {
            isDragging: false,
          }),
        );
      },
    });
  }, [api, start]);

  return (
    <div
      css={styles}
      style={{ top: dom.clientHeight / 2 - DRAG_HANDLE_HEIGHT / 2 }}
      ref={buttonRef}
      onClick={() => {
        api?.core?.actions.execute(({ tr }) =>
          tr.setMeta(key, {
            toggleMenu: true,
          }),
        );
      }}
    />
  );
};
