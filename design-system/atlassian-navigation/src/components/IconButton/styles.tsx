import { ThemeProps, ThemeTokens } from '@atlaskit/button/types';
import { token } from '@atlaskit/tokens';

import { NavigationTheme } from '../../theme';

export const getIconButtonTheme =
  ({ mode: { iconButton } }: NavigationTheme) =>
  (
    current: (props: ThemeProps) => ThemeTokens,
    props: ThemeProps,
  ): ThemeTokens => {
    const { buttonStyles, spinnerStyles } = current(props);

    return {
      buttonStyles: {
        ...buttonStyles,
        borderRadius: token('border.radius.circle', '100%'),
        display: 'flex',
        margin: `0 ${token('space.025', '2px')}`,
        // TODO Delete this comment after verifying space token -> previous value `4`
        padding: token('space.050', '4px'),
        height: 'auto',
        fontWeight: 500,
        ...iconButton.default,
        ':hover': iconButton.hover,
        ':focus': iconButton.focus,
        // :active doesn't work in FF, because we do a
        // e.preventDefault() on mouse down in Button.
        // '&&' is required to add more CSS specificity
        // && it not a valid CSSObject property
        // @ts-ignore
        '&&': {
          ...(props.state === 'active' && iconButton.active),
        },
        ...(props.state === 'selected' && iconButton.selected),
        '> span': {
          margin: 0,
        },
      },
      spinnerStyles,
    };
  };
