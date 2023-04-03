/** @jsx jsx */
import { css } from '@emotion/react';
import { borderRadius } from '@atlaskit/theme/constants';
import { N0, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const pickerStyle = css({
  verticalAlign: 'middle',
  '&.miniMode': {
    display: 'inline-block',
  },
});

export const contentStyle = css({
  display: 'flex',
});

export const popupWrapperStyle = css({
  ':focus': {
    outline: 'none',
  },
});

export const popupStyle = css({
  background: token('elevation.surface.overlay', N0),
  borderRadius: `${borderRadius()}px`,
  boxShadow: token(
    'elevation.shadow.overlay',
    `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`,
  ),
  '&> div': {
    boxShadow: undefined,
    marginTop: '4px',
    marginBottom: '4px',
  },
});
