/** @jsx jsx */

import type { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { token } from '@atlaskit/tokens';

import Line from '../src/internal/line';

import Layout from './internal/layout';

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
});

const Card = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div css={cardStyles} className={className}>
      {children}
    </div>
  );
};

export default function ClosestEdgeExample() {
  return (
    <Layout>
      {/* TODO: <Line edge="bottom" inset={8}> */}
      <Line edge="bottom">
        {({ className }) => <Card className={className}>Test</Card>}
      </Line>
      {/* TODO: <Line edge="top" inset={8}> */}
      <Line edge="top">
        {({ className }) => <Card className={className}>Test</Card>}
      </Line>
      {/* TODO: <Line edge="left" inset={8}> */}
      <Line edge="left">
        {({ className }) => <Card className={className}>Test</Card>}
      </Line>
      {/* TODO: <Line edge="right" inset={8}> */}
      <Line edge="right">
        {({ className }) => <Card className={className}>Test</Card>}
      </Line>
    </Layout>
  );
}
