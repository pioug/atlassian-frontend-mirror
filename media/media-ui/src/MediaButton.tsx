/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// Keep Media buttons to use static colors from the new color palette to support the hybrid
// theming in media viewer https://product-fabric.atlassian.net/browse/DSP-6067
import React, { type RefObject } from 'react';
import { type ButtonProps } from '@atlaskit/button/types';
import Button from '@atlaskit/button/custom-theme-button';
import {
  type CustomThemeButtonProps,
  type Appearance,
  type ThemeProps,
} from '@atlaskit/button/types';

type MediaButtonAppearance = Appearance;

type WithMediaButtonAppearance<T> = Omit<T, 'appearance'> & {
  appearance?: MediaButtonAppearance;
};

const buttonTheme = {
  default: {
    background: {
      default: { light: 'transparent' },
      hover: { light: '#a1bdd914' },
      active: { light: '#a6c5e229' },
    },
    boxShadowColor: {
      focus: { light: '#85b8ff' },
    },
    color: {
      default: { light: '#c7d1db' },
      hover: { light: '#c7d1db' },
      active: { light: '#c7d1db' },
      disabled: { light: '#bfdbf847' },
      focus: { light: '#c7d1db' },
    },
  },
  primary: {
    background: {
      default: { light: '#579dff' },
      hover: { light: '#85b8ff' },
      active: { light: '#cce0ff' },
      disabled: { light: '#bcd6f00a' },
    },
    boxShadowColor: {
      focus: { light: '#85b8ff' },
    },
    color: {
      default: { light: '#161a1d' },
    },
  },
  selected: {
    color: {
      default: { light: 'red' },
    },
  },
};

function extract(
  newTheme: any,
  { appearance, state, mode }: WithMediaButtonAppearance<ThemeProps>,
) {
  // @ts-ignore
  if (!newTheme[appearance]) {
    return;
  }
  // @ts-ignore
  const root = newTheme[appearance];
  return Object.keys(root).reduce((acc: { [index: string]: string }, val) => {
    let node = root;
    [val, state, mode].forEach((item) => {
      if (!node[item]) {
        return;
      }
      if (typeof node[item] !== 'object') {
        acc[val] = node[item];
        return;
      }
      node = node[item];
      return;
    });
    return acc;
  }, {});
}

export interface MediaButtonProps extends ButtonProps {
  buttonRef?: RefObject<HTMLButtonElement>;
}

type Props = WithMediaButtonAppearance<CustomThemeButtonProps> & {
  buttonRef?: RefObject<HTMLButtonElement>;
};

export default function MediaButton({
  appearance = 'default',
  buttonRef,
  ...rest
}: Props) {
  return (
    <Button
      {...rest}
      ref={buttonRef}
      // Giving button the 'default' appearance so it can calculate the base styles
      appearance={appearance}
      theme={(currentTheme, themeProps) => {
        const { buttonStyles, ...rest } = currentTheme(themeProps);
        return {
          buttonStyles: {
            ...buttonStyles,
            // giving our extract function the real appearance value
            ...extract(buttonTheme, { ...themeProps, appearance }),
          },
          ...rest,
        };
      }}
    />
  );
}
