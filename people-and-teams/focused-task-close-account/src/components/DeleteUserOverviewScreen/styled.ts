import styled from 'styled-components';
import { B500, B200 } from '@atlaskit/theme/colors';
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

export const SectionMessageOuter = styled.div`
  margin: ${gridSizeTimes(3)}px 0;
`;

export const MainInformationList = styled.ul`
  > li b {
    font-weight: 600;
  }
  p + ul {
    margin-top: ${gridSizeTimes(1.5)}px;
  }
`;

export const IconHoverWrapper = styled.span`
  color: ${B500};
  padding-left: ${gridSizeTimes(0.5)}px;
  &:hover {
    color: ${B200};
  }
`;

export const InlineDialogContent = styled.div`
  li {
    margin-left: ${gridSizeTimes(3)}px;
    margin-top: ${gridSizeTimes(1)}px;
    padding-left: ${gridSizeTimes(1)}px;
  }
`;
