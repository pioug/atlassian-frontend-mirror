import React from 'react';

import AddIcon from '@atlaskit/icon/glyph/editor/add';

import { CustomThemeButton } from '../src';

export default () => (
  <CustomThemeButton iconBefore={<AddIcon label="add" />}>
    Button
  </CustomThemeButton>
);
