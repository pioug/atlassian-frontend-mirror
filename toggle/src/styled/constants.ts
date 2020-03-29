import { gridSize } from '@atlaskit/theme/constants';
import { Sizes } from '../types';

type Dimensions = 'width' | 'height';

type DimensionsObject = { [k in Sizes]: { [key in Dimensions]: number } };
const dimensions: DimensionsObject = {
  regular: {
    height: gridSize() * 2,
    width: gridSize() * 4,
  },
  large: {
    height: gridSize() * 2 + gridSize() / 2,
    width: gridSize() * 5,
  },
};

export const borderWidth = '2px';
export const paddingUnitless = gridSize() / 4;
export const transition = '0.2s';

export const getHeight = ({ size }: { size: Sizes }) => dimensions[size].height;
export const getWidth = ({ size }: { size: Sizes }) => dimensions[size].width;
