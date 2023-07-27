/** @jsx jsx */
import { Fragment, memo, useContext, useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { createPortal } from 'react-dom';
import invariant from 'tiny-invariant';

import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/addon/closest-edge';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-indicator/box-without-terminal';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/util/combine';
import { offsetFromPointer } from '@atlaskit/pragmatic-drag-and-drop/util/offset-from-pointer';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/util/set-custom-native-drag-preview';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { minColumnWidth } from './constants';
import { RowMenuButton } from './menu-button';
import { getField } from './render-pieces';
import { TableContext } from './table-context';
import type { Item } from './types';

const rowStyles = css({
  // Needed for our drop indicator
  position: 'relative',
  // Disabling hover styles while dragging
  // Hover styles can be triggered while dragging due to auto scrolling
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  'body:not(.is-dragging) &:hover': {
    background: token('color.background.input.hovered', 'red'),
  },
});

const textOverflowStyles = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

type State =
  | {
      type: 'idle';
    }
  | {
      type: 'preview';
      container: HTMLElement;
    }
  | {
      type: 'is-over';
      closestEdge: Edge | null;
    };

/**
 * Memoizing each Row so that row reorders don't need to rerender the entire
 * table.
 *
 * Column rerenders still need to rerender every row. Both could be optimized
 * further, such as by using virtualization.
 */
export const Row = memo(function Row({
  item,
  index,
  properties,
  amountOfRows,
}: {
  item: Item;
  index: number;
  properties: (keyof Item)[];
  amountOfRows: number;
}) {
  const ref = useRef<HTMLTableRowElement | null>(null);
  const { register } = useContext(TableContext);
  const [state, setState] = useState<State>({ type: 'idle' });

  useEffect(() => {
    const element = ref.current;
    invariant(element);
    const unregister = register({ item, element, index });
    return unregister;
  }, [register, item, index]);

  // Pragmatic drag and drop
  useEffect(() => {
    const element = ref.current;
    invariant(element);
    return combine(
      draggable({
        element,
        getInitialData() {
          return { type: 'item-row', item, index };
        },
        onGenerateDragPreview({ nativeSetDragImage }) {
          // We need to make sure that the element not obfuscated by the sticky header
          setCustomNativeDragPreview({
            getOffset: offsetFromPointer({
              x: token('space.250', '0'),
              y: token('space.250', '0'),
            }),
            render({ container }) {
              setState({ type: 'preview', container });
              return () => setState({ type: 'idle' });
            },
            nativeSetDragImage,
          });
        },
      }),
      dropTargetForElements({
        element,
        canDrop(args) {
          return (
            args.source.data.type === 'item-row' &&
            args.source.data.item !== item
          );
        },
        getData({ input, element }) {
          const data = { item, index };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom'],
          });
        },
        onDragEnter(args) {
          setState({
            type: 'is-over',
            closestEdge: extractClosestEdge(args.self.data),
          });
        },
        onDrag(args) {
          const closestEdge: Edge | null = extractClosestEdge(args.self.data);

          // only update react state if the `closestEdge` changes
          setState(current => {
            if (current.type !== 'is-over') {
              return current;
            }
            if (current.closestEdge === closestEdge) {
              return current;
            }
            return {
              type: 'is-over',
              closestEdge,
            };
          });
        },
        onDragLeave() {
          setState({ type: 'idle' });
        },
        onDrop() {
          setState({ type: 'idle' });
        },
      }),
    );
  }, [item, index]);

  return (
    <Fragment>
      <tr draggable ref={ref} css={rowStyles}>
        {properties.map((property, columnIndex) => (
          <td key={property} css={textOverflowStyles}>
            {getField({ item, property })}
            {state.type === 'is-over' && state.closestEdge ? (
              <DropIndicator edge={state.closestEdge} />
            ) : null}

            {
              /**
               * Rendering this in only the last column of each row
               */
              columnIndex === properties.length - 1 && (
                <RowMenuButton rowIndex={index} amountOfRows={amountOfRows} />
              )
            }
          </td>
        ))}
      </tr>
      {state.type === 'preview'
        ? createPortal(
            <Preview item={item} properties={properties} />,
            state.container,
          )
        : null}
    </Fragment>
  );
});

const previewStyles = xcss({
  borderRadius: 'border.radius',
});

const previewItemStyles = css({
  /**
   * Each column in the preview will be no wider than a fully condensed column
   */
  maxWidth: minColumnWidth,
});

function Preview({
  item,
  properties,
}: {
  item: Item;
  properties: (keyof Item)[];
}) {
  return (
    <Box
      backgroundColor="elevation.surface"
      padding="space.100"
      xcss={previewStyles}
    >
      <Inline alignBlock="center" space="space.100">
        {properties.map(property => (
          <div key={property} css={[textOverflowStyles, previewItemStyles]}>
            {getField({ item, property })}
          </div>
        ))}
      </Inline>
    </Box>
  );
}
