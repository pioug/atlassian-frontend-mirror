import { css } from '@emotion/react';
import { keyframes } from '@emotion/react';
import { center, borderRadius } from '@atlaskit/media-ui';
import { themed } from '@atlaskit/theme/components';
import { N20, DN50, N50, DN100 } from '@atlaskit/theme/colors';
import { WrapperProps } from './types';

export const blinkLoadingAnimation = keyframes`
  0%{
    opacity: 1;
  }

  50%{
    opacity: 0.6;
  }

  100%{
    opacity: 1;
  }
`;

export const wrapperStyles = ({ dimensions, theme }: WrapperProps) => css`
  ${center}
  background: ${themed({ light: N20, dark: DN50 })({ theme })};
  color: ${themed({ light: N50, dark: DN100 })({ theme })};
  ${borderRadius}
  max-height: 100%;
  max-width: 100%;
  width: ${dimensions.width};
  height: ${dimensions.height};
`;

export const animatedWrapperStyles = (props: WrapperProps) => css`
  ${wrapperStyles(props)}
  > span {
    animation: ${blinkLoadingAnimation} 0.8s infinite;
  }
`;
