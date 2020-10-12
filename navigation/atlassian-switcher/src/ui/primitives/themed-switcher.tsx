import React from 'react';
import Switcher, {
  SwitcherProps,
} from '../components/switcher-components/switcher';
import {
  TopLevelItemWrapperTheme,
  ItemTheme,
  ChildItemTheme,
} from '../theme/default-theme';
import { WithTheme } from '../theme/types';
import { createCustomTheme } from '../theme/theme-builder';

export default ({
  theme,
  appearance = 'drawer',
  ...rest
}: WithTheme & SwitcherProps) => {
  const customTheme = createCustomTheme(theme);

  return (
    <TopLevelItemWrapperTheme.Provider
      value={customTheme.topLevelItemWrapperTheme}
    >
      <ItemTheme.Provider value={customTheme.itemTheme}>
        <ChildItemTheme.Provider value={customTheme.childItemTheme}>
          <Switcher {...rest} appearance={appearance} />
        </ChildItemTheme.Provider>
      </ItemTheme.Provider>
    </TopLevelItemWrapperTheme.Provider>
  );
};
