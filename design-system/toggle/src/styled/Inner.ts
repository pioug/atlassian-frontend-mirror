import styled from 'styled-components';

import { DN30, DN600, N0, N70 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';

import { StyledProps } from '../types';

import { transition } from './constants';

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
