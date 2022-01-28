import { B400, N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const getIconColors = (isSelected: boolean | undefined) => {
  if (isSelected) {
    return {
      primary: token('color.background.brand.bold', B400),
      secondary: token('elevation.surface', N40),
    };
  }
  return {
    primary: token('color.border', N40),
    secondary: token('utility.UNSAFE_util.transparent', N40),
  };
};

export default getIconColors;
