/** @jsx jsx */
import { css } from '@emotion/react';
import { N90, B400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const countStyle = css({
  fontSize: 11,
  color: token('color.text.subtlest', N90),
  overflow: 'hidden',
  position: 'relative',
  padding: '4px 8px 4px 0',
  lineHeight: '14px',
});

export const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
});

export const highlightStyle = css({
  color: token('color.text.selected', B400),
});

export const counterLabelStyle = css({
  fontVariantNumeric: 'tabular-nums',
});
