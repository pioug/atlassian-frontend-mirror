import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  All items need to be wrapped in a group,
  there are three available for you to use depending what children it has.

  ${code`
  import DropdownMenu, {
    DropdownItem,
    DropdownItemCheckbox,
    DropdownItemGroup,
    DropdownItemGroupCheckbox,
    DropdownItemGroupRadio,
    DropdownItemRadio,
  } from '@atlaskit/dropdown-menu';

<DropdownMenu triggerType="button">
  <DropdownItemGroupRadio title="Aussie cities" id="au">
    <DropdownItemRadio id="adelaide">Adelaide</DropdownItemRadio>
  </DropdownItemGroupRadio>
  <DropdownItemGroupCheckbox title="American cities" id="usa">
    <DropdownItemCheckbox id="adelaide">San Francisco</DropdownItemCheckbox>
  </DropdownItemGroupCheckbox>
  <DropdownItemGroup title="Canadian cities">
    <DropdownItem>Toronto</DropdownItem>
  </DropdownItemGroup>
</DropdownMenu>
  `}

  ${(
		<Example
			packageName="@atlaskit/dropdown-menu"
			Component={require('../examples/06-dropdown-item-groups').default}
			title=""
			source={require('!!raw-loader!../examples/06-dropdown-item-groups')}
		/>
	)}

  ${(
		<Props
			heading="Dropdown item group props"
			props={require('!!extract-react-types-loader!../src/dropdown-menu-item-group')}
		/>
	)}

  ${(
		<Props
			heading="Dropdown item group checkbox props"
			props={require('!!extract-react-types-loader!../src/checkbox/dropdown-item-checkbox-group')}
		/>
	)}

  ${(
		<Props
			heading="Dropdown item group radio props"
			props={require('!!extract-react-types-loader!../src/radio/dropdown-item-radio-group')}
		/>
	)}
`;
