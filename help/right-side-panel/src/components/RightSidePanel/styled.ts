/** @jsx jsx */
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { panelWidth } from './constants';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const RightSidePanelDrawer = styled.div({
  width: `${panelWidth}px`,
  flex: `0 0 ${panelWidth}px`,
  position: 'relative',
  overflow: 'hidden',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const RightSidePanelDrawerContent = styled.div({
  backgroundColor: token('elevation.surface.overlay', 'white'),
  boxSizing: 'border-box',
  flex: 1,
  borderLeft: `3px solid ${token('color.border', colors.N30)}`,
  overflow: 'hidden',
  flexDirection: 'column',
  width: `${panelWidth}px`,
  height: '100%',
  position: 'fixed',
});
