import React, { forwardRef } from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';

// CustomComponent should be wrapped in `forwardRef` to avoid accessibility issues when controlling keyboard focus.
const CustomComponent: React.ForwardRefExoticComponent<
	React.PropsWithChildren & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, React.PropsWithChildren>((props, ref) => (
	<button {...props} type="button" role="menuitem" ref={ref} />
));

export default (): React.JSX.Element => (
	<DropdownMenu
		trigger="Page actions"
		onOpenChange={(e) => console.log('dropdown opened', e)}
		testId="dropdown"
		shouldRenderToParent
	>
		<DropdownItemGroup>
			<DropdownItem
				// @ts-expect-error - Added during @types/react@~18.3.24 upgrade.
				component={CustomComponent}
			>
				Move
			</DropdownItem>
			<DropdownItem>Clone</DropdownItem>
			<DropdownItem>Delete</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);
