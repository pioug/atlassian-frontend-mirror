import styled from 'styled-components';
import { zIndex } from '../../shared-variables';

const NavigationFixedContainer = styled.div`
  height: ${({ topOffset }) =>
    topOffset ? `calc(100vh - ${topOffset}px)` : '100vh'};
  /* This transition height is borrowed from banner specifically to make the
  shortening occur in line with banner's lengthening. */
  transition: height 0.25s ease-in-out;
  display: flex;
  flex-direction: row;
  position: fixed;
  left: 0;
  /* force this to have the width of the Spacer above */
  width: inherit;
  z-index: ${zIndex.base};
`;

NavigationFixedContainer.displayName = 'NavigationFixedContainer';
export default NavigationFixedContainer;
