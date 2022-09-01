/** @jsx jsx */
import { css } from '@emotion/core';
import { token } from '@atlaskit/tokens';
import { N70 } from '@atlaskit/theme/colors';

export const DISABLED_BUTTON_COLOR = `${token(
  'color.text.disabled',
  N70,
)} !important`;

export const triggerStyle = ({ miniMode = false, disabled = false }) =>
  css({
    width: '32px',
    height: '32px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: '16px',
    ...(miniMode && {
      width: '24px',
      height: '24px',
    }),
    ...(disabled && {
      color: DISABLED_BUTTON_COLOR,
      cursor: 'not-allowed',
    }),
  });
