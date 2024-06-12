import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

import Button, { IconButton, SplitButton } from '../../../../src/new';

const SplitButtonPrimaryExample = () => {
	return (
		<SplitButton spacing="compact">
			<Button>Link issue</Button>
			<DropdownMenu<HTMLButtonElement>
				trigger={({ triggerRef, ...triggerProps }) => (
					<IconButton
						ref={triggerRef}
						{...triggerProps}
						icon={ChevronDownIcon}
						label="More link issue options"
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
