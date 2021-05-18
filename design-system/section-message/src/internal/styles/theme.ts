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

import type { Appearance } from '../../types';

interface AppearanceIconTheme {
  backgroundColor: string;
  primaryIconColor: string;
  Icon: ComponentType<any>;
}

export const appearanceIconTheming: {
  [key in Appearance]: AppearanceIconTheme;
} = {
  information: {
    backgroundColor: B50,
    Icon: InfoIcon,
    primaryIconColor: B500,
  },
  warning: {
    backgroundColor: Y50,
    Icon: WarningIcon,
    primaryIconColor: Y500,
  },
  error: {
    backgroundColor: R50,
    Icon: ErrorIcon,
    primaryIconColor: R500,
  },
  success: {
    backgroundColor: G50,
    Icon: CheckCircleIcon,
    primaryIconColor: G500,
  },
  discovery: {
    backgroundColor: P50,
    Icon: QuestionCircleIcon,
    primaryIconColor: P500,
  },
};
