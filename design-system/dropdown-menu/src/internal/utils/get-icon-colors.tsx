import { B400, N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const getIconColors = (isSelected: boolean | undefined) => {
  if (isSelected) {
    return {
      primary: token('color.background.boldBrand.resting', B400),
      secondary: token('color.background.default', N40),
    };
  }
  return {
    primary: token('color.border.neutral', N40),
    secondary: token('utility.UNSAFE_util.transparent', N40),
  };
};

export default getIconColors;
