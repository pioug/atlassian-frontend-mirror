import React from 'react';

import Button, { IconButton, SplitButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';

const SplitButtonPrimaryExample = () => {
	return (
		<SplitButton appearance="primary">
			<Button>Update</Button>
			<DropdownMenu<HTMLButtonElement>
				shouldRenderToParent
				trigger={({ triggerRef, ...triggerProps }) => (
					<IconButton
						ref={triggerRef}
						{...triggerProps}
						icon={ChevronDownIcon}
						label="More update options"
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
