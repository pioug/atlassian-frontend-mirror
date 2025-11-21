import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Modal, {
	type Appearance,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';

const appearances: Appearance[] = ['warning', 'danger'];

export default function ExampleAppearance(): React.JSX.Element {
	const [appearance, setAppearance] = useState<Appearance | null>(null);
	const open = useCallback((name: Appearance) => setAppearance(name), []);
	const close = useCallback(() => setAppearance(null), []);

	return (
		<>
			<ButtonGroup label="Choose modal appearance">
				{appearances.map((name) => (
					<Button
						aria-haspopup="dialog"
						key={`${name}-trigger`}
						testId={name}
						onClick={() => open(name)}
					>
						Open: {name}
					</Button>
				))}
			</ButtonGroup>

			<ModalTransition>
				{appearance && (
					<Modal key="active-modal" onClose={close} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle appearance={appearance}>Modal: {appearance}</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Lorem count={2} />
						</ModalBody>
						<ModalFooter>
							<Button testId="secondary" appearance="subtle">
								Secondary Action
							</Button>
							<Button testId={appearance} appearance={appearance} onClick={close}>
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}
