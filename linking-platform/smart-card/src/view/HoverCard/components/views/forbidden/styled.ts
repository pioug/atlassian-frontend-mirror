import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';

const titleFontWeight = '600';

export const titleBlockStyles = css({
  justifyContent: 'center',
  fontWeight: titleFontWeight,
  marginTop: token('space.100', '8px'),
});

export const mainTextStyles = css({
  display: 'inline',
  justifyContent: 'center',
  marginTop: token('space.0', '0px'),
  fontSize: '0.75rem',
  textAlign: 'center',
});

export const connectButtonStyles = css({
  justifyContent: 'center',
  marginTop: token('space.100', '8px'),
});
