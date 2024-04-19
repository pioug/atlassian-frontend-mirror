import styled from '@emotion/styled';

import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { appLabelTextColor } from './constants';

export const ReportingLinesSection = styled.div({
  // Minor left margin to align better with existing icon fields
  marginLeft: token('space.050', '4px'),
  marginTop: token('space.100', '8px'),
});

export const ReportingLinesHeading = styled.h3({
  color: appLabelTextColor,
  fontSize: `${gridSize() * 1.5}px`,
  fontWeight: 600,
  marginBottom: token('space.100', '8px'),
});

export const ManagerSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  margin: `${token('space.050', '4px')} ${token('space.050', '4px')}`,
});

export const ManagerName = styled.span({
  fontSize: `${gridSize() * 1.5}px`,
  marginLeft: token('space.100', '8px'),
});

export const OffsetWrapper = styled.div({
  marginTop: token('space.050', '4px'),
  // Offset left margin so the avatar aligns with the heading
  marginLeft: token('space.negative.050', '-4px'),
});
