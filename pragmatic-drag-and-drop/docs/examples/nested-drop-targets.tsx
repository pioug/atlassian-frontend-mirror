/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { fallbackColor } from './util/fallback';
import { GlobalStyles } from './util/global-styles';

const dropTargetStyles = css({
  display: 'flex',
  padding: 'calc(var(--grid) * 2)',
  gap: 'var(--grid)',
  flexDirection: 'column',
  border: `var(--border-width) solid ${token(
    'color.border.input',
    fallbackColor,
  )}`,
  borderRadius: 'var(--border-width)',
});

function DropTarget({
  targetId,
  children,
}: {
  targetId: string;
  children?: React.ReactNode;
}) {
  return (
    <div css={dropTargetStyles}>
      <strong>{targetId}</strong>
      {children}
    </div>
  );
}

const draggableStyles = css({
  padding: 'calc(var(--grid) * 2)',
  border: `var(--border-width) solid ${token(
    'color.border.input',
    fallbackColor,
  )}`,
  borderRadius: 'var(--border-width)',
});

function Draggable() {
  return (
    <div css={draggableStyles}>
      <strong>Drag me 👋</strong>
    </div>
  );
}

const exampleStyles = css({
  display: 'grid',
  maxWidth: '600px',
  alignItems: 'start',
  gap: 'calc(var(--grid) * 2)',
  gridTemplateColumns: '1fr 1fr',
});

export default function Example() {
  return (
    <Fragment>
      <GlobalStyles />
      <div css={exampleStyles}>
        <Draggable />
        <DropTarget targetId="Grandparent 👵">
          <DropTarget targetId="Parent 1 👩">
            <DropTarget targetId="Child 1 🧒" />
            <DropTarget targetId="Child 2 👧" />
          </DropTarget>
          <DropTarget targetId="Parent 2 👨">
            <DropTarget targetId="Child 3 🧑‍🦱" />
            <DropTarget targetId="Child 4 👶" />
          </DropTarget>
        </DropTarget>
      </div>
    </Fragment>
  );
}
