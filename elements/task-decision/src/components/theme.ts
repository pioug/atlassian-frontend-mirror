import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import {
  B100,
  B300,
  B400,
  B50,
  DN200,
  N10,
  N20,
  N30,
  N40,
  N70,
  N100,
} from '@atlaskit/theme/colors';

/**
 * Styles taken from packages/design-system/checkbox/src/internal/theme.tsx
 * To be used until mobile editor does not require legacy themed() API anymore
 */
const checkboxTheme = {
  light: {
    borderColor: {
      rest: token(
        'color.border.input',
        getBooleanFF(
          'platform.design-system-team.update-border-radio-checkbox_7askv',
        )
          ? N100
          : N40,
      ),
      hovered: token(
        'color.border.input',
        getBooleanFF(
          'platform.design-system-team.update-border-radio-checkbox_7askv',
        )
          ? N100
          : N40,
      ),
      disabled: token('color.background.disabled', N20),
      checked: token('color.background.selected.bold', B400),
      active: token('color.border', B50),
      focused: token('color.border.focused', B100),
      hoveredAndChecked: token('color.background.selected.bold.hovered', B300),
    },
    boxColor: {
      rest: token('color.background.input', N10),
      hovered: token('color.background.input.hovered', N30),
      disabled: token('color.background.disabled', N20),
      active: token('color.background.input.pressed', B50),
      hoveredAndChecked: token('color.background.selected.bold.hovered', B300),
      checked: token('color.background.selected.bold', B400),
    },
    tickColor: {
      disabledAndChecked: token('color.icon.disabled', N70),
      activeAndChecked: token('color.icon.inverse', B400),
      checked: token('color.icon.inverse', N10),
    },
  },
  /**
   * Fallback colours for dark mode taken from
   * packages/design-system/tokens/src/artifacts/themes/atlassian-dark.tsx
   * To be used to keep mobile / web checkbox dark mode consistent
   * until mobile editor does not require legacy themed() API anymore
   */
  dark: {
    borderColor: {
      rest: token(
        'color.border.input',
        getBooleanFF(
          'platform.design-system-team.update-border-radio-checkbox_7askv',
        )
          ? DN200
          : '#A6C5E229',
      ),
      hovered: token('color.border.input', '#A6C5E229'),
      disabled: token('color.background.disabled', '#BCD6F00A'),
      checked: token('color.background.selected.bold', '#579DFF'),
      active: token('color.border', '#A6C5E229'),
      focused: token('color.border.focused', '#85B8FF'),
      hoveredAndChecked: token(
        'color.background.selected.bold.hovered',
        '#85B8FF',
      ),
    },
    boxColor: {
      rest: token('color.background.input', '#22272B'),
      hovered: token('color.background.input.hovered', '#282E33'),
      disabled: token('color.background.disabled', '#BCD6F00A'),
      active: token('color.background.input.pressed', '#22272B'),
      hoveredAndChecked: token(
        'color.background.selected.bold.hovered',
        '#85B8FF',
      ),
      checked: token('color.background.selected.bold', '#579DFF'),
    },
    tickColor: {
      disabledAndChecked: token('color.icon.disabled', '#BFDBF847'),
      activeAndChecked: token('color.icon.inverse', '#1D2125'),
      checked: token('color.icon.inverse', '#1D2125'),
    },
  },
};

export default checkboxTheme;
