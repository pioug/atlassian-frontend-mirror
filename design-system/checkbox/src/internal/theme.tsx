import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import {
  B100,
  B200,
  B300,
  B400,
  B50,
  B75,
  DN10,
  DN200,
  DN30,
  DN80,
  DN90,
  N10,
  N100,
  N20,
  N30,
  N40,
  N70,
  R300,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const theme = {
  light: {
    borderColor: {
      rest: token(
        'color.border.input',
        getBooleanFF('platform.design-system-team.update-border-input_ff9l1')
          ? N100
          : N40,
      ),
      hovered: token(
        'color.border.input',
        getBooleanFF('platform.design-system-team.update-border-input_ff9l1')
          ? N100
          : N40,
      ),
      disabled: token('color.background.disabled', N20),
      checked: token('color.background.selected.bold', B400),
      active: token('color.border', B50),
      invalid: token('color.border.danger', R300),
      invalidAndChecked: token('color.border.danger', R300),
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
  dark: {
    borderColor: {
      rest: token(
        'color.border.input',
        getBooleanFF('platform.design-system-team.update-border-input_ff9l1')
          ? DN200
          : DN80,
      ),
      hovered: token('color.border.input', DN200),
      disabled: token('color.background.disabled', DN10),
      checked: token('color.background.selected.bold', B400),
      active: token('color.border', B200),
      invalid: token('color.border.danger', R300),
      invalidAndChecked: token('color.border.danger', R300),
      focused: token('color.border.focused', B75),
      hoveredAndChecked: token('color.background.selected.bold.hovered', B75),
    },
    boxColor: {
      rest: token('color.background.input', DN10),
      hovered: token('color.background.input.hovered', DN30),
      disabled: token('color.background.disabled', DN10),
      active: token('color.background.input.pressed', B200),
      hoveredAndChecked: token('color.background.selected.bold.hovered', B75),
      checked: token('color.background.selected.bold', B400),
    },
    tickColor: {
      disabledAndChecked: token('color.icon.disabled', DN90),
      activeAndChecked: token('color.icon.inverse', DN10),
      checked: token('color.icon.inverse', DN10),
    },
  },
};

export default theme;
