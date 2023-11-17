import { B400, B75, N0, N50, N900, P400, P75 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { DotsAppearance } from './types';

// TODO Token usages are not consistent for dots https://product-fabric.atlassian.net/browse/DSP-3180
const colorMap = {
  default: token('color.background.neutral', N50),
  help: token('color.background.neutral', P75),
  inverted: token('color.icon.subtle', 'rgba(255, 255, 255, 0.4)'),
  primary: token('color.background.neutral', B75),
};

const selectedColorMap = {
  default: token('color.icon', N900),
  help: token('color.icon.discovery', P400),
  inverted: token('color.icon.inverse', N0),
  primary: token('color.icon.brand', B400),
};

export const getBgColor = (appearance: DotsAppearance, isSelected: boolean) =>
  isSelected ? selectedColorMap[appearance] : colorMap[appearance];
