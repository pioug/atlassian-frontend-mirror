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

const radioThemeColors = {
  light: {
    background: N10,
    backgroundHover: N30,
    backgroundActive: B50,
    backgroundChecked: B400,
    backgroundCheckedHover: B300,

    dotChecked: N10,
    dotDisabled: N70,
    dotActive: B400,

    border: N40,
    borderHover: N40,
    borderFocus: B100,

    disabled: N20,
    invalid: R300,
  },
  dark: {
    background: DN10,
    backgroundHover: DN30,
    backgroundActive: B200,
    backgroundChecked: B400,
    backgroundCheckedHover: B75,

    dotChecked: DN10,
    dotDisabled: DN90,
    dotActive: DN10,

    border: DN80,
    borderHover: DN200,
    borderFocus: B75,

    disabled: DN10,
    invalid: R300,
  },
};

const radioStyles = css`
  /*
    Change the variables --radio-background-color, --radio-border-color,
    -radio-dot-color and -radio-dot-opacity according to user interactions.
    All other variables are constant
  */

  --radio-background-color: var(--local-background);
  --radio-border-color: var(--local-border);
  --radio-dot-color: var(--local-dot-checked);
  --radio-dot-opacity: 0;

  -webkit-appearance: none;
  -moz-appearance: none;

  /*
    The circle should be 14px * 14px centred in a 24px * 24px box.
    This is inclusive of a 2px border and inner circle with 2px radius.
    There is a Chrome bug that makes the circle become an oval and the
    inner circle not be centred at various zoom levels. This bug is fixed
    in all browsers if a scale of 14/24 is applied.
  */
  height: 24px;
  width: 24px;
  flex-shrink: 0;
  margin: 0;
  /* 24px * 7 / 12 === 14px height and width */
  transform: scale(calc(7 / 12));

  outline: none;
  display: inline-block;
  vertical-align: top;
  position: relative;
  /* Border should be 2px, multiply by 24/14 to offset scale */
  border: calc(2px * 12 / 7) solid var(--radio-border-color);
  background-color: var(--radio-background-color);
  transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    border-radius: 50%;
    /* Height and width should by 4px, multiply by 24/14 to offset scale */
    height: calc(4px * 12 / 7);
    width: calc(4px * 12 / 7);
    background: var(--radio-dot-color);
    opacity: var(--radio-dot-opacity);
    position: absolute;
    transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
  }

  &:checked {
    --radio-dot-opacity: 1;
  }
  &:hover {
    --radio-background-color: var(--local-background-hover);
    --radio-border-color: var(local-border-hover);
  }
  &:focus {
    --radio-border-color: var(--local-border-focus);
  }
  &:checked {
    --radio-background-color: var(--local-background-checked);
    --radio-border-color: var(--local-background-checked);
  }
  &:checked:hover {
    --radio-background-color: var(--local-background-checked-hover);
    --radio-border-color: var(--local-background-checked-hover);
  }
  &:checked:focus {
    --radio-border-color: var(--local-border-focus);
  }
  &:checked:active {
    --radio-background-color: var(--local-background-active);
    --radio-dot-color: var(--local-dot-active);
    --radio-border-color: var(--local-border-focus);
  }

  &[data-invalid],
  &:checked[data-invalid] {
    --radio-border-color: var(--local-invalid);
  }

  &:disabled,
  &:disabled:hover,
  &:disabled:focus,
  &:disabled:active,
  &:disabled[data-invalid] {
    --radio-background-color: var(--local-disabled);
    --radio-border-color: var(--local-disabled);
    --radio-dot-color: var(--local-dot-disabled);
    cursor: not-allowed;
  }
`;

export default function getRadioStyles(mode: ThemeModes) {
  const radioColors = radioThemeColors[mode];
  return [
    css`
      --local-background: ${radioColors.background};
      --local-background-hover: ${radioColors.backgroundHover};
      --local-background-active: ${radioColors.backgroundActive};
      --local-background-checked: ${radioColors.backgroundChecked};
      --local-background-checked-hover: ${radioColors.backgroundCheckedHover};

      --local-dot-checked: ${radioColors.dotChecked};
      --local-dot-disabled: ${radioColors.dotDisabled};
      --local-dot-active: ${radioColors.dotActive};

      --local-border: ${radioColors.border};
      --local-border-hover: ${radioColors.borderHover};
      --local-border-focus: ${radioColors.borderFocus};

      --local-disabled: ${radioColors.disabled};
      --local-invalid: ${R300};
    `,
    radioStyles,
  ];
}
