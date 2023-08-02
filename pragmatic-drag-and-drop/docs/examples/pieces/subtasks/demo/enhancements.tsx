/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */
import { ReactNode, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import ReactDOM from 'react-dom';

import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/util/set-custom-native-drag-preview';
import { token } from '@atlaskit/tokens';

import { DragHandleButton } from '../../drag-handle-button';
import { DropIndicatorWithTerminal } from '../../drop-indicator-with-terminal';
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

  return (
    <Subtask
      ref={ref}
      {...subtaskProps}
      id={id}
      appearance={stateToAppearanceMap[dragState]}
      css={draggableSubtaskStyles}
      isIconHidden
    >
      <span style={{ position: 'absolute', top: 8, left: 4 }}>
        <DragHandleButton
          ref={setDragHandle}
          id={id}
          index={index}
          dataLength={data.length}
          reorderItem={reorderItem}
          fallbackIcon={<SubtaskObjectIcon />}
          isTriggerHiddenWhenIdle
          isTriggerForcedVisible={isHovering}
          dragState={dragState}
        />
      </span>
      {closestEdge && (
        <DropIndicatorWithTerminal
          edge={closestEdge}
          gap="1px"
          terminalOffset="8px"
        />
      )}
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
