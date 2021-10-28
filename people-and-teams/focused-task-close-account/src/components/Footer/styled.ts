import styled from 'styled-components';
import gridSizeTimes from '../../util/gridSizeTimes';

export const FooterOuter = styled.div`
  display: flex;
  width: 100%;
  max-width: 640px;
  @media screen and (max-width: 640px) {
    justify-content: space-evenly;
    padding-bottom: ${gridSizeTimes(3)}px;
    align-items: center;
  }
  justify-content: space-between;
  margin-top: ${gridSizeTimes(4)}px;
`;
