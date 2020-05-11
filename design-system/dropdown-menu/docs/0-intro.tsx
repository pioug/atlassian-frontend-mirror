import React from 'react';

import { code, Example, md } from '@atlaskit/docs';

export default md`
  ## Documentation

  All the documentation can be found in the sidebar nav links 👈

  - [Dropdown menu](dropdown-menu/docs/dropdown-menu)
  - [Dropdown item](dropdown-menu/docs/dropdown-item)
  - [Dropdown item radio](dropdown-menu/docs/dropdown-item-radio)
  - [Dropdown item checkbox](dropdown-menu/docs/dropdown-item-checkbox)
  - [Dropdown item group](dropdown-menu/docs/dropdown-item-group)
  - [Positioning](dropdown-menu/docs/positioning)

  ## Usage

${code`
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from @atlaskit/dropdown-menu;

<DropdownMenu
  trigger="Australian Cities"
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
    <Example
      packageName="@atlaskit/dropdown-menu"
      Component={require('../examples/02-complex-dropdown-menu').default}
      title=""
      source={require('!!raw-loader!../examples/02-complex-dropdown-menu')}
    />
  )}
`;
