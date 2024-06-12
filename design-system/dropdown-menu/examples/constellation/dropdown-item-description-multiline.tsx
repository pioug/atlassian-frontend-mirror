import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemMultilineExample = () => {
	return (
		<DropdownMenu trigger="Page actions" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItem
					description="This is a really long description that is associated with the Edit menu item.
          If shouldDescriptionWrap is true, then this description will wrap multiple lines.
          If it's false, the description will be truncated."
				>
					Edit
				</DropdownItem>
				<DropdownItem
					description="This is a really long description that is associated with the Move menu item.
          If shouldDescriptionWrap is true, then this description will wrap multiple lines.
          If it's false, the description will be truncated."
					shouldDescriptionWrap={false}
				>
					Move
				</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default DropdownItemMultilineExample;
