import { DropdownMenu as DropdownComponent } from '@atlaskit/editor-common/ui-menu';
import React, { useContext } from 'react';
import { KeyDownHandlerContext } from '../ToolbarArrowKeyNavigationProvider';

const DropdownMenu: React.FC<any> = React.memo(({ ...props }) => {
  const keydownHandlerContext = useContext(KeyDownHandlerContext);
  //This context is to handle the tab, Arrow Right/Left key events for dropdown.
  //Default context has the void callbacks for above key events
  return (
    <DropdownComponent
      keyDownHandlerContext={keydownHandlerContext}
      {...props}
    />
  );
});

export default DropdownMenu;
