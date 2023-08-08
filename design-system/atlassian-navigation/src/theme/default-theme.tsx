import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import {
  B200,
  B400,
  B50,
  N0,
  N100,
  N20,
  N200,
  N40,
  N600,
  N700,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { hexToRGBA } from './theme-helpers';
import { Mode } from './types';

const defaultTheme: { mode: Mode } = {
  mode: {
    create: {
      active: {
        color: token('color.text.inverse', N0),
        backgroundColor: token(
          'color.background.brand.bold.pressed',
          hexToRGBA(B400, 0.8),
        ),
        boxShadow: '',
      },
      default: {
        color: token('color.text.inverse', N0),
        backgroundColor: token('color.background.brand.bold', B400),
        boxShadow: '',
      },
      focus: {
        color: token('color.text.inverse', N0),
        backgroundColor: '',
        boxShadow: '',
      },
      hover: {
        color: token('color.text.inverse', N0),
        backgroundColor: token(
          'color.background.brand.bold.hovered',
          hexToRGBA(B400, 0.9),
        ),
        boxShadow: '',
      },
      selected: { color: '', backgroundColor: '', boxShadow: '' },
    },
    iconButton: {
      active: {
        color: token('color.text.subtle', B400),
        backgroundColor: token(
          'color.background.neutral.pressed',
          hexToRGBA(B50, 0.6),
        ),
        boxShadow: '',
      },
      default: {
        color: token('color.text.subtle', N600),
        backgroundColor: 'transparent',
        boxShadow: '',
      },
      focus: {
        color: token('color.text.subtle', N600),
        backgroundColor: '',
        boxShadow: '',
      },
      hover: {
        color: token('color.text.subtle', B400),
        backgroundColor: token(
          'color.background.neutral.hovered',
          hexToRGBA(B50, 0.9),
        ),
        boxShadow: '',
      },
      selected: {
        color: token('color.text.selected', B400),
        backgroundColor: token(
          'color.background.selected',
          hexToRGBA(B50, 0.6),
        ),
        boxShadow: '',
      },
      selectedHover: {
        color: token('color.text.selected', B400),
        backgroundColor: token(
          'color.background.selected.hovered',
          hexToRGBA(B50, 0.6),
        ),
        boxShadow: '',
      },
    },
    navigation: {
      backgroundColor: token('elevation.surface', N0),
      color: token('color.text.subtlest', N200),
    },
    productHome: {
      backgroundColor: token('color.text.brand', B400),
      color: token('color.text', N700),
      borderRight: `1px solid ${token('color.border', hexToRGBA(N200, 0.3))}`,
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
        color: token('color.text.subtle', B400),
        backgroundColor: token(
          'color.background.neutral.pressed',
          hexToRGBA(B50, 0.7),
        ),
        boxShadow: '',
      },
      default: {
        color: token('color.text.subtle', N600),
        backgroundColor: 'transparent',
        boxShadow: '',
      },
      focus: {
        color: token('color.text.subtle', N600),
        backgroundColor: '',
        boxShadow: '',
      },
      hover: {
        color: token('color.text.subtle', B400),
        backgroundColor: token(
          'color.background.neutral.hovered',
          hexToRGBA(B50, 0.9),
        ),
        boxShadow: '',
      },
      selected: {
        color: token('color.text.selected', B400),
        backgroundColor: token(
          'color.background.selected',
          hexToRGBA(B50, 0.7),
        ),
        boxShadow: '',
        borderColor: token('color.border.selected', B400),
      },
      selectedHover: {
        color: token('color.text.selected', B400),
        backgroundColor: token(
          'color.background.selected.hovered',
          hexToRGBA(B50, 0.6),
        ),
        boxShadow: '',
        borderColor: token('color.border.selected', B400),
      },
    },
    search: {
      default: {
        backgroundColor: token('color.background.input', N0),
        color: token('color.text.subtlest', N200),
        borderColor: token(
          'color.border.input',
          getBooleanFF('platform.design-system-team.border-checkbox_nyoiu')
            ? N100
            : N40,
        ),
      },
      focus: {
        borderColor: token('color.border.focused', B200),
      },
      hover: {
        backgroundColor: token('color.background.input.hovered', N0),
      },
    },
    skeleton: {
      backgroundColor: token('color.background.neutral', N20),
      opacity: 1,
    },
  },
};

export const DEFAULT_THEME_NAME = 'atlassian';
export default defaultTheme;
