import { B400, N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const getIconColors = (isSelected: boolean | undefined) => {
  if (isSelected) {
    return {
      primary: token('color.background.brand.bold', B400),
      secondary: token('color.icon.inverse', N40),
    };
  }
  return {
    primary: token('color.background.neutral', N40),
    secondary: token('utility.UNSAFE.transparent', N40),
  };
};

export default getIconColors;
