/* eslint-disable @atlaskit/design-system/no-nested-styles */
/** @jsx jsx */
import { Fragment, useEffect, useRef } from 'react';

import { css, Global, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
import { Box, xcss } from '@atlaskit/primitives';

import { autoScrollWindowForElements } from '../src/entry-point/element';

const globalStyles = css({
  ':root': {
    '--grid': '8px',
  },
  body: {
    height: '150vh',
  },
});

type ItemType = {
  id: string;
};

const itemStyles = xcss({
  padding: 'space.050',
  borderWidth: 'border.width',
  borderStyle: 'solid',
  borderColor: 'color.border.brand',
  borderRadius: 'border.radius',
  backgroundColor: 'color.background.accent.lime.subtlest',
});

function Item({ item }: { item: ItemType }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    invariant(element);
    return draggable({
      element,
      getInitialData: () => item,
    });
  }, [item]);
  return (
    <Box xcss={itemStyles} ref={ref}>
      {item.id}
    </Box>
  );
}

const items: ItemType[] = Array.from({ length: 200 }).map((_, i) => ({
  id: `id:${i}`,
}));

const listStyles = xcss({
  display: 'flex',
  flexDirection: 'column',
  gap: 'space.050',
  width: 'size.1000',
});

export default function WindowScroll() {
  useEffect(() => {
    return autoScrollWindowForElements({});
  });
  return (
    <Fragment>
      <Global styles={globalStyles} />
      <Box xcss={listStyles}>
        {items.map(item => (
          <Item item={item} key={item.id} />
        ))}
      </Box>
    </Fragment>
  );
}
