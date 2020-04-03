import styled from 'styled-components';
import { gridSize } from '../../shared-variables';

const size = gridSize * 5;
const borderRadius = 4;

const ContainerTitleIcon = styled.div`
  align-items: center;
  display: flex;
  height: ${size}px;
  justify-content: center;
  width: ${size}px;

  /* We need to ensure that any image passed in as a child (<img/>, <svg/>
  etc.) receives the correct width, height and border radius. We don't
  currently assume that the image passed in is the correct dimensions, or has
  width / height 100% */
  & > img {
    border-radius: ${borderRadius}px;
    height: ${size}px;
    width: ${size}px;
  }
`;

ContainerTitleIcon.displayName = 'ContainerTitleIcon';
export default ContainerTitleIcon;
