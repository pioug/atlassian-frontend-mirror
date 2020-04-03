import styled from 'styled-components';
import { gridSize } from '../../shared-variables';
import { getProvided } from '../../theme/util';

const dividerLineHeight = 2;
const dividerTotalHeight = gridSize * 5;

const NavigationItemGroupSeparator = styled.div`
  margin-top: ${(dividerTotalHeight - dividerLineHeight) / 2}px;
  margin-bottom: ${(dividerTotalHeight - dividerLineHeight) / 2}px;
  margin-left: -${gridSize}px;
  height: ${dividerLineHeight}px;
  background: ${({ theme }) => getProvided(theme).keyline};
  border-radius: 1px;
`;

NavigationItemGroupSeparator.displayName = 'NavigationItemGroupSeparator';

export default NavigationItemGroupSeparator;
