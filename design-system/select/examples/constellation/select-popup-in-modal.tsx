import React, { useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer/compiled';
import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import ModalDialog, {
	ModalBody,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { PopupSelect } from '@atlaskit/select';

const options = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
	{ label: 'Canberra', value: 'canberra' },
	{ label: 'Darwin', value: 'darwin' },
	{ label: 'Hobart', value: 'hobart' },
	{ label: 'Melbourne', value: 'melbourne' },
	{ label: 'Perth', value: 'perth' },
	{ label: 'Sydney', value: 'sydney' },
];

const SelectPopupModalExample = () => {
	const [type, setType] = useState<'modal' | 'drawer'>();

	const popupSelectElement = (
		<PopupSelect
			isSearchable={false}
			options={options}
			menuPlacement="bottom"
			popperProps={{
				modifiers: [
					{ name: 'offset', options: { offset: [0, 8] } },
					{
						name: 'preventOverflow',
						enabled: false,
					},
				],
			}}
			target={({ isOpen, ...triggerProps }) => (
				<Button {...triggerProps} isSelected={isOpen} iconAfter={ChevronDownIcon}>
					Open
				</Button>
			)}
		/>
	);

	return (
		<>
			<ButtonGroup label="Choose an option">
				<Button onClick={() => setType('modal')}>Open modal</Button>
				<Button onClick={() => setType('drawer')}>Open drawer</Button>
			</ButtonGroup>

			<Drawer
				label="Popup select inside Drawer"
				onClose={() => setType(undefined)}
				isOpen={type === 'drawer'}
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>{popupSelectElement}</DrawerContent>
			</Drawer>

			<ModalTransition>
				{type === 'modal' && (
					<ModalDialog onClose={() => setType(undefined)}>
						<ModalHeader hasCloseButton>
							<ModalTitle>Popup select modal</ModalTitle>
						</ModalHeader>
						<ModalBody>{popupSelectElement}</ModalBody>
					</ModalDialog>
				)}
			</ModalTransition>
		</>
	);
};

export default SelectPopupModalExample;
