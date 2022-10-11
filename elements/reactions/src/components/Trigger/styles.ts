/** @jsx jsx */
import { css } from '@emotion/core';
import { token } from '@atlaskit/tokens';
import { N70, N20, N40 } from '@atlaskit/theme/colors';

export const DISABLED_BUTTON_COLOR = `${token(
  'color.text.disabled',
  N70,
)} !important`;

export const triggerStyle = ({ miniMode = false, disabled = false }) =>
  css({
    minWidth: '32px',
    height: '32px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: '16px',
    ...(miniMode && {
      height: '24px',
      padding: 0,
      border: `1px solid ${token('color.border', N40)}`,
      borderRadius: '20px',
    }),
    ...(disabled && {
      color: DISABLED_BUTTON_COLOR,
      cursor: 'not-allowed',
    }),
    '&:hover': {
      background: `${token('color.background.neutral.subtle.hovered', N20)}`,
    },
  });
