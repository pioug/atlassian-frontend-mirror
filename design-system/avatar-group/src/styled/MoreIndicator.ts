import styled from 'styled-components';

import {
  AppearanceType,
  BORDER_WIDTH,
  getBorderRadius,
  getInnerStyles,
  SizeType,
} from '@atlaskit/avatar';
import { B200, DN400, DN70, N40, N500 } from '@atlaskit/theme/colors';
import { themed, withTheme } from '@atlaskit/theme/components';

const EXCESS_INDICATOR_FONT_SIZE: Record<SizeType, number> = {
  xsmall: 10,
  small: 10,
  medium: 11,
  large: 12,
  xlarge: 16,
  xxlarge: 16,
};

export const Outer = withTheme(styled.button<any>`
  ${getInnerStyles} background: 0;
`);

interface InnerProps {
  size: SizeType;
  appearance: AppearanceType;
  isActive?: boolean;
  isFocus?: boolean;
  isHover?: boolean;
}

export const Inner = withTheme(styled.span<InnerProps>`
  background-color: ${themed({ light: N40, dark: DN70 })};
  border-radius: ${getBorderRadius};
  align-items: center;
  box-shadow: 0 0 0
    ${props =>
      props.isFocus && !props.isActive ? `${BORDER_WIDTH[props.size]}px` : 0}
    ${B200};
  color: ${themed({ light: N500, dark: DN400 })};
  cursor: pointer;
  display: flex;
  flex-basis: 100%;
  flex-grow: 1;
  font-size: ${props => EXCESS_INDICATOR_FONT_SIZE[props.size || 'medium']}px;
  justify-content: center;
  transition: box-shadow 200ms;
`);
