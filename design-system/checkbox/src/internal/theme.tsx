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
      rest: token('color.border', N40),
      hovered: token('color.border', N40),
      disabled: token('color.background.disabled', N20),
      checked: token('color.background.brand.bold', B400),
      active: token('color.border', B50),
      invalid: token('color.border.danger', R300),
      invalidAndChecked: token('color.border.danger', R300),
      focused: token('color.border.focused', B100),
      hoveredAndChecked: token('color.background.brand.bold.hovered', B300),
    },
    boxColor: {
      rest: token('color.background.input', N10),
      hovered: token('elevation.surface', N30),
      disabled: token('color.background.disabled', N20),
      active: token('color.background.input.pressed', B50),
      hoveredAndChecked: token('color.background.brand.bold.hovered', B300),
      checked: token('color.background.brand.bold', B400),
    },
    tickColor: {
      disabledAndChecked: token('color.text.disabled', N70),
      activeAndChecked: token('color.text.inverse', B400),
      checked: token('color.text.inverse', N10),
    },
  },
  dark: {
    borderColor: {
      rest: token('color.border', DN80),
      hovered: token('color.border', DN200),
      disabled: token('color.background.disabled', DN10),
      checked: token('color.background.brand.bold', B400),
      active: token('color.border', B200),
      invalid: token('color.border.danger', R300),
      invalidAndChecked: token('color.border.danger', R300),
      focused: token('color.border.focused', B75),
      hoveredAndChecked: token('color.background.brand.bold.hovered', B75),
    },
    boxColor: {
      rest: token('color.background.input', DN10),
      hovered: token('elevation.surface', DN30),
      disabled: token('color.background.disabled', DN10),
      active: token('color.background.input.pressed', B200),
      hoveredAndChecked: token('color.background.brand.bold.hovered', B75),
      checked: token('color.background.brand.bold', B400),
    },
    tickColor: {
      disabledAndChecked: token('color.text.disabled', DN90),
      activeAndChecked: token('color.text.inverse', DN10),
      checked: token('color.text.inverse', DN10),
    },
  },
};

export default theme;
