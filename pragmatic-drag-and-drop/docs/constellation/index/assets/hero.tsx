import React, { useEffect, useRef, useState } from 'react';

import invariant from 'tiny-invariant';

import { LinkButton } from '@atlaskit/button/new';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { easeInOut, mediumDurationMs } from '@atlaskit/motion';
import { autoScrollWindowForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import Logo from './logo';

type State = 'idle' | 'preview' | 'dragging';

const baseStyles = xcss({
  transition: `opacity ${mediumDurationMs}ms ${easeInOut}`,
});

const stateStyles: {
  [Key in State]: ReturnType<typeof xcss> | undefined;
} = {
  dragging: xcss({
    opacity: 0.4,
  }),
  idle: xcss({
    cursor: 'grab',
  }),
  preview: undefined,
};

export default function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<State>('idle');

  useEffect(() => {
    const element = ref.current;
    invariant(element);
    return combine(
      draggable({
        element,
        getInitialDataForExternal: () => ({
          'text/uri-list': window.location.href,
        }),
        onGenerateDragPreview() {
          setState('preview');
        },
        onDragStart() {
          setState('dragging');
        },
        onDrop() {
          setState('idle');
        },
      }),
      // enabling window auto scrolling for a bit of delight
      autoScrollWindowForElements({
        canScroll({ source }) {
          return source.element === element;
        },
      }),
    );
  }, []);

  return (
    <Stack alignInline="center" space="space.100">
      <Box ref={ref} xcss={[baseStyles, stateStyles[state]]}>
        <Logo mode={state === 'preview' ? 'alternative' : 'standard'} />
      </Box>
      <LinkButton
        iconAfter={ShortcutIcon}
        href="https://github.com/atlassian/pragmatic-drag-and-drop"
      >
        Github
      </LinkButton>
    </Stack>
  );
}
