import styled from 'styled-components';
import { whenCollapsedAndNotInOverflowDropdown } from '../../theme/util';
import { truncate } from '../../utils/mixins';
import { gridSize } from '../../shared-variables';

const groupTitleFontSize = 11;

const NavigationItemGroupTitle = styled.div`
  font-size: ${groupTitleFontSize}px;
  line-height: ${(gridSize * 2) / groupTitleFontSize};
  font-weight: 600;
  ${truncate()} ${whenCollapsedAndNotInOverflowDropdown`
    display: none;
  `};
`;

NavigationItemGroupTitle.displayName = 'NavigationItemGroupTitle';
export default NavigationItemGroupTitle;
