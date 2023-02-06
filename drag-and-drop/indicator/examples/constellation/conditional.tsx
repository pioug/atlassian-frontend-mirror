/** @jsx jsx */

import { useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import type { Edge } from '@atlaskit/drag-and-drop-hitbox/types';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import { token } from '@atlaskit/tokens';

import { DropIndicator } from '../../src/box';

const itemStyles = css({
  position: 'relative',
  display: 'inline-block',
  padding: token('space.200', '16px'),
  border: `1px solid ${token('color.border', 'lightgrey')}`,
});

export default function Conditional() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);
    return combine(
      draggable({
        element: el,
      }),
      dropTargetForElements({
        element: el,
        // just being simple and always using the 'top' edge
        // ideally this is set using our `@atlaskit/drag-and-drop-hitbox package
        onDragStart: () => setClosestEdge('top'),
        onDragEnter: () => setClosestEdge('top'),
        onDrop: () => setClosestEdge(null),
        onDragLeave: () => setClosestEdge(null),
      }),
    );
  }, []);

  return (
    <div ref={ref} css={itemStyles}>
      <span>Drag me</span>
      {/* DropIndicator is being conditionally rendered */}
      {closestEdge && <DropIndicator edge={closestEdge} />}
    </div>
  );
}
