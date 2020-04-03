import React from 'react';
import { N40 } from '@atlaskit/theme/colors';
import merge from 'lodash.merge';

import IconIndeterminate from '@atlaskit/icon/glyph/add-circle';
import Icon from '@atlaskit/icon/glyph/check-circle';

import { Checkbox } from '../src';
import { ComponentTokens, ThemeTokens } from '../src/types';

// Customising the resting boxColor, so that we can actually see the new icon in a resting state
const newThemeTokens: ComponentTokens = {
  icon: {
    boxColor: {
      rest: N40,
    },
  },
};

const customTheme = (
  current: (props: { tokens: ComponentTokens; mode: string }) => ThemeTokens,
  props: { tokens: ComponentTokens; mode: string },
) => {
  const themeTokens = current(props);
  return merge({}, themeTokens, newThemeTokens);
};

export default () => (
  <Checkbox
    label="That's not a standard Icon!"
    theme={customTheme}
    overrides={{
      Icon: {
        // Adding a custom Icon component
        component: Icon,
      },
      IconIndeterminate: {
        // Adding a custom Icon component for the indeterminate state
        component: IconIndeterminate,
      },
    }}
  />
);
