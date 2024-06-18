/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */
/** @jsx jsx */
import { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';

import { Editor } from '../src';

const bodyStyles = css({
	marginTop: '2rem',
	display: 'center',
	justifyContent: 'center',
	alignItems: 'center',
});

export default () => {
	const [isOpen, setIsOpen] = useState(false);
	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	return (
		<div css={bodyStyles}>
			<Button appearance="primary" onClick={openModal}>
				Open modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={closeModal} width="large">
						<ModalHeader>
							<ModalTitle>Editor inside Modal</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Editor appearance="comment" />
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle" onClick={closeModal}>
								Cancel
							</Button>
							<Button appearance="primary" onClick={closeModal} autoFocus>
								Duplicate
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</div>
	);
};
