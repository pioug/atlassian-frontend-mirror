import React, { useCallback, useState } from 'react';

import PlaceholderContent from './placeholder-content';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/default/button';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import type { Appearance } from '@atlaskit/modal-dialog/types';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';

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
							<PlaceholderContent count={2} />
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
