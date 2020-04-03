import { ComponentType } from 'react';
import * as colors from '@atlaskit/theme/colors';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import InfoIcon from '@atlaskit/icon/glyph/info';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';

interface Appearance {
  backgroundColor: string;
  primaryIconColor: string;
  Icon: ComponentType<any>;
}

export const baseAppearanceObj: { [key: string]: Appearance } = {
  info: {
    backgroundColor: colors.B50,
    Icon: InfoIcon,
    primaryIconColor: colors.B500,
  },
  warning: {
    backgroundColor: colors.Y50,
    Icon: WarningIcon,
    primaryIconColor: colors.Y500,
  },
  error: {
    backgroundColor: colors.R50,
    Icon: ErrorIcon,
    primaryIconColor: colors.R500,
  },
  confirmation: {
    backgroundColor: colors.G50,
    Icon: CheckCircleIcon,
    primaryIconColor: colors.G500,
  },
  change: {
    backgroundColor: colors.P50,
    Icon: QuestionCircleIcon,
    primaryIconColor: colors.P500,
  },
};
