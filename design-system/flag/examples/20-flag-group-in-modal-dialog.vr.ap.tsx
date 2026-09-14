import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Flag from '@atlaskit/flag/flag';
import FlagGroup from '@atlaskit/flag/flag-group';
import { FlagsProvider } from '@atlaskit/flag/flags-provider';
import { useFlags } from '@atlaskit/flag/use-flags';
import Heading from '@atlaskit/heading/heading';
import InformationIcon from '@atlaskit/icon/core/status-information';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';

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

export default function Example(): React.JSX.Element {
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
