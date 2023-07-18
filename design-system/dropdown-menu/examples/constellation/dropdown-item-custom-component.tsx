import React, { forwardRef } from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

// CustomComponent should be wrapped in `forwardRef` to avoid accessibility issues when controlling keyboard focus.
const CustomComponent = forwardRef(
  ({ children, ...props }, ref: React.Ref<HTMLAnchorElement>) => (
    <a {...props} ref={ref}>
      {children}
    </a>
  ),
);

const DropdownItemDescriptionExample = () => {
  return (
    <DropdownMenu trigger="Page actions">
      <DropdownItemGroup>
        <DropdownItem href="#test" component={CustomComponent}>
          Move
        </DropdownItem>
        <DropdownItem>Clone</DropdownItem>
        <DropdownItem>Delete</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default DropdownItemDescriptionExample;
