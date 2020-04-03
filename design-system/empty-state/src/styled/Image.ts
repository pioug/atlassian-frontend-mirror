import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';

type ImageProps = {
  height?: number;
  maxHeight: number;
  maxWidth: number;
};
const Image = styled.img<ImageProps>`
  display: block;
  height: ${props => props.height || 'auto'};
  margin: 0 auto ${gridSize() * 3}px;
  max-height: ${props => props.maxHeight}px;
  max-width: ${props => props.maxWidth}px;
  width: ${props => props.width || 'auto'};
`;

export default Image;
