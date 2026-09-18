import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';

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
							<p data-testid="ssr-initial-open-modal-body">This modal is open on initial render.</p>
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle" onClick={close} testId="ssr-initial-open-modal-close">
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}
