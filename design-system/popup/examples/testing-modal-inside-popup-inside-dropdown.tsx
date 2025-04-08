import React, { forwardRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Modal, { ModalBody, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import Popup from '@atlaskit/popup';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const wrapperStyles = cssMap({
	root: {
		display: 'flex',
		flexDirection: 'column',
	},
});

const ModalDialogComponent = forwardRef<any, any>(({}, ref) => {
	const [showModal, setShowModal] = useState(false);

	return (
		<Box xcss={wrapperStyles.root}>
			<Button
				onClick={() => setShowModal(true)}
				appearance="subtle"
				ref={ref}
				testId="modal-trigger"
			>
				Show modal
			</Button>
			{showModal && (
				<Modal
					onClose={() => {
						setShowModal(false);
					}}
				>
					<ModalHeader hasCloseButton>
						<ModalTitle>Form</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<Box paddingBlockEnd="space.300" testId="modal-content">
							<Stack space="space.050">
								<Text>Clicking inside a modal does not cause the modal or popup to close</Text>
								<Text>
									Clicking outside or pressing the Escape key closes only the modal dialog
								</Text>
							</Stack>
							<Label htmlFor="basic-textfield">Field label</Label>
							<Textfield name="basic" id="basic-textfield" />
						</Box>
					</ModalBody>
				</Modal>
			)}
		</Box>
	);
});

const PopupComponent = () => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			placement="left-start"
			content={({ setInitialFocusRef }) => (
				<Box padding="space.200" testId="popup-content">
					<Stack space="space.100">
						<Text>Popup content</Text>
						<ModalDialogComponent ref={setInitialFocusRef} />
					</Stack>
				</Box>
			)}
			trigger={(triggerProps) => (
				<DropdownItem
					{...triggerProps}
					testId="popup-trigger"
					onClick={() => setIsOpen(!isOpen)}
					isSelected={isOpen}
					elemAfter={<ChevronRightIcon primaryColor={token('color.icon.subtle', '')} label="" />}
				>
					<Text>Open Popup</Text>
				</DropdownItem>
			)}
		/>
	);
};

export default () => (
	<Stack alignInline="start" space="space.200">
		<Heading size="xsmall">
			This example was created due to an issue that appeared that caused hot-111305. The structure
			of this component repeats the implementation on the product where the problem occurred.
		</Heading>
		<DropdownMenu trigger="Page actions" testId="dropdown">
			<DropdownItemGroup>
				<DropdownItem>Clone</DropdownItem>
				<DropdownItem>Delete</DropdownItem>
				<PopupComponent />
			</DropdownItemGroup>
		</DropdownMenu>
	</Stack>
);
