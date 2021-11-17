import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  This is what you'll use for populating the dropdown menu with items.
  Every item should be inside a [dropdown item group](dropdown-menu/docs/dropdown-item-group).

  ${code`
import DropdownMenu, { DropdownItemGroup, DropdownItem } from @atlaskit/dropdown-menu;

<DropdownMenu triggerType="button">
  <DropdownItemGroup>
    <DropdownItem>Sydney</DropdownItem>
  </DropdownItemGroup>
</DropdownMenu>
  `}

  ${(
    <Example
      packageName="@atlaskit/dropdown-menu"
      Component={require('../examples/04-dropdown-item').default}
      title=""
      source={require('!!raw-loader!../examples/04-dropdown-item')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/dropdown-menu-item')}
    />
  )}
`;
