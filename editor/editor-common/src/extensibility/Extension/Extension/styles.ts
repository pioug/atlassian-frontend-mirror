import { css } from '@emotion/react';

import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { wrapperDefault } from '../styles';

export const widerLayoutClassName = 'wider-layout';

export const wrapperStyle = css(wrapperDefault, {
  '&.without-frame': {
    background: 'transparent',
  },
  cursor: 'pointer',
  width: '100%',
  '.extension-overflow-wrapper:not(.with-body)': {
    overflowX: 'auto',
  },
  '&.with-border': {
    border: `1px solid transparent`, // adding this so macro doesn't jump when hover border is shown
  },
  '&.with-hover-border': {
    border: `1px solid ${token('color.border', N30)}`,
  },
});

export const header = css({
  padding: `${token('space.050', '4px')} ${token('space.050', '4px')} 0px`,
  verticalAlign: 'middle',
  '&.with-children:not(.without-frame)': {
    padding: `${token('space.050', '4px')} ${token('space.100', '8px')} ${token(
      'space.100',
      '8px',
    )}`,
  },
  '&.without-frame': {
    padding: 0,
  },
});

export const content = css({
  padding: token('space.100', '8px'),
  background: token('elevation.surface', 'white'),
  border: `1px solid ${token('color.border', N30)}`,
  borderRadius: token('border.radius', '3px'),
  cursor: 'initial',
  width: '100%',
  '&.remove-border': {
    border: 'none',
  },
});

export const contentWrapper = css({
  padding: `0 ${token('space.100', '8px')} ${token('space.100', '8px')}`,
  display: 'flex',
  justifyContent: 'center',
  '&.remove-padding': {
    padding: 0,
  },
});
