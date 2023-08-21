/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */
import { ReactNode, useCallback, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import ReactDOM from 'react-dom';

import { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { DragHandleDropdownMenu } from '@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-dropdown-menu';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-indicator/box';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/util/set-custom-native-drag-preview';
import { token } from '@atlaskit/tokens';

import { useFlashOnDrop } from '../../hooks/use-flash-on-drop';
import { DragState, useSortableField } from '../../hooks/use-sortable-field';
import {
  ReorderItem,
  useTopLevelWiring,
} from '../../hooks/use-top-level-wiring';
import { initialData } from '../data';
import {
  Subtask,
  SubtaskAppearance,
  SubtaskProps,
} from '../primitives/subtask';
import { SubtaskContainer } from '../primitives/subtask-container';
import { SubtaskObjectIcon } from '../primitives/subtask-icon';

const type = 'subtasks--enhanced';

const draggableSubtaskPreviewStyles = css({
  background: token('elevation.surface.overlay'),
  boxShadow: token('elevation.shadow.overlay'),
  borderRadius: 3,
  padding: 8,
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gap: 8,
  alignItems: 'center',
});

function DraggableSubtaskPreview({ children }: { children: ReactNode }) {
  return (
    <div css={draggableSubtaskPreviewStyles}>
      <SubtaskObjectIcon />
      <div>{children}</div>
    </div>
  );
}

type DraggableSubtaskProps = SubtaskProps & {
  index: number;
  data: unknown[];
  reorderItem: ReorderItem;
};

const draggableSubtaskStyles = css({ position: 'relative' });

const stateToAppearanceMap: Record<DragState, SubtaskAppearance> = {
  idle: 'default',
  preview: 'overlay',
  dragging: 'disabled',
};

/**
 * The styles used for the element before here are not suitable for production
 * use for multiple reasons, including:
 *
 * - Use of magic values for positioning.
 * - Use of `:has()` selector which is not fully supported.
 *
 * This is just for demonstration purposes.
 */
const elementBeforeStyles = css({
  position: 'absolute',
  top: 0,
  left: 0,
  '--button-opacity': 0,
  ':has(:focus-visible), :has([aria-expanded="true"])': {
    '--button-opacity': 1,
  },
});

const elementBeforeButtonVisibleStyles = css({ '--button-opacity': 1 });
const elementBeforeButtonHiddenStyles = css({ '--button-opacity': 0 });

const elementBeforeIconContainerStyles = css({
  position: 'absolute',
  top: 12,
  left: 8,
  opacity: 'calc(1 - var(--button-opacity))',
});

const elementBeforeButtonContainerStyles = css({
  position: 'absolute',
  top: 8,
  left: 4,
  opacity: 'var(--button-opacity)',
});

function DraggableSubtask({
  index,
  id,
  data,
  reorderItem,
  ...subtaskProps
}: DraggableSubtaskProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragHandle, setDragHandle] = useState<HTMLElement | null>(null);

  const { dragState, isHovering, closestEdge } = useSortableField({
    id,
    index,
    type,
    ref,
    dragHandle,
    onGenerateDragPreview({ nativeSetDragImage }) {
      return setCustomNativeDragPreview({
        nativeSetDragImage,
        render({ container }) {
          ReactDOM.render(
            <DraggableSubtaskPreview>
              {subtaskProps.title}
            </DraggableSubtaskPreview>,
            container,
          );
          return () => {
            ReactDOM.unmountComponentAtNode(container);
          };
        },
      });
    },
  });

  useFlashOnDrop({ ref, draggableId: id, type });

  const moveUp = useCallback(() => {
    reorderItem({ id, action: 'up' });
  }, [id, reorderItem]);

  const moveDown = useCallback(() => {
    reorderItem({ id, action: 'down' });
  }, [id, reorderItem]);

  const isMoveUpDisabled = index === 0;
  const isMoveDownDisabled = index === data.length - 1;

  return (
    <Subtask
      ref={ref}
      {...subtaskProps}
      id={id}
      appearance={stateToAppearanceMap[dragState]}
      css={draggableSubtaskStyles}
      isIconHidden
    >
      <span
        css={[
          elementBeforeStyles,
          isHovering && elementBeforeButtonVisibleStyles,
          dragState === 'dragging' && elementBeforeButtonHiddenStyles,
        ]}
      >
        <span css={elementBeforeIconContainerStyles}>
          <SubtaskObjectIcon />
        </span>
        <span css={elementBeforeButtonContainerStyles}>
          <DragHandleDropdownMenu triggerRef={setDragHandle} label="reorder">
            <DropdownItemGroup>
              <DropdownItem onClick={moveUp} isDisabled={isMoveUpDisabled}>
                Move up
              </DropdownItem>
              <DropdownItem onClick={moveDown} isDisabled={isMoveDownDisabled}>
                Move down
              </DropdownItem>
            </DropdownItemGroup>
          </DragHandleDropdownMenu>
        </span>
      </span>
      {closestEdge && <DropIndicator edge={closestEdge} gap="1px" />}
    </Subtask>
  );
}

export default function SubtaskEnhanced() {
  const { data, reorderItem } = useTopLevelWiring({ initialData, type });

  return (
    <SubtaskContainer>
      {data.map((item, index) => (
        <DraggableSubtask
          key={item.id}
          id={item.id}
          title={item.title}
          index={index}
          data={data}
          reorderItem={reorderItem}
        />
      ))}
    </SubtaskContainer>
  );
}
