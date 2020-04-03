import React from 'react';
import Button from '@atlaskit/button';
import { ButtonProps } from '@atlaskit/button/types';
import * as colors from '@atlaskit/theme/colors';

const buttonTheme = {
  toolbar: {
    background: {
      default: { light: 'transparent' },
      hover: { light: colors.DN60 },
      active: { light: colors.B75 },
    },
    boxShadowColor: {
      focus: { light: colors.B75 },
    },
    color: {
      default: { light: colors.DN400 },
      hover: { light: colors.DN400 },
      active: { light: colors.B400 },
      disabled: { light: colors.DN100 },
    },
  },
  primary: {
    background: {
      default: { light: colors.B100 },
      hover: { light: colors.B75 },
      active: { light: colors.B200 },
      disabled: { light: colors.DN70 },
    },
    boxShadowColor: {
      focus: { light: colors.B75 },
    },
    color: {
      default: { light: colors.DN30 },
    },
  },
};

function extract(newTheme: any, { appearance, state, mode }: any) {
  if (!newTheme[appearance]) {
    return;
  }
  const root = newTheme[appearance];
  return Object.keys(root).reduce((acc: { [index: string]: string }, val) => {
    let node = root;
    [val, state, mode].forEach(item => {
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

export default (props: ButtonProps) => (
  <Button
    {...props}
    theme={(currentTheme, themeProps) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          ...extract(buttonTheme, themeProps),
        },
        ...rest,
      };
    }}
  />
);
