import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  When wanting to present a user with groups that have a multiple selections.
  Every item should be inside a [dropdown item group checkbox](dropdown-menu/docs/dropdown-item-group).

  ${code`
import DropdownMenu, { DropdownItemGroupCheckbox, DropdownItemCheckbox } from @atlaskit/dropdown-menu;

<DropdownMenu triggerType="button">
  <DropdownItemGroupCheckbox id="cities">
    <DropdownItemCheckbox id="sydney">Sydney</DropdownItemCheckbox>
  </DropdownItemGroupCheckbox>
</DropdownMenu>
  `}

  ${(
    <Example
      packageName="@atlaskit/dropdown-menu"
      Component={require('../examples/05-dropdown-item-checkbox').default}
      title=""
      source={require('!!raw-loader!../examples/05-dropdown-item-checkbox')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/checkbox/dropdown-item-checkbox')}
    />
  )}
`;
