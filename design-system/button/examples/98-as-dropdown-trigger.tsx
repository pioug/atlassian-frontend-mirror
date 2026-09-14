import React from 'react';

import IconButton from '@atlaskit/button/icon/button';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import { Box } from '@atlaskit/primitives/compiled';

/**
 * This example recreates an edge case where icon render props cause
 * the icon to render twice, causing the button to not trigger the first click.
 */
export default function AsDropdownTriggerExample(): React.JSX.Element {
	return (
		<Box padding="space.200">
			<DropdownMenu<HTMLButtonElement>
				trigger={({ triggerRef, ...props }) => (
					<IconButton
						{...props}
						icon={(iconProps) => <MoreIcon {...iconProps} />}
						label="more"
						ref={triggerRef}
						testId="button"
					/>
				)}
				shouldRenderToParent
				testId="dropdown"
			>
				<DropdownItemGroup>
					<DropdownItem>Edit</DropdownItem>
					<DropdownItem>Share</DropdownItem>
					<DropdownItem>Move</DropdownItem>
					<DropdownItem>Clone</DropdownItem>
					<DropdownItem>Delete</DropdownItem>
					<DropdownItem>Report</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>
		</Box>
	);
}
