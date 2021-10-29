import {
  B200,
  B400,
  B50,
  N0,
  N20,
  N200,
  N40,
  N600,
  N700,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { hexToRGBA } from './themeHelpers';
import { Mode } from './types';

const defaultTheme: { mode: Mode } = {
  mode: {
    create: {
      active: {
        color: token('color.text.onBold', N0),
        backgroundColor: token(
          'color.background.boldBrand.pressed',
          hexToRGBA(B400, 0.8),
        ),
        boxShadow: '',
      },
      default: {
        color: token('color.text.onBold', N0),
        backgroundColor: token('color.background.boldBrand.resting', B400),
        boxShadow: '',
      },
      focus: {
        color: token('color.text.onBold', N0),
        backgroundColor: token('color.background.boldBrand.resting', B400),
        boxShadow: `0 0 0 2px ${token(
          'color.border.focus',
          'rgb(128,169,230)',
        )}`,
      },
      hover: {
        color: token('color.text.onBold', N0),
        backgroundColor: token(
          'color.background.boldBrand.hover',
          hexToRGBA(B400, 0.9),
        ),
        boxShadow: '',
      },
      selected: { color: '', backgroundColor: '', boxShadow: '' },
    },
    iconButton: {
      active: {
        color: token('color.text.mediumEmphasis', B400),
        backgroundColor: token(
          'color.background.subtleNeutral.pressed',
          hexToRGBA(B50, 0.6),
        ),
        boxShadow: '',
      },
      default: {
        color: token('color.text.mediumEmphasis', N600),
        backgroundColor: 'transparent',
        boxShadow: '',
      },
      focus: {
        color: token('color.text.mediumEmphasis', N600),
        backgroundColor: token(
          'color.background.subtleBrand.hover',
          hexToRGBA(B50, 0.5),
        ),
        boxShadow: `0 0 0 2px ${token('color.border.focus', B200)}`,
      },
      hover: {
        color: token('color.text.mediumEmphasis', B400),
        backgroundColor: token(
          'color.background.subtleNeutral.hover',
          hexToRGBA(B50, 0.9),
        ),
        boxShadow: '',
      },
      selected: {
        color: token('color.text.selected', ''),
        backgroundColor: token('color.background.selected.resting', ''),
        boxShadow: '',
      },
    },
    navigation: {
      backgroundColor: token('color.background.default', N0),
      color: token('color.text.lowEmphasis', N200),
    },
    productHome: {
      backgroundColor: token('color.text.brand', B400),
      color: token('color.text.highEmphasis', N700),
      borderRight: `1px solid ${token(
        'color.border.neutral',
        hexToRGBA(N200, 0.3),
      )}`,
      // TODO: (DSP-1256) These colors should be moved into the Logo package
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      iconGradientStart: B400,
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      iconGradientStop: B200,
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      iconColor: B200,
    },
    primaryButton: {
      active: {
        color: token('color.text.mediumEmphasis', B400),
        backgroundColor: token(
          'color.background.subtleNeutral.pressed',
          hexToRGBA(B50, 0.7),
        ),
        boxShadow: '',
      },
      default: {
        color: token('color.text.mediumEmphasis', N600),
        backgroundColor: 'transparent',
        boxShadow: '',
      },
      focus: {
        color: token('color.text.mediumEmphasis', N600),
        backgroundColor: '',
        boxShadow: `0 0 0 2px ${token('color.border.focus', B200)}`,
      },
      hover: {
        color: token('color.text.mediumEmphasis', B400),
        backgroundColor: token(
          'color.background.subtleNeutral.hover',
          hexToRGBA(B50, 0.9),
        ),
        boxShadow: '',
      },
      selected: {
        color: token('color.text.mediumEmphasis', B400),
        backgroundColor: token('color.background.selected.resting', ''),
        boxShadow: '',
        borderColor: token('color.iconBorder.brand', B400),
        bordorBottom: `4px solid ${token('color.iconBorder.brand', B400)}`,
      },
    },
    search: {
      default: {
        backgroundColor: token('color.background.default', N0),
        color: token('color.text.lowEmphasis', N200),
        borderColor: token('color.border.neutral', N40),
      },
      focus: {
        borderColor: token('color.border.focus', B200),
      },
      hover: {
        color: token('color.text.brand', B400),
        backgroundColor: token('color.background.default', hexToRGBA(B50, 0.9)),
      },
    },
    skeleton: {
      backgroundColor: token('color.background.subtleNeutral.resting', N20),
      opacity: 1,
    },
  },
};

export const DEFAULT_THEME_NAME = 'atlassian';
export default defaultTheme;
