import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { center, borderRadius } from '@atlaskit/media-ui';
import { themed } from '@atlaskit/theme/components';
import { N20, DN50, N50, DN100 } from '@atlaskit/theme/colors';
import { WrapperProps } from './types';

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
