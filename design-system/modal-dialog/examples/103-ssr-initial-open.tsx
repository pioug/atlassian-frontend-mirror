import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';

/**
 * Modal that is `isOpen={true}` on initial render. Used by tests; do not
 * modify without checking SSR + hydration parity coverage.
 */
export default function SsrInitialOpenModal(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(true);
	const close = useCallback(() => setIsOpen(false), []);

	return (
		<>
			<p>Page content behind the modal.</p>
			<ModalTransition>
				{isOpen && (
					<Modal onClose={close} testId="ssr-initial-open-modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Initially open modal</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<p data-testid="ssr-initial-open-modal-body">
								This modal is open on initial render.
							</p>
						</ModalBody>
						<ModalFooter>
							<Button
								appearance="subtle"
								onClick={close}
								testId="ssr-initial-open-modal-close"
							>
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}
