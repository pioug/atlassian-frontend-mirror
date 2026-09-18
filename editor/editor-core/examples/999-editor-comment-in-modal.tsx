/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/default/button';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';

import { Editor } from '../src';

const bodyStyles = css({
	marginTop: '2rem',
	display: 'center',
	justifyContent: 'center',
	alignItems: 'center',
});

export default (): jsx.JSX.Element => {
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
						<ModalHeader hasCloseButton>
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
