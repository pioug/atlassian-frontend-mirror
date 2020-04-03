import styled from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { N0, DN600, DN0 } from '@atlaskit/theme/colors';
import { getHeight, paddingUnitless, transition } from './constants';
import { StyledProps } from '../types';

const backgroundColor = themed({ light: N0, dark: DN600 });
const backgroundColorChecked = themed({ light: N0, dark: DN0 });
const backgroundColorDisabled = themed({ light: N0, dark: DN0 });

const getTransform = ({ isChecked, size }: StyledProps) =>
  isChecked ? `translateX(${getHeight({ size })}px)` : 'initial';

const getBackgroundColor = ({
  isChecked,
  isDisabled,
  ...rest
}: StyledProps) => {
  if (isDisabled) return backgroundColorDisabled(rest);
  if (isChecked) return backgroundColorChecked(rest);
  return backgroundColor(rest);
};

export default styled.span`
  background-color: ${getBackgroundColor};
  border-radius: 50%;
  bottom: ${2 * paddingUnitless}px;
  content: '';
  height: ${props => getHeight(props) - paddingUnitless * 2}px;
  left: ${2 * paddingUnitless}px;
  position: absolute;
  transform: ${getTransform};
  transition: ${transition};
  width: ${props => getHeight(props) - paddingUnitless * 2}px;
`;
