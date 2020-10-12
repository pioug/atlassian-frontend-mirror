import styled from 'styled-components';
import { h700 } from '@atlaskit/theme/typography';
import gridSizeTimes from '../../util/gridSizeTimes';

export const Screen = styled.div`
  width: 640px;
  margin-bottom: ${gridSizeTimes(2)}px;
  > p {
    margin-top: ${gridSizeTimes(3)}px;
    margin-bottom: ${gridSizeTimes(2)}px;
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
`;

export const Title = styled.div`
  ${h700};
  margin-bottom: ${gridSizeTimes(3)}px;
  margin-top: 0;
`;

export const MainInformationList = styled.ul`
  > li b {
    font-weight: 600;
  }
`;

export const AccessibleSitesWrapper = styled.div`
  margin-top: ${gridSizeTimes(1.5)}px;
`;
