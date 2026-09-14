import React from 'react';

import Button from '@atlaskit/button/default/button';
import IconButton from '@atlaskit/button/icon/button';
import { SplitButton } from '@atlaskit/button/split-button/split-button';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';

const SplitButtonPrimaryExample = (): React.JSX.Element => {
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
