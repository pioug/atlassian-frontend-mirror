import styled, { keyframes } from 'styled-components';
import { center, borderRadius } from '@atlaskit/media-ui';
import { themed } from '@atlaskit/theme/components';
import { N20, DN50, N50, DN100 } from '@atlaskit/theme/colors';
import { CardDimensions } from '../..';

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

export interface WrapperProps {
  dimensions: CardDimensions;
}

export const Wrapper = styled.div<WrapperProps>`
  ${center} background: ${themed({ light: N20, dark: DN50 })};
  color: ${themed({ light: N50, dark: DN100 })};
  ${borderRadius}
  max-height: 100%;
  max-width: 100%;
 
  ${props => `
      width: ${props.dimensions.width};
      height: ${props.dimensions.height};
    `}
  > span {
    animation: ${blinkLoadingAnimation} 0.8s infinite;
  }
`;
