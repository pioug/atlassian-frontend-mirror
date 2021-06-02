import styled, { css, keyframes } from 'styled-components';

// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import {
  gridSize as akGridSize,
  layers as akLayers,
  colors,
  themed,
  typography,
} from '@atlaskit/theme';

const gridSize = akGridSize();

// @atlaskit/navigation has a specific z-index, so we need to layer the header
// components relative to that.
const navLayer = akLayers.navigation();
const layers = {
  header: navLayer - 10,
  blanket: navLayer - 5,
  slider: navLayer + 5,
};

const mobileHeaderHeight = 54;

const xPositioning = ({ side, isOpen }: { side: string; isOpen: boolean }) =>
  side === 'right'
    ? css`
        right: 0;
        transform: translateX(${isOpen ? '0' : '100vw'});
      `
    : css`
        left: 0;
        transform: translateX(${isOpen ? '0' : '-100vw'});
      `;

export const MobileNavSlider = styled.div<{
  topOffset: number | undefined;
  isOpen: boolean;
  side: string;
}>`
  height: ${(props) => `calc(100vh - ${props.topOffset}px)`};
  position: fixed;
  top: ${(props) => props.topOffset}px;
  transition: transform 0.2s ease-out;
  z-index: ${layers.slider};
  ${xPositioning};
`;

// make space so content below doesn't slip beneath the header
// since the content is `position: fixed`
export const MobilePageHeader = styled.header`
  height: ${mobileHeaderHeight}px;
`;

export const MobilePageHeaderContent = styled.div`
  align-items: center;
  background-color: ${themed({ light: colors.N20, dark: colors.DN10 })};
  box-sizing: border-box;
  display: flex;
  height: ${mobileHeaderHeight}px;
  padding: ${gridSize}px;
  position: fixed;
  top: ${(props) => props.topOffset}px;
  width: 100%;
  z-index: ${layers.header};
`;

const opacityIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const opacityOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

// @atlaskit/blanket has a z-index *higher* than @atlaskit/navigation,
// so we can't display the AK blanket underneath the navigation.
export const FakeBlanket = styled.div<{
  isOpen: boolean;
}>`
  background: ${colors.N100A};
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: ${layers.blanket};
  animation: ${(p) => (p.isOpen ? opacityIn : opacityOut)} 0.2s ease-out;
`;

// use proper h1 and header styles but for mobile we don't want a top margin
export const PageHeading = styled.h1`
  flex-grow: 1;
  margin-left: ${gridSize}px;
  ${typography.h500};
  && {
    margin-top: 0;
  }
`;
