/** @jsx jsx */
import { Fragment, memo, useEffect, useRef, useState } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/react';
import invariant from 'tiny-invariant';

import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import { easeInOut } from '@atlaskit/motion/curves';
import { smallDurationMs } from '@atlaskit/motion/durations';
import { token } from '@atlaskit/tokens';

import battery from './icons/battery.png';
import drill from './icons/drill.png';
import koala from './icons/koala.png';
import ui from './icons/ui.png';
import wallet from './icons/wallet.png';
import yeti from './icons/yeti.png';
import { GlobalStyles } from './util/global-styles';

const itemStyles = css({
  objectFit: 'cover',
  width: '100%',
  boxSizing: 'border-box',
  background: token('elevation.surface.raised', '#FFF'),
  padding: token('space.050', '4px'),
  borderRadius: token('border.radius.100', '4px'),
  boxShadow: token('elevation.shadow.raised', 'none'),
  transition: `all ${smallDurationMs}ms ${easeInOut}`,
});

type State = 'idle' | 'dragging' | 'over';

const itemStateStyles: { [Key in State]: undefined | SerializedStyles } = {
  idle: css({
    ':hover': {
      background: token('elevation.surface.overlay', '#FFF'),
      boxShadow: token('elevation.shadow.overlay', 'none'),
    },
  }),
  dragging: css({
    filter: 'grayscale(0.8)',
  }),
  over: css({
    transform: 'scale(1.1) rotate(8deg)',
    filter: 'brightness(1.15)',
    boxShadow: token('elevation.shadow.overlay', 'none'),
  }),
};

const Item = memo(function Item({ src }: { src: string }) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [state, setState] = useState<State>('idle');

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({ type: 'grid-item', src }),
        onDragStart: () => setState('dragging'),
        onDrop: () => setState('idle'),
      }),
      dropTargetForElements({
        element: el,
        getData: () => ({ src }),
        getDropEffect: () => 'link',
        canDrop: ({ source }) =>
          source.data.type === 'grid-item' && source.data.src !== src,
        onDragEnter: () => setState('over'),
        onDragLeave: () => setState('idle'),
        onDrop: () => setState('idle'),
      }),
    );
  }, [src]);

  return <img css={[itemStyles, itemStateStyles[state]]} ref={ref} src={src} />;
});

const gridStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 96px)',
  gap: 'var(--grid)',
});

export default function Grid() {
  const [items, setItems] = useState<string[]>(() => [
    battery,
    drill,
    koala,
    ui,
    wallet,
    yeti,
  ]);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) {
          return;
        }
        const destinationSrc = destination.data.src;
        const startSrc = source.data.src;

        if (typeof destinationSrc !== 'string') {
          return;
        }

        if (typeof startSrc !== 'string') {
          return;
        }

        // swapping item positions
        const updated = [...items];
        updated[items.indexOf(startSrc)] = destinationSrc;
        updated[items.indexOf(destinationSrc)] = startSrc;

        setItems(updated);
      },
    });
  }, [items]);

  return (
    <Fragment>
      <GlobalStyles />
      <div css={gridStyles}>
        {items.map(src => (
          <Item src={src} key={src} />
        ))}
      </div>
    </Fragment>
  );
}
