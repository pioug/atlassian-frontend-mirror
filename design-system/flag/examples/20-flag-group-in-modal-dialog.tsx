import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import Flag, { FlagGroup, FlagsProvider, useFlags } from '@atlaskit/flag';
import Heading from '@atlaskit/heading';
import InformationIcon from '@atlaskit/icon/core/status-information';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';

function FlagsInModalDialogExample() {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [flags, setFlags] = useState<Array<number>>([]);

	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	const addFlag = useCallback(() => {
		setFlags((prevFlags) => {
			const newFlagId = prevFlags.length + 1;
			const newFlags = prevFlags.slice();
			newFlags.splice(0, 0, newFlagId);
			return newFlags;
		});
	}, []);

	const handleDismissFlag = useCallback(() => {
		setFlags((prevFlags) => prevFlags.slice(1));
	}, []);

	return (
		<>
			<Button appearance="primary" onClick={openModal}>
				Open modal
			</Button>
			<ModalTransition>
				{isOpen && (
					<Modal onClose={closeModal} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal Title</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Button onClick={addFlag}>Add flag</Button>
							<FlagGroup onDismissed={handleDismissFlag} shouldRenderToParent>
								{flags.map((flagId) => {
									return (
										<Flag
											id={flagId}
											icon={<InformationIcon label="Info" />}
											key={flagId}
											title={`Flag #${flagId}`}
											description="Example flag description"
										/>
									);
								})}
							</FlagGroup>
						</ModalBody>
						<ModalFooter>
							<Button testId="primary" appearance="primary" onClick={closeModal}>
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}

function FlagGroupInProvider() {
	const { showFlag } = useFlags();

	const addFlag = useCallback(() => {
		showFlag({
			description: 'Example flag description',
			icon: <InformationIcon label="Info" />,
			title: `Example flag title`,
		});
	}, [showFlag]);

	return <Button onClick={addFlag}>Add flag</Button>;
}

function ModalWithFlagProviderExample() {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	return (
		<>
			<Button appearance="primary" onClick={openModal}>
				Open modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={closeModal} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal Title</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<FlagsProvider shouldRenderToParent>
								<FlagGroupInProvider />
							</FlagsProvider>
						</ModalBody>
						<ModalFooter>
							<Button testId="primary" appearance="primary" onClick={closeModal}>
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}

export default function Example() {
	return (
		<>
			<Heading size="medium">Accessible Flag group in modal</Heading>
			<FlagsInModalDialogExample />
			<Heading size="medium">
				Accessible Flag group in modal using FlagsProvider and useFlags hook
			</Heading>
			<ModalWithFlagProviderExample />
		</>
	);
}
