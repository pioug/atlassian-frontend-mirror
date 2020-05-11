import React from 'react';

import { code, Example, md } from '@atlaskit/docs';

export default md`
  By default your dropdown menu will be absolutely positioned next to your trigger.

  ${code`
  <DropdownMenu triggerType="button">
    <DropdownItemGroup>
      <DropdownItem>Sydney</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
  `}

  ${(
    <Example
      packageName="@atlaskit/dropdown-menu"
      Component={require('../examples/positioning/default').default}
      title=""
      source={require('!!raw-loader!../examples/positioning/default')}
    />
  )}

  Somtimes you'll want the menu to be longer to reduce scrolling,
  so you enable it with \`appearance="tall"\`.

  ${code`
  <DropdownMenu appearance="tall" triggerType="button">
    <DropdownItemGroup>
      <DropdownItem>Sydney</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
  `}

  ${(
    <Example
      packageName="@atlaskit/dropdown-menu"
      Component={require('../examples/positioning/tall').default}
      title=""
      source={require('!!raw-loader!../examples/positioning/tall')}
    />
  )}

  But then this has other disadvantages depending how much content there is in the menu and how small your users viewport is,
  resize your viewport down and you'll see the menu go outside!
  Not ideal.

  If we have a lot of elements in the menu and we see it going outside of the viewport it might be beneficial keep the menu inside the viewport which we can enable using the \`isMenuFixed\` and
  \`boundariesElement\` props.

  ${code`
  <DropdownMenu
    isMenuFixed
    boundariesElement="viewport"
    appearance="tall"
    triggerType="button"
  >
    <DropdownItemGroup>
      <DropdownItem>Sydney</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
  `}

  ${(
    <Example
      packageName="@atlaskit/dropdown-menu"
      Component={require('../examples/positioning/fixed').default}
      title=""
      source={require('!!raw-loader!../examples/positioning/fixed')}
    />
  )}
`;
