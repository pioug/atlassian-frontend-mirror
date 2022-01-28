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
    backgroundColor: token('color.background.brand', B50),
    Icon: InfoIcon,
    primaryIconColor: token('color.icon.brand', B500),
  },
  warning: {
    backgroundColor: token('color.background.warning', Y50),
    Icon: WarningIcon,
    primaryIconColor: token('color.icon.warning', Y500),
  },
  error: {
    backgroundColor: token('color.background.danger', R50),
    Icon: ErrorIcon,
    primaryIconColor: token('color.icon.danger', R500),
  },
  success: {
    backgroundColor: token('color.background.success', G50),
    Icon: CheckCircleIcon,
    primaryIconColor: token('color.icon.success', G500),
  },
  discovery: {
    backgroundColor: token('color.background.discovery', P50),
    Icon: QuestionCircleIcon,
    primaryIconColor: token('color.icon.discovery', P500),
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
