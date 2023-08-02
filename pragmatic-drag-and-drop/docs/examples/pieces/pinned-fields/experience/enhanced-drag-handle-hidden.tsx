/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */
import { useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { DragHandleButton } from '../../drag-handle-button';
import { DropIndicatorWithTerminal } from '../../drop-indicator-with-terminal';
import { useFlashOnDrop } from '../../hooks/use-flash-on-drop';
import { useSortableField } from '../../hooks/use-sortable-field';
import { Field } from '../index';
import PinnedFieldsAtlassianTemplate, {
  DraggableFieldProps,
} from '../templates/atlassian';

/**
 * Enhancements are WIP and experimental
 */
const type = 'enhanced--drag-handle--hidden';

const draggableFieldStyles = {
  idle: css({
    // cursor: 'grab',
    // ':hover': {
    //   background: token('elevation.surface.hovered'),
    // },
  }),
  preview: css({}),
  dragging: css({}),
};

function DraggableField({
  index,
  item,
  data,
  reorderItem,
}: DraggableFieldProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [dragHandle, setDragHandle] = useState<HTMLElement | null>(null);

  const { dragState, isHovering, closestEdge } = useSortableField({
    id: item.id,
    index,
    type,
    ref,
    dragHandle,
  });

  useFlashOnDrop({ ref, draggableId: item.id, type });

  return (
    <Field
      ref={ref}
      isDisabled={dragState === 'dragging'}
      closestEdge={closestEdge}
      css={draggableFieldStyles[dragState]}
      label={item.label}
    >
      <span
        style={{
          position: 'absolute',
          top: 8,
          left: -36,
        }}
      >
        <DragHandleButton
          ref={setDragHandle}
          id={item.id}
          index={index}
          dataLength={data.length}
          reorderItem={reorderItem}
          dragState={dragState}
          isTriggerHiddenWhenIdle
          isTriggerForcedVisible={isHovering}
        />
      </span>
      {item.content}
      {closestEdge && (
        <DropIndicatorWithTerminal
          edge={closestEdge}
          gap="8px"
          terminalOffset="4px"
        />
      )}
    </Field>
  );
}

export default function PinnedFieldsEnhancedDragHandleHidden() {
  return (
    <PinnedFieldsAtlassianTemplate
      instanceId={type}
      DraggableField={DraggableField}
    />
  );
}
