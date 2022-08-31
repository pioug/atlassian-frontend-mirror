/** @jsx jsx */

import type { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { token } from '@atlaskit/tokens';

import { DropIndicator, DropIndicatorProps } from '../../src/box';

type CardProps = { children: ReactNode } & Pick<
  DropIndicatorProps,
  'edge' | 'gap'
>;

const cardStyles = css({
  display: 'grid',
  minWidth: 120,
  padding: '16px 20px',
  background: token('elevation.surface.raised', '#FFF'),
  borderRadius: 3,
  boxShadow: token(
    'elevation.shadow.raised',
    'rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.31) 0px 0px 1px',
  ),
  placeItems: 'center',
  position: 'relative',
});

const Card = ({ children, edge, gap }: CardProps) => {
  return (
    <div css={cardStyles} data-testid="card">
      <strong>{children}</strong>
      <DropIndicator edge={edge} gap={gap} />
    </div>
  );
};

export default Card;
