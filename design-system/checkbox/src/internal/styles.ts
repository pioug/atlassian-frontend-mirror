import { css } from '@emotion/core';

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
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

const checkboxStyles = css`
  /* Make the input invisible */
  -webkit-appearance: none;
  -moz-appearance: none;
  margin: 0;
  /* Necessary to hide correctly on mobile Safari */
  border: none;
  width: 0px;
  height: 0px;
  /* Necessary to hide focus ring on Firefox */
  outline: none;

  /*
    Change the variables --checkbox-background-color, --checkbox-border-color
    and --checkbox-tick-color according to user interactions.
    All other variables are constant.
    All styles from the input target the sibling svg.
  */
  & + svg {
    --checkbox-background-color: var(--local-background);
    --checkbox-border-color: var(--local-border);
    --checkbox-tick-color: var(--local-tick-rest);
    /* Color changes the background color */
    color: var(--checkbox-background-color);
    /* Fill changes the tick color */
    fill: var(--checkbox-tick-color);
    transition: color 0.2s ease-in-out, fill 0.2s ease-in-out;
    flex-shrink: 0;
    /* If the label is multiple lines, don't center the checkbox */
    align-self: flex-start;
  }
  & + svg rect:first-of-type {
    /* Stroke changes the color of the border */
    stroke: var(--checkbox-border-color);
    stroke-width: 2px;
    transition: stroke 0.2s ease-in-out;
  }

  /* Styles are listed in order of increasing specificity  */

  /*
    Compiled will order the pseudo classes by LVFHA
    As the background colour changes on hover, it is okay for the
    border focus colour to take precedence over hover.
    && is used to make the focus styles more specific than the hover
    styles
   */
  &&:focus + svg,
  &&:checked:focus + svg {
    --checkbox-border-color: var(--local-border-focus);
  }

  &:hover + svg {
    --checkbox-background-color: var(--local-background-hover);
    --checkbox-border-color: var(--local-border-hover);
  }
  &:checked:hover + svg {
    --checkbox-background-color: var(--local-background-checked-hover);
    --checkbox-border-color: var(--local-border-checked-hover);
  }

  &:checked + svg {
    --checkbox-background-color: var(--local-background-checked);
    --checkbox-border-color: var(--local-border-checked);
    --checkbox-tick-color: var(--local-tick-checked);
  }

  &[data-invalid] + svg {
    --checkbox-border-color: var(--local-border-invalid);
  }
  &:checked[data-invalid] + svg {
    --checkbox-border-color: var(--local-border-checked-invalid);
  }

  &:active + svg {
    --checkbox-background-color: var(--local-background-active);
    --checkbox-border-color: var(--local-border-active);
  }
  &:checked:active + svg {
    --checkbox-tick-color: var(--local-tick-active);
    --checkbox-background-color: var(--local-background-active);
    --checkbox-border-color: var(--local-border-active);
  }

  &:disabled + svg,
  &:disabled:hover + svg,
  &:disabled:focus + svg,
  &:disabled:active + svg,
  &:disabled[data-invalid] + svg {
    --checkbox-background-color: var(--local-background-disabled);
    --checkbox-border-color: var(--local-border-disabled);
    pointer-events: none;
    cursor: not-allowed;
  }

  &:disabled:checked + svg {
    --checkbox-tick-color: var(--local-tick-disabled);
  }

  @media screen and (forced-colors: active) {
    & + svg {
      --checkbox-background-color: Canvas;
      --checkbox-border-color: CanvasText;
      --checkbox-tick-color: CanvasText;
    }

    &:checked + svg,
    &:checked:hover + svg {
      --checkbox-background-color: Canvas;
      --checkbox-border-color: CanvasText;
      --checkbox-tick-color: CanvasText;
    }

    &:focus + svg rect:first-of-type {
      stroke: Highlight;
    }

    &[data-invalid] + svg {
      --checkbox-border-color: Highlight;
    }
    &:checked[data-invalid] + svg {
      --checkbox-border-color: Highlight;
    }

    &:disabled + svg,
    &:disabled:hover + svg,
    &:disabled:focus + svg,
    &:disabled:active + svg,
    &:disabled[data-invalid] + svg {
      --checkbox-background-color: Canvas;
      --checkbox-border-color: GrayText;
      --checkbox-tick-color: GrayText;
    }
  }
`;

