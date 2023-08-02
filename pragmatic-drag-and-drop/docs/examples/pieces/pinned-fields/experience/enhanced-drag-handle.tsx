/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */
import { Fragment, ReactNode, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import ReactDOM from 'react-dom';

import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/util/set-custom-native-drag-preview';
import { token } from '@atlaskit/tokens';

import { DragHandleButton } from '../../drag-handle-button';
import { DropIndicatorWithTerminal } from '../../drop-indicator-with-terminal';
import { useFlashOnDrop } from '../../hooks/use-flash-on-drop';
import { useSortableField } from '../../hooks/use-sortable-field';
import { Field, FieldLabel } from '../index';
import PinnedFieldsAtlassianTemplate, {
  DraggableFieldProps,
} from '../templates/atlassian';

/**
 * Enhancements are WIP and experimental
 */
const type = 'enhanced--drag-handle';

const draggableFieldPreviewStyles = css({
  background: token('elevation.surface.overlay'),
  boxShadow: token('elevation.shadow.overlay'),
  borderRadius: 3,
  padding: '4px 8px',
});

function DraggableFieldPreview({ children }: { children: ReactNode }) {
  return (
    <div css={draggableFieldPreviewStyles}>
      <FieldLabel>{children}</FieldLabel>
    </div>
  );
}

const draggableFieldStyles = {
  idle: css({}),
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

  const { dragState, closestEdge } = useSortableField({
    id: item.id,
    index,
    type,
    ref,
    dragHandle,
    onGenerateDragPreview({ nativeSetDragImage }) {
      return setCustomNativeDragPreview({
        nativeSetDragImage,
        render({ container }) {
          ReactDOM.render(
            <DraggableFieldPreview>{item.label}</DraggableFieldPreview>,
            container,
          );
          return () => {
            ReactDOM.unmountComponentAtNode(container);
          };
        },
      });
    },
  });

  useFlashOnDrop({ ref, draggableId: item.id, type });

  return (
    <Field
      ref={ref}
      isDisabled={dragState === 'dragging'}
      closestEdge={closestEdge}
      css={draggableFieldStyles[dragState]}
      label={
        <Fragment>
          <span
            style={{
              marginLeft: -4,
            }}
          >
            <DragHandleButton
              ref={setDragHandle}
              id={item.id}
              index={index}
              dataLength={data.length}
              reorderItem={reorderItem}
              dragState={dragState}
              triggerAppearance="subtle"
            />
          </span>
          {item.label}
        </Fragment>
      }
    >
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

export default function PinnedFieldsEnhancedDragHandle() {
  return (
    <PinnedFieldsAtlassianTemplate
      instanceId={type}
      DraggableField={DraggableField}
    />
  );
}
