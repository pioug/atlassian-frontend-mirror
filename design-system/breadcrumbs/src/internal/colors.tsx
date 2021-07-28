import { N200, N300 } from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

export type BreadcrumbsContainerColors = {
  textColor: string;
  separatorColor: string;
};

const colorMap = {
  light: {
    textColor: token('color.text.lowEmphasis', N200),
    separatorColor: token('color.text.lowEmphasis', N200),
  },
  dark: {
    textColor: token('color.text.lowEmphasis', N300),
    separatorColor: token('color.text.lowEmphasis', N300),
  },
};

export const getColors = (mode: ThemeModes): BreadcrumbsContainerColors => {
  return colorMap[mode];
};
