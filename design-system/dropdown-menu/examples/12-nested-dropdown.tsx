import React from 'react';

import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space075: {
		paddingBlock: token('space.075'),
		paddingInline: token('space.075'),
	},
});

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
						<Flex xcss={iconSpacingStyles.space075}>
							<ChevronRightIcon size="small" color={token('color.icon.subtle')} label="" />
						</Flex>
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
