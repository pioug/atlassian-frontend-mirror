import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Box } from '@atlaskit/primitives';
import Select from '@atlaskit/select';

import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from '../src';

import ModalTitleWithClose from './common/modal-title';

const SingleExample = () => (
	<Select
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className="single-select"
		classNamePrefix="react-select"
		options={[
			{ label: 'Adelaide', value: 'adelaide' },
			{ label: 'Brisbane', value: 'brisbane' },
			{ label: 'Canberra', value: 'canberra' },
			{ label: 'Darwin', value: 'darwin' },
			{ label: 'Hobart', value: 'hobart' },
			{ label: 'Melbourne', value: 'melbourne' },
			{ label: 'Perth', value: 'perth' },
			{ label: 'Sydney', value: 'sydney' },
		]}
		placeholder="Choose a City"
		// Make it appear over the top of the modal rather than scrollable
		menuPosition="fixed"
	/>
);

export default function DefaultModal() {
	const [isOpen, setIsOpen] = useState<Boolean>(false);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	const Footer = () => {
		return (
			<ModalFooter>
				<Button appearance="primary" onClick={close}>
					test button
				</Button>
			</ModalFooter>
		);
	};

	return (
		<>
			<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="modal-trigger">
				Open Modal
			</Button>
			<ModalTransition>
				{isOpen && (
					<Modal onClose={close} testId="modal">
						<ModalHeader>
							<ModalTitleWithClose onClose={close}>
								<ModalTitle>Modal Title</ModalTitle>
							</ModalTitleWithClose>
						</ModalHeader>
						<ModalBody>
							<Box testId="dialog-body">
								<SingleExample />
							</Box>
						</ModalBody>
						<Footer />
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}
