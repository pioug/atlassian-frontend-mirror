import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  This is the root component that you will use for every dropdown menu.
  It comes with all state management out of the box.
  Need to programatically control the open state?
  You'll want to use \`DropdownMenuStateless\` instead.

  ${code`
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem
} from @atlaskit/dropdown-menu;

<DropdownMenu
  trigger="Choices"
  triggerType="button"
>
  <DropdownItemGroup>
    <DropdownItem>Sydney</DropdownItem>
    <DropdownItem>Melbourne</DropdownItem>
  </DropdownItemGroup>
</DropdownMenu>
  `}

  ${(
    <Example
      packageName="@atlaskit/dropdown-menu"
      Component={require('../examples/01-default-dropdown-menu').default}
      title=""
      source={require('!!raw-loader!../examples/01-default-dropdown-menu')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/DropdownMenu')}
    />
  )}

  ## Stateless

  The only difference between these is this one you can control \`isOpen\` state yourself.
  In a later release these components will be merged into one.

  ${(
    <Example
      packageName="@atlaskit/dropdown-menu"
      Component={require('../examples/03-stateless-dropdown-menu').default}
      title=""
      source={require('!!raw-loader!../examples/03-stateless-dropdown-menu')}
    />
  )}

  ${(
    <Props
      heading="Stateless props"
      props={require('!!extract-react-types-loader!../src/components/DropdownMenuStateless')}
    />
  )}
`;
