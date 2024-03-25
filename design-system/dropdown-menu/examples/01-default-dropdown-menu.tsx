import React, { forwardRef } from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

// CustomComponent should be wrapped in `forwardRef` to avoid accessibility issues when controlling keyboard focus.
const CustomComponent = forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<{}>
>(({ children, ...props }, ref) => (
  <button {...props} type="button" ref={ref}>
    {children}
  </button>
));

export default () => (
  <DropdownMenu
    trigger="Page actions"
    onOpenChange={(e) => console.log('dropdown opened', e)}
    testId="dropdown"
  >
    <DropdownItemGroup>
      <DropdownItem component={CustomComponent}>Move</DropdownItem>
      <DropdownItem>Clone</DropdownItem>
      <DropdownItem>Delete</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);
