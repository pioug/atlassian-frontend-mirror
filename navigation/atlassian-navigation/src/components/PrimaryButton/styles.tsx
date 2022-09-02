import { ThemeProps, ThemeTokens } from '@atlaskit/button/types';

import { NavigationTheme } from '../../theme';

export const getPrimaryButtonTheme = ({
  mode: { primaryButton },
}: NavigationTheme) => (
  current: (props: ThemeProps) => ThemeTokens,
  props: ThemeProps,
): ThemeTokens => {
  const { buttonStyles, spinnerStyles } = current(props);

  return {
    buttonStyles: {
      ...buttonStyles,
      ...primaryButton.default,
      ...(props.isSelected && primaryButton.selected),
      fontWeight: 500,
      padding: '0 4px',
      marginLeft: 0,
      marginRight: 0,
      ':hover': props.isSelected
        ? primaryButton.selectedHover
        : primaryButton.hover,
      ':focus': primaryButton.focus,
      // :active doesn't work in FF, because we do a
      // e.preventDefault() on mouse down in Button.
      // '&&' is required to add more CSS specificity
      // && it not a valid CSSObject property
      // @ts-ignore
      '&&': {
        ...(props.state === 'active' && primaryButton.active),
      },
    },
    spinnerStyles,
  };
};
