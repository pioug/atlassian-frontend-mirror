import styled from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import * as colors from '@atlaskit/theme/colors';
import { itemSpacing } from '../../constants';
import { IconType } from '../../types';

interface Props {
  appearance: IconType;
  isHovered?: boolean;
  isOpen?: boolean;
}

type themedType = (appearance: Props) => string;

const getBaseColor: themedType = themed('appearance', {
  connectivity: { light: colors.B400, dark: colors.B100 },
  confirmation: { light: colors.G300, dark: colors.G300 },
  info: { light: colors.P300, dark: colors.P300 },
  warning: { light: colors.Y300, dark: colors.Y300 },
  error: { light: colors.R400, dark: colors.R400 },
});

const getHoverColor: themedType = themed('appearance', {
  connectivity: { light: colors.B300, dark: colors.B75 },
  confirmation: { light: colors.G200, dark: colors.G200 },
  info: { light: colors.P200, dark: colors.P200 },
  warning: { light: colors.Y200, dark: colors.Y200 },
  error: { light: colors.R300, dark: colors.R300 },
});

const getColor = (props: Props) => {
  if (props.isHovered || props.isOpen) return getHoverColor(props);
  return getBaseColor(props);
};

const IconWrapper = styled.span`
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  padding: 0 ${itemSpacing};
  color: ${getColor};
`;

export default IconWrapper;
