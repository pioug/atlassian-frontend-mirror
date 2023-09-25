/** @jsx jsx */
import React, { useContext } from 'react';

import { jsx } from '@emotion/react';

import DropdownComponent from '../Dropdown';
import { KeyDownHandlerContext } from '../ToolbarArrowKeyNavigationProvider';

export const DropdownContainer: React.FC<any> = React.memo(({ ...props }) => {
  const keyDownHandlerContext = useContext(KeyDownHandlerContext);
  return (
    //This context is to handle the tab, Arrow Right/Left key events for dropdown.
    //Default context has the void callbacks for above key events
    <DropdownComponent
      arrowKeyNavigationProviderOptions={{
        ...props.arrowKeyNavigationProviderOptions,
        keyDownHandlerContext,
      }}
      {...props}
    />
  );
});
