/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';
import { Placement } from '../src/types';

const gridStyles = css({
  display: 'grid',
  height: '100vh',
  gridTemplateColumns: 'repeat(3, 1fr)',
});

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
    <div>
      <Text as="p">{description}</Text>
      <DropdownMenu trigger={placement} defaultOpen placement={placement}>
        <DropdownItemGroup>{dropdownItems}</DropdownItemGroup>
      </DropdownMenu>
    </div>
  );
};

const DropdownMenuDefaultExample = () => {
  return (
    <div css={gridStyles}>
      <ExampleDropdown
        description={
          <Fragment>
            Auto relocating to <br />
            ensure visibility
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
            Auto relocating to <br />
            ensure visibility
          </Fragment>
        }
        placement="right-end"
      />

      <ExampleDropdown
        description={
          <Fragment>
            Natural right
            <br />
            behavior
          </Fragment>
        }
        placement="right"
      />
      <ExampleDropdown
        description="Natural bottom-end behavior"
        placement="bottom-end"
      />
      <div>
        <ExampleDropdown placement="top" />
        <Text>Natural top behavior</Text>
      </div>

      <ExampleDropdown
        description={
          <Fragment>
            Auto relocating to
            <br />
            ensure visibility
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
    </div>
  );
};

export default DropdownMenuDefaultExample;
