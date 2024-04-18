import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

export const tabsWrapperStyles = css({
  marginTop: token('space.150', '12px'),
  marginLeft: token('space.negative.100', '-8px'),
  marginRight: token('space.negative.100', '-8px'),
});

export const spinnerContainerStyles = css({
  minHeight: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  flexGrow: 1,
});

export const flexColumnStyles = css({
  display: 'flex',
  flexDirection: 'column',
});
