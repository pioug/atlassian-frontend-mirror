/** @jsx jsx */

import type { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import type { Edge } from '@atlaskit/drag-and-drop-hitbox/types';
import { token } from '@atlaskit/tokens';

import { DropIndicator } from '../../src/experimental/tree-item';

type TreeItemProps = {
  children: ReactNode;
  edge?: Edge | 'child';
  gap?: string;
};

const itemStyles = css({
  display: 'flex',
  minWidth: 120,
  padding: 8,
  alignItems: 'center',
  gap: 4,
  borderRadius: 3,
  position: 'relative',
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

  // TODO: calc `inset` from `--grid`
  return (
    <div css={itemStyles} data-testid="tree-item">
      <DotIcon />
      <span>{children}</span>
      {edge && (
        <DropIndicator inset={isInset ? `32px` : `0px`} edge={edge} gap={gap} />
      )}
    </div>
  );
};

export default TreeItem;
