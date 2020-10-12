import styled from 'styled-components';
import gridSizeTimes from '../../util/gridSizeTimes';

export const AccessibleSitesList = styled.ul`
  list-style: none;
  padding-left: 0;
  font-weight: 600;
  margin-left: ${gridSizeTimes(1)}px;
  > li {
    margin-top: 0;
  }
`;

export const AccessibleSitesListFootnote = styled.div`
  padding-left: 0;
  margin-left: ${gridSizeTimes(1)}px;
`;

export const ButtonWrapper = styled.div`
  padding: 0 ${gridSizeTimes(1)}px;
`;
