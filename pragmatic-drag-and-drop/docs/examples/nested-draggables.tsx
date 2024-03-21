/** @jsx jsx */
import { Fragment, useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { token } from '@atlaskit/tokens';

import { fallbackColor } from './util/fallback';
import { GlobalStyles } from './util/global-styles';

const itemStyles = css({
  display: 'flex',
  padding: 'var(--grid)',
  gap: 'var(--grid)',
  flexDirection: 'column',
  background: token('color.background.accent.blue.subtler', fallbackColor),
  border: `var(--border-width) solid ${token(
    'color.border.accent.blue',
    fallbackColor,
  )}`,
  borderRadius: 'var(--border-radius)',
  userSelect: 'none',
});

const itemDisabledStyles = css({
  background: token('color.background.disabled', fallbackColor),
});

const itemContentStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'row',
});

const itemIdStyles = css({
  margin: 0,
});

function Item({
  itemId,
  children,
}: {
  itemId: string;
  children?: React.ReactElement | React.ReactElement[];
}) {
  const [isDragAllowed, setDragIsAllowed] = useState<boolean>(true);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    invariant(element);
    return draggable({
      element,
      canDrag: () => isDragAllowed,
    });
  }, [isDragAllowed]);

  return (
    <div
      ref={ref}
      css={[itemStyles, !isDragAllowed ? itemDisabledStyles : undefined]}
    >
      <div css={itemContentStyles}>
        <label>
          <input
            onChange={() => setDragIsAllowed(value => !value)}
            type="checkbox"
            checked={isDragAllowed}
          ></input>
          Dragging allowed?
        </label>
        <small css={itemIdStyles}>id: {itemId}</small>
      </div>
      {children}
    </div>
  );
}

const dropTargetStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `var(--border-width) solid ${token(
    'color.border.discovery',
    fallbackColor,
  )}`,
  borderRadius: 'var(--border-radius)',
});
function DropTarget() {
  return <div css={dropTargetStyles}>Drop on me!</div>;
}

const rootStyles = css({
  display: 'grid',
  gap: 'calc(var(--grid) * 2)',
  gridTemplateColumns: '1fr 1fr',
});

export default function Example() {
  return (
    <Fragment>
      <GlobalStyles />
      <div css={rootStyles}>
        <Item itemId="1">
          <Item itemId="1-1">
            <Item itemId="1-1-1" />
            <Item itemId="1-1-2" />
          </Item>
          <Item itemId="1-2">
            <Item itemId="1-2-1" />
            <Item itemId="1-2-2" />
          </Item>
        </Item>
        <DropTarget />
      </div>
    </Fragment>
  );
}
