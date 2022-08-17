/** @jsx jsx */

import type { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import type { Edge } from '@atlaskit/drag-and-drop-hitbox/experimental/tree';
import { token } from '@atlaskit/tokens';

import DropIndicator from '../../src/experimental/tree-drop-indicator';

type TreeItemProps = {
  children: ReactNode;
  edge?: Edge;
  gap?: number;
};

const itemStyles = css({
  display: 'flex',
  minWidth: 120,
  padding: 8,
  alignItems: 'center',
  gap: 4,
  borderRadius: 3,
});

const dotIconStyles = css({
  width: 4,
  height: 4,
  margin: 10,
  background: token('color.icon', '#44546F'),
  borderRadius: '50%',
});

const DotIcon = () => <div css={dotIconStyles} />;

const TreeItem = ({ children, edge: edgeProp, gap }: TreeItemProps) => {
  const isInset = edgeProp === 'child';
  const edge = isInset ? 'bottom' : edgeProp;

  return (
    <DropIndicator
      hasTerminal
      inset={isInset ? 32 : 0}
      // TODO: fix me
      // @ts-ignore
      edge={edge ?? null}
      gap={gap}
    >
      {({ className }) => (
        <div className={className} css={itemStyles} data-testid="tree-item">
          <DotIcon />
          <span>{children}</span>
        </div>
      )}
    </DropIndicator>
  );
};

export default TreeItem;
