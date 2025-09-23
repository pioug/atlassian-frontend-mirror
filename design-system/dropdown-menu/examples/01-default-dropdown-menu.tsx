import React, { forwardRef } from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

// CustomComponent should be wrapped in `forwardRef` to avoid accessibility issues when controlling keyboard focus.
const CustomComponent = forwardRef<HTMLButtonElement, React.PropsWithChildren>((props, ref) => (
	<button {...props} type="button" role="menuitem" ref={ref} />
));

export default () => (
	<DropdownMenu
		trigger="Page actions"
		onOpenChange={(e) => console.log('dropdown opened', e)}
		testId="dropdown"
		shouldRenderToParent
	>
		<DropdownItemGroup>
			<DropdownItem component={CustomComponent}>Move</DropdownItem>
			<DropdownItem>Clone</DropdownItem>
			<DropdownItem>Delete</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);
