import React, { Fragment } from 'react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';
import { Placement } from '../src/types';

const gridStyles: React.CSSProperties = {
  display: 'grid',
  height: '100vh',
  gridTemplateColumns: 'repeat(3, 1fr)',
};

const ExampleDropdown = ({
  numItems = 3,
  description,
  placement = 'bottom-start',
}: {
  numItems?: number;
  description?: any;
  placement?: Placement;
}) => {
  const dropdownItems = [];
  for (let i = 0; i < numItems; i++) {
    dropdownItems.push(<DropdownItem key={i}>Edit</DropdownItem>);
  }
  return (
    <Box display="block">
      <Text as="p">{description}</Text>
      <DropdownMenu trigger={placement} defaultOpen placement={placement}>
        <DropdownItemGroup>{dropdownItems}</DropdownItemGroup>
      </DropdownMenu>
    </Box>
  );
};

const DropdownMenuDefaultExample = () => {
  return (
    <Box UNSAFE_style={gridStyles}>
      <ExampleDropdown
        description={
          <Fragment>
            <Text as="p">Auto relocating to</Text>
            <Text as="p">ensure visibility</Text>
          </Fragment>
        }
        placement="left-end"
      />
      <ExampleDropdown
        description="Auto relocating to ensure visibility"
        placement="top-end"
      />
      <ExampleDropdown
        description={
          <Fragment>
            <Text as="p">Auto relocating to</Text>
            <Text as="p">ensure visibility</Text>
          </Fragment>
        }
        placement="right-end"
      />

      <ExampleDropdown
        description={
          <Fragment>
            <Text as="p">Natural right</Text>
            <Text as="p">behavior</Text>
          </Fragment>
        }
        placement="right"
      />
      <ExampleDropdown
        description="Natural bottom-end behavior"
        placement="bottom-end"
      />
      <Box display="block">
        <ExampleDropdown placement="top" />
        <Text>Natural top behavior</Text>
      </Box>

      <ExampleDropdown
        description={
          <Fragment>
            <Text as="p">Auto relocating to</Text>
            <Text as="p">ensure visibility</Text>
          </Fragment>
        }
        placement="left-end"
      />
      <ExampleDropdown
        description="Long menus become scrollable"
        numItems={50}
        placement="left-start"
      />
      <ExampleDropdown
        description="auto places the popup on the side with the most space available"
        placement="auto"
      />
    </Box>
  );
};

export default DropdownMenuDefaultExample;
