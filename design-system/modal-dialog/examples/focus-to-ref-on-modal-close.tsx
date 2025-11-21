import React, { useCallback, useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '@atlaskit/modal-dialog';
import { Box, Inline } from '@atlaskit/primitives/compiled';

export default function ReturnFocusToElement(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const returnFocusRef = useRef<HTMLButtonElement>(null);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	return (
		<Box testId="return-focus-container" padding="space.200">
			<Inline space="space.200">
				<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="open-modal">
					Open trigger
				</Button>
				<Button appearance="primary" ref={returnFocusRef} testId="return-focus-element">
					Focused on modal close
				</Button>
			</Inline>
			{isOpen && (
				<ModalDialog shouldReturnFocus={returnFocusRef}>
					<ModalHeader hasCloseButton>
						<ModalTitle>Returning focus to custom element</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<p>Modal content</p>
					</ModalBody>
					<ModalFooter>
						<Button appearance="primary" onClick={close} testId="close-modal">
							Close
						</Button>
					</ModalFooter>
				</ModalDialog>
			)}
		</Box>
	);
}
