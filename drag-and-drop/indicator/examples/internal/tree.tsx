/** @jsx jsx */

import type { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { token } from '@atlaskit/tokens';

const treeStyles = css({
  display: 'flex',
  width: 240,
  padding: 8,
  flexDirection: 'column',
  background: token('elevation.surface.sunken', '#F7F8F9'),
});

const Tree = ({
  children,
  testId,
}: {
  children: ReactNode;
  testId?: string;
}) => {
  return (
    <div css={treeStyles} data-testid={testId}>
      {children}
    </div>
  );
};

export default Tree;
