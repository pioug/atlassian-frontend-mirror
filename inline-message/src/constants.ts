import { gridSize } from '@atlaskit/theme/constants';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import InfoIcon from '@atlaskit/icon/glyph/info';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { IconTypeMap } from './types';

export const itemSpacing: number = gridSize() / 2;

export const typesMapping: IconTypeMap = {
  connectivity: {
    icon: WarningIcon,
    iconSize: 'medium',
  },
  confirmation: {
    icon: CheckCircleIcon,
    iconSize: 'medium',
  },
  info: {
    icon: InfoIcon,
    iconSize: 'medium',
  },
  warning: {
    icon: WarningIcon,
    iconSize: 'medium',
  },
  error: {
    icon: ErrorIcon,
    iconSize: 'medium',
  },
};
