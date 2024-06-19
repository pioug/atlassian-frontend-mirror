import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { Box } from '@atlaskit/primitives';

import { IconButton } from '../src/new';

/**
 * This example recreates an edge case where icon render props cause
 * the icon to render twice, causing the button to not trigger the first click.
 */
export default function AsDropdownTriggerExample() {
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
