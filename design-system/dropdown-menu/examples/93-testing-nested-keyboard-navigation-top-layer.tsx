import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { ButtonItem } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

const NestedDropdown = ({ level = 0 }: { level?: number }) => {
	return (
		<DropdownMenu
			placement="right-start"
			testId={`nested-${level}`}
			trigger={({ triggerRef, ...triggerProps }) => (
				// `role="menuitem"` is required because this ButtonItem is rendered as a
				// direct child of a parent DropdownMenu's `role="menu"` wrapper. Without
				// it, axe flags `aria-required-children` on the parent menu.
				<ButtonItem
					{...triggerProps}
					ref={triggerRef}
					role="menuitem"
					iconAfter={
						<ChevronRightIcon
							size="small"
							spacing="spacious"
							color={token('color.icon.subtle')}
							label=""
						/>
					}
				>
					<span>Nested Menu</span>
				</ButtonItem>
			)}
		>
			<DropdownItemGroup>
				<NestedDropdown level={level + 1} />
				<DropdownItem testId={`nested-item1-${level + 1}`}>One of many items</DropdownItem>
				<DropdownItem testId={`nested-item2-${level + 1}`}>One of many items</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

const NestedDropdownMenuExample = ({ level = 0 }: { level?: number }): React.JSX.Element => {
	return (
		<DropdownMenu trigger="Nested" testId={`nested-${level}`}>
			<DropdownItemGroup>
				<NestedDropdown level={level + 1} />
				<DropdownItem testId={`nested-item1-${level + 1}`}>One of many items</DropdownItem>
				<DropdownItem testId={`nested-item2-${level + 1}`}>One of many items</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default NestedDropdownMenuExample;
