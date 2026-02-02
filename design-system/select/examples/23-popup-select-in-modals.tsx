import React, { useCallback, useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';
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

/**
 * This example demonstrates how to use PopupSelect inside Modal and Drawer
 * without the Modal/Drawer closing unexpectedly when interacting with the Select.
 *
 * Solution:
 * - Track when PopupSelect is open using onOpen/onClose callbacks
 * - Block Modal/Drawer from closing while PopupSelect is open
 * - Add a small delay after PopupSelect closes before allowing Modal/Drawer to close
 *   This ensures the dropdown closes first, then the modal/drawer on the next click.
 */
export default (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const [type, setType] = useState('modal');
	const [canClose, setCanClose] = useState(true);

	const handleClose = useCallback(() => {
		if (!canClose) {
			return;
		}
		setIsOpen(false);
	}, [canClose]);

	const handleSelectOpen = useCallback(() => {
		setCanClose(false);
	}, []);

	const handleSelectClose = useCallback(() => {
		// Add a delay before allowing modal/drawer to close
		// This prevents the same click from closing both the dropdown and the modal/drawer
		setTimeout(() => {
			setCanClose(true);
		}, 200);
	}, []);

	const select = (
		<PopupSelect
			isSearchable={false}
			options={options}
			menuPlacement="bottom"
			onOpen={handleSelectOpen}
			onClose={handleSelectClose}
			popperProps={{
				modifiers: [
					{ name: 'offset', options: { offset: [0, 8] } },
					{
						name: 'preventOverflow',
						enabled: false,
					},
				],
			}}
			target={({ ref }) => <Button ref={ref}>Choose</Button>}
		/>
	);

	return (
		<>
			<ButtonGroup label="Choose an option">
				<Button isSelected={type === 'modal'} onClick={() => setType('modal')}>
					Modal
				</Button>
				<Button isSelected={type === 'drawer'} onClick={() => setType('drawer')}>
					Drawer
				</Button>
				<Button appearance="primary" onClick={() => setIsOpen(true)}>
					Open
				</Button>
			</ButtonGroup>

			{select}

			{type === 'drawer' && (
				<Drawer label="Popup select inside Drawer" onClose={handleClose} isOpen={isOpen}>
					<DrawerSidebar>
						<DrawerCloseButton />
					</DrawerSidebar>
					<DrawerContent>{select}</DrawerContent>
				</Drawer>
			)}

			<ModalTransition>
				{type === 'modal' && isOpen && (
					<ModalDialog onClose={handleClose}>
						<ModalHeader hasCloseButton>
							<ModalTitle>Popup select modal</ModalTitle>
						</ModalHeader>
						<ModalBody>{select}</ModalBody>
					</ModalDialog>
				)}
			</ModalTransition>
		</>
	);
};
