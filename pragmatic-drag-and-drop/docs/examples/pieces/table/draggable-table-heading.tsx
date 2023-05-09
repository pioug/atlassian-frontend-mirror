/** @jsx jsx */
import { ReactNode, useEffect, useRef, useState } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/react';
import invariant from 'tiny-invariant';

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/util/combine';
import { token } from '@atlaskit/tokens';

import { Column } from '../../data/presidents';

import { useColumnResizing } from './use-column-resizing';
import { useFullHeightColumnDropTarget } from './use-full-height-column-drop-target';

type DraggableStatus = 'idle' | 'preview' | 'dragging';

const tableHeadingStyles = css({
  position: 'relative',
  paddingBlock: token('space.100', '8px'),
  lineHeight: token('font.lineHeight.300', '24px'),
});

const tableHeadingStatusStyles: Partial<
  Record<DraggableStatus, SerializedStyles>
> = {
  idle: css({
    ':hover': {
      background: token('elevation.surface.hovered', '#091E4224'),
    },
  }),
  dragging: css({
    background: token('color.background.disabled', '#091E4224'),
    color: token('color.text.disabled', '#091E424F'),
  }),
};

/** Set a `style` property on a `HTMLElement`
 *
 * @returns a `cleanup` function to restore the `style` property to it's original state
 */
function setStyle<Property extends string & keyof CSSStyleDeclaration>(
  el: HTMLElement,
  {
    property,
    rule,
  }: { property: Property; rule: CSSStyleDeclaration[Property] },
): () => void {
  const original = el.style[property];
  el.style[property] = rule;
  return () => (el.style[property] = original);
}

export const DraggableTableHeading = ({
  children,
  id,
  index,
  width,
  onResize,
}: {
  children: ReactNode;
  id: Column;
  index: number;
  width: number;
  onResize(args: { columnIndex: number; width: number }): void;
}) => {
  const ref = useRef<HTMLTableCellElement>(null);

  const [status, setStatus] = useState<DraggableStatus>('idle');

  useEffect(() => {
    const cell = ref.current;
    invariant(cell);

    let previewCleanupFn: () => void;

    return combine(
      draggable({
        element: cell,
        getInitialData() {
          return { type: 'table-header', id, index };
        },
        onGenerateDragPreview() {
          setStatus('preview');

          /**
           * Gives the column preview an opaque background.
           */
          const table = cell.closest('table');
          invariant(table);
          previewCleanupFn = setStyle(table, {
            property: 'backgroundColor',
            rule: token('elevation.surface', '#FFF'),
          });
        },
        onDragStart() {
          setStatus('dragging');

          /**
           * Clear the table background so it's not visible outside the preview.
           */
          previewCleanupFn();
        },
        onDrop() {
          setStatus('idle');
        },
      }),
    );
  }, [id, index]);

  const { dropTargetJSX } = useFullHeightColumnDropTarget({ id, index });
  const { resizeTargetJSX } = useColumnResizing({
    cellRef: ref,
    index,
    width,
    onResize,
  });

  return (
    <th ref={ref} css={[tableHeadingStyles, tableHeadingStatusStyles[status]]}>
      {children}
      {resizeTargetJSX}
      {dropTargetJSX}
    </th>
  );
};
