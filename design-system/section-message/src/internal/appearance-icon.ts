import { ComponentType } from 'react';

import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import InfoIcon from '@atlaskit/icon/glyph/info';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import {
  B50,
  B500,
  G50,
  G500,
  P50,
  P500,
  R50,
  R500,
  Y50,
  Y500,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { Appearance, SectionMessageProps } from '../types';

interface AppearanceIconSchema {
  backgroundColor: string;
  primaryIconColor: string;
  Icon: ComponentType<any>;
}

export const appearanceIconSchema: {
  [key in Appearance]: AppearanceIconSchema;
} = {
  information: {
    backgroundColor: token('color.background.subtleBrand.resting', B50),
    Icon: InfoIcon,
    primaryIconColor: token('color.iconBorder.brand', B500),
  },
  warning: {
    backgroundColor: token('color.background.subtleWarning.resting', Y50),
    Icon: WarningIcon,
    primaryIconColor: token('color.iconBorder.warning', Y500),
  },
  error: {
    backgroundColor: token('color.background.subtleDanger.resting', R50),
    Icon: ErrorIcon,
    primaryIconColor: token('color.iconBorder.danger', R500),
  },
  success: {
    backgroundColor: token('color.background.subtleSuccess.resting', G50),
    Icon: CheckCircleIcon,
    primaryIconColor: token('color.iconBorder.success', G500),
  },
  discovery: {
    backgroundColor: token('color.background.subtleDiscovery.resting', P50),
    Icon: QuestionCircleIcon,
    primaryIconColor: token('color.iconBorder.discovery', P500),
  },
};

export function getAppearanceIconStyles(
  appearance: Appearance,
  icon: SectionMessageProps['icon'],
) {
  const appearanceIconStyles =
    appearanceIconSchema[appearance] || appearanceIconSchema.information;
  const Icon = icon || appearanceIconStyles.Icon;

  return {
    ...appearanceIconStyles,
    Icon,
  };
}
