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
import { token } from '@atlaskit/tokens';

import type { DotsAppearance } from './types';

// TODO Token usages are not consistent for dots https://product-fabric.atlassian.net/browse/DSP-3180
const colorMap = {
  default: themed({
    light: token('color.background.neutral', N50),
    dark: token('color.background.neutral', DN70),
  }),
  help: themed({
    light: token('color.background.neutral', P75),
    dark: token('color.background.neutral', DN70),
  }),
  inverted: themed({
    light: token('color.icon.subtle', 'rgba(255, 255, 255, 0.4)'),
    dark: token('color.icon.subtle', DN300A),
  }),
  primary: themed({
    light: token('color.background.neutral', B75),
    dark: token('color.background.neutral', DN70),
  }),
};

const selectedColorMap = {
  default: themed({
    light: token('color.icon', N900),
    dark: token('color.icon', DN600),
  }),
  help: themed({
    light: token('color.icon.discovery', P400),
    dark: token('color.icon.discovery', P300),
  }),
  inverted: themed({
    light: token('color.icon.inverse', N0),
    dark: token('color.icon.inverse', DN30),
  }),
  primary: themed({
    light: token('color.icon.brand', B400),
    dark: token('color.icon.brand', B100),
  }),
};

export const getBgColor = (appearance: DotsAppearance, isSelected: boolean) =>
  isSelected ? selectedColorMap[appearance] : colorMap[appearance];
