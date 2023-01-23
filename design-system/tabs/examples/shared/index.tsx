/* eslint-disable @repo/internal/react/use-primitives */
/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { N20, N200 } from '@atlaskit/theme/colors';
import { borderRadius as getBorderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const borderRadius = getBorderRadius();

const panelStyles = css({
  display: 'flex',
  // TODO Delete this comment after verifying spacing token -> previous value ``${gridSize * 2}px``
  marginTop: token('spacing.scale.200', '16px'),
  // TODO Delete this comment after verifying spacing token -> previous value ``${gridSize}px``
  marginBottom: token('spacing.scale.100', '8px'),
  // TODO Delete this comment after verifying spacing token -> previous value ``${gridSize * 4}px``
  padding: token('spacing.scale.400', '32px'),
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  flexGrow: 1,
  backgroundColor: token('color.background.neutral', N20),
  borderRadius: `${borderRadius}px`,
  color: token('color.text.subtlest', N200),
  fontSize: '4em',
  fontWeight: token('font.weight.medium', '500'),
});

export const Panel = ({
  children,
  testId,
}: {
  children: ReactNode;
  testId?: string;
}) => (
  <div css={panelStyles} data-testid={testId}>
    {children}
  </div>
);
