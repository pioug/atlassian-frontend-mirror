import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import MoreIcon from '@atlaskit/icon/glyph/more';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';

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
