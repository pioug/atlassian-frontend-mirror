import styled from 'styled-components';

import { sizes } from '../constants';
import { sizeOpts } from '../types';

type Props = {
  /* Sets the color of the skeleton. By default it will inherit the current text color. */
  color?: string;
  /* Controls the size of the skeleton */
  size?: sizeOpts;
  /* Determines the opacity of the skeleton */
  weight?: 'normal' | 'strong';
};

const Skeleton = styled.div<Props>`
  width: ${props => sizes[props.size || 'medium']};
  height: ${props => sizes[props.size || 'medium']};
  display: inline-block;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  opacity: ${({ weight }) => (weight === 'strong' ? 0.3 : 0.15)};
`;

Skeleton.defaultProps = {
  size: 'medium',
  weight: 'normal',
  color: 'currentColor',
};

export default Skeleton;
