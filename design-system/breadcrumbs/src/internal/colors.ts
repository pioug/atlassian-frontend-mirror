import { N200, N300 } from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';

export type BreadcrumbsContainerColors = {
  textColor: string;
  separatorColor: string;
};

const colorMap = {
  light: {
    textColor: N200,
    separatorColor: N200,
  },
  dark: {
    textColor: N300,
    separatorColor: N300,
  },
};

export const getColors = (mode: ThemeModes): BreadcrumbsContainerColors => {
  return colorMap[mode];
};
