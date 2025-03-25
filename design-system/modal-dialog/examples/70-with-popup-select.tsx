import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
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

export default function ModalWithPopupSelect() {
	const [isOpen, setIsOpen] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	return (
		<>
			<Button aria-haspopup="dialog" appearance="primary" onClick={open}>
				Open Modal
			</Button>
			<ModalTransition>
				{isOpen && (
					<ModalDialog onClose={close}>
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal with popup select</ModalTitle>
						</ModalHeader>
						<ModalBody>
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
									<Button {...triggerProps} isSelected={isOpen}>
										{isOpen ? 'Close' : 'Open'}
									</Button>
								)}
							/>
						</ModalBody>
					</ModalDialog>
				)}
			</ModalTransition>
		</>
	);
}
