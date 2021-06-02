import React, { RefObject } from 'react';
import { ButtonProps } from '@atlaskit/button/types';
import Button from '@atlaskit/button/custom-theme-button';
import {
  CustomThemeButtonProps,
  Appearance,
  ThemeProps,
} from '@atlaskit/button/types';
import {
  DN60,
  B75,
  DN400,
  B400,
  DN100,
  B100,
  B200,
  DN70,
  DN30,
} from '@atlaskit/theme/colors';

type MediaButtonAppearance = Appearance;

type WithMediaButtonAppearance<T> = Omit<T, 'appearance'> & {
  appearance?: MediaButtonAppearance;
};

const buttonTheme = {
  default: {
    background: {
      default: { light: 'transparent' },
      hover: { light: DN60 },
      active: { light: B75 },
    },
    boxShadowColor: {
      focus: { light: B75 },
    },
    color: {
      default: { light: DN400 },
      hover: { light: DN400 },
      active: { light: B400 },
      disabled: { light: DN100 },
    },
  },
  primary: {
    background: {
      default: { light: B100 },
      hover: { light: B75 },
      active: { light: B200 },
      disabled: { light: DN70 },
    },
    boxShadowColor: {
      focus: { light: B75 },
    },
    color: {
      default: { light: DN30 },
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
