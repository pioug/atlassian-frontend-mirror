import React from 'react';

import Button, { IconButton, SplitButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down';

const SplitButtonPrimaryExample = () => {
	return (
		<SplitButton spacing="compact">
			<Button>Link work item</Button>
			<DropdownMenu<HTMLButtonElement>
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
					<DropdownItem>Option one</DropdownItem>
					<DropdownItem>Option two</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>
		</SplitButton>
	);
};

export default SplitButtonPrimaryExample;
