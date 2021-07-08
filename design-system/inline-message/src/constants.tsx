import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import InfoIcon from '@atlaskit/icon/glyph/info';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { gridSize } from '@atlaskit/theme/constants';

import type { IconAppearanceMap } from './types';

export const itemSpacing = gridSize() / 2;

export const typesMapping: IconAppearanceMap = {
  connectivity: {
    icon: WarningIcon,
    defaultLabel: 'connectivity inline message',
  },
  confirmation: {
    icon: CheckCircleIcon,
    defaultLabel: 'confirmation inline message',
  },
  info: {
    icon: InfoIcon,
    defaultLabel: 'info inline message',
  },
  warning: {
    icon: WarningIcon,
    defaultLabel: 'warning inline message',
  },
  error: {
    icon: ErrorIcon,
    defaultLabel: 'error inline message',
  },
};
