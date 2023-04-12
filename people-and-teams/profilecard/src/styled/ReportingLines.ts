import styled from '@emotion/styled';

import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { appLabelTextColor } from './constants';

export const ReportingLinesSection = styled.div`
  // Minor left margin to align better with existing icon fields
  margin-left: ${token('space.050', '4px')};
  margin-top: ${token('space.100', '8px')};
`;

export const ReportingLinesHeading = styled.h5`
  color: ${appLabelTextColor};
  font-size: ${gridSize() * 1.5}px;
  font-weight: 600;
  margin-bottom: ${token('space.100', '8px')};
`;

export const ManagerSection = styled.div`
  display: flex;
  align-items: center;
  margin: ${token('space.050', '4px')} ${token('space.050', '4px')};
`;

export const ManagerName = styled.span`
  font-size: ${gridSize() * 1.5}px;
  margin-left: ${token('space.100', '8px')};
`;

export const OffsetWrapper = styled.div`
  margin-top: ${token('space.050', '4px')};
  // Offset left margin so the avatar aligns with the heading
  margin-left: calc(-1 * ${token('space.050', '4px')});
`;
