import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import Popup from '@atlaskit/popup';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';

export default () => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Inline alignBlock="center" space="space.100">
			<Heading as="h1" size="xsmall">
				Default dropdown inside popup:
			</Heading>
			<Popup
				shouldRenderToParent
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				placement="left-start"
				role="dialog"
				label="Dropdown menu inside Popup"
				content={() => (
					<Box padding="space.200">
						<Stack space="space.050" testId="popup-content">
							<Heading as="h2" size="xsmall">
								Popup content
							</Heading>
							<DropdownMenu trigger="Open dropdown" testId="dropdown">
								<DropdownItemGroup>
									<DropdownItem>Clone</DropdownItem>
									<DropdownItem>Delete</DropdownItem>
								</DropdownItemGroup>
							</DropdownMenu>
						</Stack>
					</Box>
				)}
				trigger={(triggerProps) => (
					<Button
						{...triggerProps}
						testId="popup-trigger"
						isSelected={isOpen}
						onClick={() => setIsOpen(!isOpen)}
					>
						{isOpen ? 'Close' : 'Open'} popup{' '}
					</Button>
				)}
			/>
		</Inline>
	);
};
