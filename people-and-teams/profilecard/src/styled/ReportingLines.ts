import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme/constants';

import { appLabelTextColor } from '../styled/constants';

export const ReportingLinesSection = styled.div`
  // Minor left margin to align better with existing icon fields
  margin-left: ${gridSize() / 2}px;
  margin-top: ${gridSize()}px;
`;

export const ReportingLinesHeading = styled.h5`
  color: ${appLabelTextColor};
  font-size: ${gridSize() * 1.5}px;
  font-weight: 600;
  margin-bottom: ${gridSize()}px;
`;

export const ManagerSection = styled.div`
  display: flex;
  align-items: center;
  margin: ${gridSize() / 2}px ${gridSize() / 2}px;
`;

export const ManagerName = styled.span`
  font-size: ${gridSize() * 1.5}px;
  margin-left: ${gridSize()}px;
`;

export const OffsetWrapper = styled.div`
  margin-top: ${gridSize() / 2}px;
  // Offset left margin so the avatar aligns with the heading
  margin-left: -${gridSize() / 2}px;
`;