const checkboxThemeColors = {
  light: {
    borderColor: {
      rest: token('color.border.neutral', N40),
      hovered: token('color.border.neutral', N40),
      disabled: token('color.background.disabled', N20),
      checked: token('color.background.boldBrand.resting', B400),
      active: token('color.border.neutral', B50),
      invalid: token('color.iconBorder.danger', R300),
      invalidAndChecked: token('color.iconBorder.danger', R300),
      focused: token('color.border.focus', B100),
      hoveredAndChecked: token('color.background.boldBrand.hover', B300),
    },
    boxColor: {
      rest: token('color.background.subtleBorderedNeutral.resting', N10),
      hovered: token('color.background.default', N30),
      disabled: token('color.background.disabled', N20),
      active: token('color.background.subtleBorderedNeutral.pressed', B50),
      hoveredAndChecked: token('color.background.boldBrand.hover', B300),
      checked: token('color.background.boldBrand.resting', B400),
    },
    tickColor: {
      disabledAndChecked: token('color.text.disabled', N70),
      activeAndChecked: token('color.text.onBold', B400),
      checked: token('color.text.onBold', N10),
    },
  },
  dark: {
    borderColor: {
      rest: token('color.border.neutral', DN80),
      hovered: token('color.border.neutral', DN200),
      disabled: token('color.background.disabled', DN10),
      checked: token('color.background.boldBrand.resting', B400),
      active: token('color.border.neutral', B200),
      invalid: token('color.iconBorder.danger', R300),
      invalidAndChecked: token('color.iconBorder.danger', R300),
      focused: token('color.border.focus', B75),
      hoveredAndChecked: token('color.background.boldBrand.hover', B75),
    },
    boxColor: {
      rest: token('color.background.subtleBorderedNeutral.resting', DN10),
      hovered: token('color.background.default', DN30),
      disabled: token('color.background.disabled', DN10),
      active: token('color.background.subtleBorderedNeutral.pressed', B200),
      hoveredAndChecked: token('color.background.boldBrand.hover', B75),
      checked: token('color.background.boldBrand.resting', B400),
    },
    tickColor: {
      disabledAndChecked: token('color.text.disabled', DN90),
      activeAndChecked: token('color.text.onBold', DN10),
      checked: token('color.text.onBold', DN10),
    },
  },
};

const getCheckboxStyles = (mode: ThemeModes) => {
  const checkboxColors = checkboxThemeColors[mode];
  const boxColor = checkboxColors.boxColor;
  const tickColor = checkboxColors.tickColor;
  const borderColor = checkboxColors.borderColor;

  return [
    css`
      & + svg {
        --local-background: ${boxColor.rest};
        --local-background-hover: ${boxColor.hovered};
        --local-background-active: ${boxColor.active};
        --local-background-checked: ${boxColor.checked};
        --local-background-checked-hover: ${boxColor.hoveredAndChecked};
        --local-background-disabled: ${boxColor.disabled};

        --local-tick-rest: transparent;
        --local-tick-checked: ${tickColor.checked};
        --local-tick-disabled: ${tickColor.disabledAndChecked};
        --local-tick-active: ${tickColor.activeAndChecked};

        --local-border: ${borderColor.rest};
        --local-border-disabled: ${borderColor.disabled};
        --local-border-checked: ${borderColor.checked};
        --local-border-active: ${borderColor.active};
        --local-border-invalid: ${borderColor.invalid};
        --local-border-focus: ${borderColor.focused};
        --local-border-hover: ${borderColor.hovered};
        --local-border-checked-hover: ${borderColor.hoveredAndChecked};
        --local-border-checked-invalid: ${borderColor.invalidAndChecked};
      }
    `,
    checkboxStyles,
  ];
};

export default getCheckboxStyles;
