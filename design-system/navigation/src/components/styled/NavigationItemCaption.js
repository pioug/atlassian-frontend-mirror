import styled from 'styled-components';
import { getProvided } from '../../theme/util';
import { layout } from '../../shared-variables';

const NavigationItemCaption = styled.span`
  color: ${({ theme }) => getProvided(theme).subText};
  margin-left: ${layout.padding.side}px;
`;

NavigationItemCaption.displayName = 'NavigationItemCaption';
export default NavigationItemCaption;
