/** @jsx jsx */
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { panelWidth } from './constants';

export const RightSidePanelDrawer = styled.div`
  background-color: white;
  width: ${panelWidth}px;
  flex: 0 0 ${panelWidth}px;
  position relative;
  overflow: hidden;
`;

export const RightSidePanelDrawerContent = styled.div`
  box-sizing: border-box;
  flex: 1;
  border-left: 3px solid ${colors.N30};
  overflow: hidden;
  flex-direction: column;
  width: ${panelWidth}px;
  height: 100%;
  position: fixed;
`;
