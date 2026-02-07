import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import Popup from '@atlaskit/popup';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const NestedDropdownItem = () => (
	<DropdownMenu
		placement="right-start"
		shouldRenderToParent
		trigger={({ triggerRef, ...triggerProps }) => (
			<DropdownItem
				{...triggerProps}
				ref={triggerRef}
				elemAfter={
					<ChevronRightIcon
						size="small"
						spacing="spacious"
						color={token('color.icon.subtle', '')}
						label=""
					/>
				}
			>
				<span>Nested Menu</span>
			</DropdownItem>
		)}
	>
		<DropdownItemGroup>
			<DropdownItem>Nested option one</DropdownItem>
			<DropdownItem>Nested option two</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);

/**
 * Example: Popup with dropdown menus (simple and with nested submenu).
 * Use to verify Escape behavior when a dropdown is inside a popup:
 * 1. Open popup → open dropdown → press Escape: dropdown closes, focus returns to dropdown trigger, popup stays open.
 * 2. Open popup → open "Open nested dropdown" → open "Nested Menu" → press Escape at each level: focus returns to the correct trigger each time.
 */
export default function TestingPopupWithDropdownEscape(): React.JSX.Element {
	const [isPopupOpen, setIsPopupOpen] = useState(false);

	return (
		<Box padding="space.500">
			<Text as="p">
				Open the popup, then open a dropdown. Press Escape — the dropdown should close and focus
				should return to the dropdown trigger; the popup stays open.
			</Text>
			<Popup
				isOpen={isPopupOpen}
				onClose={() => setIsPopupOpen(false)}
				shouldRenderToParent
				placement="bottom-start"
				role="dialog"
				label="Popup with nested dropdown"
				content={() => (
					<Box padding="space.200" testId="popup-content">
						<Stack space="space.200">
							<Text>Simple dropdown:</Text>
							<DropdownMenu
								trigger="Open dropdown"
								testId="dropdown-inside-popup"
								shouldRenderToParent
							>
								<DropdownItemGroup>
									<DropdownItem>Option one</DropdownItem>
									<DropdownItem>Option two</DropdownItem>
									<DropdownItem>Option three</DropdownItem>
								</DropdownItemGroup>
							</DropdownMenu>
							<Text>Dropdown with nested submenu:</Text>
							<DropdownMenu
								trigger="Open nested dropdown"
								testId="nested-dropdown-inside-popup"
								shouldRenderToParent
							>
								<DropdownItemGroup>
									<NestedDropdownItem />
									<DropdownItem>Plain item</DropdownItem>
								</DropdownItemGroup>
							</DropdownMenu>
						</Stack>
					</Box>
				)}
				trigger={(triggerProps) => (
					<Button
						{...triggerProps}
						testId="popup-trigger"
						appearance="default"
						isSelected={isPopupOpen}
						onClick={() => setIsPopupOpen(!isPopupOpen)}
					>
						Open popup
					</Button>
				)}
			/>
		</Box>
	);
}
