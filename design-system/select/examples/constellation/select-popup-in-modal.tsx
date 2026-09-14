import React, { useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/default/button';
import { Drawer } from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { PopupSelect } from '@atlaskit/select/popup-select';

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

const SelectPopupModalExample = (): React.JSX.Element => {
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
