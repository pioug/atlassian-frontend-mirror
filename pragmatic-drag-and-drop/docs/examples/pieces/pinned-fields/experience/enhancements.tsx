/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */
import { useRef } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { DropIndicatorWithTerminal } from '../../drop-indicator-with-terminal';
import { useFlashOnDrop } from '../../hooks/use-flash-on-drop';
import { useSortableField } from '../../hooks/use-sortable-field';
import { useTopLevelWiring } from '../../hooks/use-top-level-wiring';
import { initialData } from '../data';
import {
  Field,
  FieldProps,
  PinnedFieldsContainer,
  PinnedFieldsList,
} from '../index';

/**
 * Enhancements are WIP and experimental
 */
const type = 'with-enhancements';

const draggableFieldStyles = {
  idle: css({
    cursor: 'grab',
    ':hover': {
      background: token('elevation.surface.hovered'),
    },
  }),
  preview: css({}),
  dragging: css({}),
};

function DraggableField({
  id,
  index,
  children,
  ...fieldProps
}: FieldProps & {
  id: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { dragState, closestEdge } = useSortableField({
    id,
    index,
    type,
    ref,
  });

  useFlashOnDrop({ ref, draggableId: id, type });

  return (
    <Field
      ref={ref}
      isDisabled={dragState === 'dragging'}
      closestEdge={closestEdge}
      css={draggableFieldStyles[dragState]}
      {...fieldProps}
    >
      {children}
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

export default function PinnedFieldsPdndEnhanced() {
  const { data } = useTopLevelWiring({ initialData, type });

  return (
    <PinnedFieldsContainer>
      <PinnedFieldsList>
        {data.map((item, index) => (
          <DraggableField
            key={item.id}
            id={item.id}
            label={item.label}
            index={index}
          >
            {item.content}
          </DraggableField>
        ))}
      </PinnedFieldsList>
    </PinnedFieldsContainer>
  );
}
