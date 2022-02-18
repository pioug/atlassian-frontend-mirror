/** @jsx jsx */
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { panelWidth } from './constants';

export const RightSidePanelDrawer = styled.div`
  width: ${panelWidth}px;
  flex: 0 0 ${panelWidth}px;
  position relative;
  overflow: hidden;
`;

export const RightSidePanelDrawerContent = styled.div`
  background-color: ${token('elevation.surface.overlay', 'white')};
  box-sizing: border-box;
  flex: 1;
  border-left: 3px solid ${token('color.border', colors.N30)};
  overflow: hidden;
  flex-direction: column;
  width: ${panelWidth}px;
  height: 100%;
  position: fixed;
`;
