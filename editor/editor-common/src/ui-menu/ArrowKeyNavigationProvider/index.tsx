import React from 'react';

import { ColorPaletteArrowKeyNavigationProvider } from './ColorPaletteArrowKeyNavigationProvider';
import { MenuArrowKeyNavigationProvider } from './MenuArrowKeyNavigationProvider';
import {
  ArrowKeyNavigationProviderProps,
  ArrowKeyNavigationType,
} from './types';

export const ArrowKeyNavigationProvider: React.FC<
  ArrowKeyNavigationProviderProps
> = (props) => {
  const { children, type, ...restProps } = props;

  if (type === ArrowKeyNavigationType.COLOR) {
    return (
      <ColorPaletteArrowKeyNavigationProvider
        selectedRowIndex={props.selectedRowIndex}
        selectedColumnIndex={props.selectedColumnIndex}
        isOpenedByKeyboard={props.isOpenedByKeyboard}
        isPopupPositioned={props.isPopupPositioned}
        {...restProps}
      >
        {children}
      </ColorPaletteArrowKeyNavigationProvider>
    );
  }
  return (
    <MenuArrowKeyNavigationProvider {...restProps}>
      {children}
    </MenuArrowKeyNavigationProvider>
  );
};
