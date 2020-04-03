import styled from 'styled-components';
import { globalItemSizes } from '../../shared-variables';

const GlobalNavigationSecondaryContainer = styled.div`
  /* align-self: center is used to horizontally align the global secondary nav items
     to the center of the container nav when the nav items are shown in a
     collapsed container nav */
  align-self: center;
  /* required to keep the secondary actions at the bottom */
  flex-grow: 0;

  /* Required to fix dropdowns in Safari. Won't be needed once layering is changed */
  width: ${globalItemSizes.small}px;
`;

GlobalNavigationSecondaryContainer.displayName =
  'GlobalNavigationSecondaryContainer';
export default GlobalNavigationSecondaryContainer;
