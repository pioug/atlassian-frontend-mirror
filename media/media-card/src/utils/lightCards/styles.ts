import { css, keyframes } from '@emotion/react';
import { token } from '@atlaskit/tokens';
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
  background: ${themed({
    light: token('color.background.neutral', N20),
    dark: token('color.background.neutral', DN50),
  })({ theme })};
  color: ${themed({
    light: token('color.icon', N50),
    dark: token('color.icon', DN100),
  })({ theme })};
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
