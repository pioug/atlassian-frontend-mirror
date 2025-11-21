import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import { ButtonItem } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

const NestedDropdown = ({ level = 0 }) => {
	return (
		<DropdownMenu
			shouldRenderToParent
			placement="right-start"
			testId={`nested-${level}`}
			trigger={({ triggerRef, ...triggerProps }) => (
				<ButtonItem
					{...triggerProps}
					ref={triggerRef}
					iconAfter={<ChevronRightIcon primaryColor={token('color.icon.subtle')} label="" />}
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
const NestedDropdownMenuExample = ({ level = 0 }): React.JSX.Element => {
	return (
		<DropdownMenu shouldRenderToParent trigger="Nested" testId={`nested-${level}`}>
			<DropdownItemGroup>
				<NestedDropdown level={level + 1} />
				<DropdownItem testId={`nested-item1-${level + 1}`}>One of many items</DropdownItem>
				<DropdownItem testId={`nested-item1-${level + 1}`}>One of many items</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default NestedDropdownMenuExample;
