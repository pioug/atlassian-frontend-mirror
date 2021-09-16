/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import {
  B100,
  B400,
  B75,
  DN30,
  DN300A,
  DN600,
  DN70,
  N0,
  N50,
  N900,
  P300,
  P400,
  P75,
} from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';

import type { DotsAppearance } from './types';

const colorMap = {
  default: themed({ light: N50, dark: DN70 }),
  help: themed({ light: P75, dark: DN70 }),
  inverted: themed({ light: 'rgba(255, 255, 255, 0.4)', dark: DN300A }),
  primary: themed({ light: B75, dark: DN70 }),
};

const selectedColorMap = {
  default: themed({ light: N900, dark: DN600 }),
  help: themed({ light: P400, dark: P300 }),
  inverted: themed({ light: N0, dark: DN30 }),
  primary: themed({ light: B400, dark: B100 }),
};

export const getBgColor = (appearance: DotsAppearance, isSelected: boolean) =>
  isSelected ? selectedColorMap[appearance] : colorMap[appearance];
