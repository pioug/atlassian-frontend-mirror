import styled from 'styled-components';
import { SizeType } from '@atlaskit/avatar';
import { themed, withTheme } from '@atlaskit/theme/components';
import { N40, DN70, B200, N500, DN400 } from '@atlaskit/theme/colors';
import {
  AppearanceType,
  getBorderRadius,
  getInnerStyles,
  BORDER_WIDTH,
} from '@atlaskit/avatar';

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
