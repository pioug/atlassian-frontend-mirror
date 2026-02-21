import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { token } from '@atlaskit/tokens';

const NestedDropdown = () => {
	return (
		<DropdownMenu
			placement="right-start"
			shouldRenderToParent
			trigger={({ triggerRef, ...triggerProps }) => (
				<DropdownItem
					{...triggerProps}
					ref={triggerRef}
					elemAfter={
						<ChevronRightIcon
							size="small"
							spacing="spacious"
							color={token('color.icon.subtle', '')}
							label=""
						/>
					}
				>
					<span>Nested Menu</span>
				</DropdownItem>
			)}
		>
			<DropdownItemGroup>
				<NestedDropdown />
				<NestedDropdown />
				<DropdownItem>One of many items</DropdownItem>
				<DropdownItem>One of many items</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};
const NestedDropdownMenuExample = (): React.JSX.Element => {
	return (
		<DropdownMenu trigger="Nested" shouldRenderToParent>
			<DropdownItemGroup>
				<NestedDropdown />
				<NestedDropdown />
				<DropdownItem>first of many items</DropdownItem>
				<DropdownItem>Second of many items</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};
export default NestedDropdownMenuExample;
