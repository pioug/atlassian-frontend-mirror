import React, { Fragment } from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';
import { Placement } from '../src/types';

const ExampleDropdown = ({
  numItems = 6,
  placement = 'bottom-start',
}: {
  numItems?: number;
  placement?: Placement;
}) => {
  const dropdownItems = [];
  for (let i = 0; i < numItems; i++) {
    dropdownItems.push(<DropdownItem key={i}>Edit</DropdownItem>);
  }
  return (
    <DropdownMenu trigger={`${placement}`} defaultOpen placement={placement}>
      <DropdownItemGroup>{dropdownItems}</DropdownItemGroup>
    </DropdownMenu>
  );
};

const DropdownMenuDefaultExample = () => {
  return (
    <Fragment>
      <div
        style={{
          position: 'fixed',
          left: '5px',
          top: '200px',
        }}
      >
        <ExampleDropdown />
      </div>
      <div
        style={{
          position: 'fixed',
          left: '5px',
          bottom: '200px',
        }}
      >
        <ExampleDropdown />
      </div>
      <div
        style={{
          position: 'fixed',
          left: '160px',
          bottom: '200px',
        }}
      >
        <ExampleDropdown placement="right-start" />
      </div>
      <div
        style={{
          position: 'fixed',
          right: '200px',
        }}
      >
        <ExampleDropdown numItems={50} placement="bottom-end" />
      </div>

      <div
        style={{
          position: 'fixed',
          top: '300px',
          right: '-40px',
        }}
      >
        <ExampleDropdown numItems={50} placement="bottom-end" />
      </div>
    </Fragment>
  );
};

export default DropdownMenuDefaultExample;
