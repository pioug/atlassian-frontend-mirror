import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import { Popup } from '@atlaskit/popup/popup';
import { Box, Flex, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space075: {
		paddingBlock: token('space.075'),
		paddingInline: token('space.075'),
	},
});

const MAX_NESTING_LEVEL = 2;

const NestedDropdown = ({ level = 0 }: { level?: number }): React.JSX.Element => (
	<DropdownMenu
		shouldRenderToParent
		placement="right-start"
		shouldPreventEscapePropagation
		testId={`nested-${level}`}
		trigger={({ triggerRef, ...triggerProps }) => (
			<DropdownItem
				{...triggerProps}
				ref={triggerRef}
				elemAfter={
					<Flex xcss={iconSpacingStyles.space075}>
						<ChevronRightIcon size="small" color={token('color.icon.subtle')} label="" />
					</Flex>
				}
			>
				<span>Nested Menu</span>
			</DropdownItem>
		)}
	>
		<DropdownItemGroup>
			{level < MAX_NESTING_LEVEL && <NestedDropdown level={level + 1} />}
			<DropdownItem testId={`nested-item1-${level + 1}`}>One of many items</DropdownItem>
			<DropdownItem testId={`nested-item2-${level + 1}`}>One of many items</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);

const DropdownContent = (): React.JSX.Element => (
	<DropdownItemGroup>
		<NestedDropdown level={0} />
		<DropdownItem>Edit</DropdownItem>
		<DropdownItem>Share</DropdownItem>
	</DropdownItemGroup>
);

export default function ShouldPreventEscapePropagationExample(): React.JSX.Element {
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<Inline alignBlock="center" space="space.100">
				<Popup
					shouldRenderToParent
					isOpen={isPopupOpen}
					onClose={() => setIsPopupOpen(false)}
					placement="left-start"
					role="dialog"
					label="Dropdown menu inside Popup"
					testId="popup"
					content={({ setInitialFocusRef }) => (
						<Box padding="space.200">
							<Stack space="space.050" testId="popup-content">
								<DropdownMenu
									shouldRenderToParent
									shouldPreventEscapePropagation
									trigger={({ triggerRef, ...triggerProps }) => (
										<Button
											{...triggerProps}
											ref={mergeRefs([triggerRef, setInitialFocusRef])}
											testId="dropdown-in-popup--trigger"
										>
											Open dropdown
										</Button>
									)}
									testId="dropdown-in-popup"
								>
									<DropdownContent />
								</DropdownMenu>
							</Stack>
						</Box>
					)}
					trigger={(triggerProps) => (
						<Button
							{...triggerProps}
							testId="popup-trigger"
							isSelected={isPopupOpen}
							onClick={() => setIsPopupOpen(!isPopupOpen)}
						>
							{isPopupOpen ? 'Close' : 'Open'} popup
						</Button>
					)}
				/>
				<Button testId="modal-trigger" onClick={() => setIsModalOpen(true)}>
					Open modal
				</Button>
			</Inline>
			{isModalOpen && (
				<ModalDialog testId="modal" onClose={() => setIsModalOpen(false)}>
					<ModalHeader>
						<ModalTitle>Modal with nested dropdown</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<Box padding="space.200">
							<DropdownMenu
								trigger="Open dropdown"
								shouldRenderToParent
								shouldPreventEscapePropagation
								testId="dropdown-in-modal"
							>
								<DropdownContent />
							</DropdownMenu>
						</Box>
					</ModalBody>
				</ModalDialog>
			)}
		</>
	);
}
