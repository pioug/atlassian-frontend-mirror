import React from 'react';

import { CSSObject } from '@emotion/core';

import { Checkbox } from '../../src';
import { IconWrapperCSSProps } from '../../src/types';

const customCssFn = (defaultStyles: CSSObject, state: IconWrapperCSSProps) => ({
  ...defaultStyles,
  transition: 'all 0.3 cubic-bezier',
});

const CheckboxCustomStyles = () => (
  <Checkbox
    label="Changing transition styles!"
    overrides={{
      IconWrapper: {
        cssFn: customCssFn,
      },
    }}
  />
);

export default CheckboxCustomStyles;
