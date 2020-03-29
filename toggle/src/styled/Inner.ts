import styled from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { N0, DN600, N70, DN30 } from '@atlaskit/theme/colors';
import { transition } from './constants';
import { StyledProps } from '../types';

const color = themed({ light: N0, dark: DN600 });
const disabledColor = themed({ light: N70, dark: DN30 });

const getFlexDirection = ({ isChecked }: StyledProps) =>
  isChecked ? 'row' : 'row-reverse';

export default styled.div`
  color: ${({ isDisabled }) => (isDisabled ? disabledColor : color)};
  display: flex;
  flex-direction: ${getFlexDirection};
  height: 100%;
  transition: ${transition};
  width: 100%;
`;
