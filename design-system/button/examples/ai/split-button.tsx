import React from 'react';

import Button, { IconButton, SplitButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';

export default (
	<SplitButton spacing="compact">
		<Button>Link work item</Button>
		<DropdownMenu
			shouldRenderToParent
			trigger={({ triggerRef, ...triggerProps }) => (
				<IconButton
					ref={triggerRef}
					{...triggerProps}
					icon={ChevronDownIcon}
					label="More link work item options"
				/>
			)}
		>
			<DropdownItemGroup>
				<DropdownItem>Create new link</DropdownItem>
				<DropdownItem>Link existing item</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	</SplitButton>
);
