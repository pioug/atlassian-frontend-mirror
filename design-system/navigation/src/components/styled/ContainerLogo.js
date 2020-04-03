import styled from 'styled-components';
import { gridSize } from '../../shared-variables';

const ContainerLogo = styled.div`
  height: ${gridSize * 4}px;
  padding: ${gridSize * 1.5}px ${gridSize / 2}px;
`;

ContainerLogo.displayName = 'ContainerLogo';
export default ContainerLogo;
