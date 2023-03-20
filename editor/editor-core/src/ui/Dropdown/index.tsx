import { Dropdown as DropdownComponent } from '@atlaskit/editor-common/ui-menu';
import React, { useContext } from 'react';
import { KeyDownHandlerContext } from '../ToolbarArrowKeyNavigationProvider';

const Dropdown: React.FC<any> = React.memo(({ ...props }) => {
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

export type OpenChangedEvent = {
  isOpen: boolean;
  event: MouseEvent | KeyboardEvent;
};

export default Dropdown;
