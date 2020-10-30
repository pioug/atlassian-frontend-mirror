import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  When wanting to present a user with groups that have a single selection.
  Every item should be inside a [dropdown item group radio](dropdown-menu/docs/dropdown-item-group).

  ${code`
import DropdownMenu, { DropdownItemGroupRadio, DropdownItemRadio } from @atlaskit/dropdown-menu;

<DropdownMenu triggerType="button">
  <DropdownItemGroupRadio id="cities">
    <DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
  </DropdownItemGroupRadio>
</DropdownMenu>
  `}

  ${(
    <Example
      packageName="@atlaskit/dropdown-menu"
      Component={require('../examples/07-dropdown-item-radio').default}
      title=""
      source={require('!!raw-loader!../examples/07-dropdown-item-radio')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/item/ert-item-radio')}
    />
  )}
`;
