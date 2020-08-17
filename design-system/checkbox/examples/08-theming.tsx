import React from 'react';

import merge from 'lodash/merge';

import { Checkbox } from '../src';
import { ComponentTokens, ThemeFn } from '../src/types';

const newThemeTokens: ComponentTokens = {
  label: {
    spacing: {
      top: '6px',
      bottom: '6px',
    },
  },
  icon: {
    size: 'large',
  },
};

const customTheme: ThemeFn = (current, props) => {
  const themeTokens = current(props);
  return merge({}, themeTokens, newThemeTokens);
};

export default () => <Checkbox label="Remember me" theme={customTheme} />;
