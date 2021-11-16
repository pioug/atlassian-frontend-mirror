import styled from '@emotion/styled';

import { smallDurationMs } from '@atlaskit/motion/durations';
import { N400, text } from '@atlaskit/theme/colors';
import { fontSize, gridSize } from '@atlaskit/theme/constants';

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: ${gridSize() / 2}px;
`;

export const TitleWrapper = styled.span`
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  font-weight: 500;
  margin-left: ${gridSize()}px;
  font-style: inherit;
  color: ${text};
`;

export const ScopesItemsWrapper = styled.div`
  display: flex-basic;
  flex-direction: row;
  flex-basic: 100%;
  color: #172b4d;
  font-weight: 400;
`;

export const ScopesActionWrapper = styled.div`
  color: ${N400};
  font-weight: 500;
  font-size: ${fontSize()}px;
  margin-left: ${gridSize() * 4}px;
`;

export const ExpandAction = styled.span<{ isExpanded: boolean }>`
  transform: rotate(${props => (props.isExpanded ? 90 : 0)}deg);
  transition: transform ${smallDurationMs}ms;
`;

export const ListWrapper = styled.ul`
  ::first-of-type {
    margin-left: ${gridSize()}px;
    color: #172b4d;
    font-weight: 400;
  }
`;

export const ExpandedView = styled.div`
  padding: ${gridSize()}px ${gridSize() * 2}px 0 ${gridSize() * 2}px;
  text-align: left;
`;
