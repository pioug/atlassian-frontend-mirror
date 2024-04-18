import { token } from '@atlaskit/tokens';
import { css, SerializedStyles } from '@emotion/react';

export const loadingViewContainer = css({
  display: 'flex',
  flexDirection: 'column',
  padding: token('space.200', '1rem'),
});

export const skeletonContainer = css({
  display: 'flex',
  flexDirection: 'column',
  // eslint-disable-next-line @atlaskit/design-system/use-tokens-space -- needs manual remediation
  gap: '0.625rem',
  alignItems: 'center',
});

export const getTitleStyles = (height: number): SerializedStyles => {
  return css({
    flex: '1 0 auto',
    height: `${height}rem`,
    span: {
      width: '100%',
    },
  });
};

export const titleBlockStyles = css({
  width: '100%',
  gap: token('space.100', '0.5rem'),
});
