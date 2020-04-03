import styled from 'styled-components';
import {
  layout,
  containerTitleBottomMargin,
  drawerContainerHeaderAnimationSpeed,
  gridSize,
  globalItemSizes,
} from '../../shared-variables';
import { whenCollapsed } from '../../theme/util';

const padding = {
  top: gridSize,
  right: gridSize * 2,
  bottom: gridSize,
  left: gridSize * 2,
};

const minHeight = props => {
  if (props.isInDrawer) {
    // the header content isn't rendered in a full-width Drawer
    return 0;
  }
  // the height of the container icon and the margin below it
  return `${padding.bottom +
    padding.top +
    globalItemSizes.medium +
    containerTitleBottomMargin}px`;
};

const flexBasis = props => {
  if (props.isFullWidth) {
    return 0;
  }
  if (props.isInDrawer) {
    return `
      ${props.iconOffset - layout.padding.top}px
    `;
  }
  return 'auto';
};

const ContainerHeaderWrapper = styled.div`
  flex-basis: ${flexBasis};
  flex-shrink: 0;
  min-height: ${minHeight};
  overflow: hidden;
  padding: 0 ${padding.right}px 0 ${padding.left}px;
  transition: flex-basis ${drawerContainerHeaderAnimationSpeed},
    padding ${drawerContainerHeaderAnimationSpeed};

  ${whenCollapsed`
    /* centering the icon */
    display: flex;
    flex-basis: auto;
    flex-direction: column;
    justify-content: center;
    min-height: 0;
    padding: 0 ${gridSize}px 0 ${gridSize}px;
  `} > *:first-child {
    margin-bottom: ${containerTitleBottomMargin}px;
  }
`;

ContainerHeaderWrapper.displayName = 'ContainerHeaderWrapper';

export default ContainerHeaderWrapper;
