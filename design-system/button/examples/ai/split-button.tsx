import React from 'react';

import Button from '@atlaskit/button/default/button';
import IconButton from '@atlaskit/button/icon/button';
import { SplitButton } from '@atlaskit/button/split-button/split-button';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';

const _default_1: React.JSX.Element = (
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
export default _default_1;
