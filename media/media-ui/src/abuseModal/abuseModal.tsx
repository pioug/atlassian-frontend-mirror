import React, { useCallback, useState, useImperativeHandle, forwardRef } from 'react';

import Button, { IconButton } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/core/migration/close--cross';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Flex, Grid, xcss } from '@atlaskit/primitives';

const gridStyles = xcss({
	width: '100%',
});

const closeContainerStyles = xcss({
	gridArea: 'close',
});

const titleContainerStyles = xcss({
	gridArea: 'title',
});

export type AbuseModalProps = {
	onConfirm?: () => void;
	onClose?: () => void;
	shouldMount: boolean;
};

export const AbuseModal = forwardRef<() => void, AbuseModalProps>(
	({ onConfirm, shouldMount }, ref) => {
		const [isOpen, setIsOpen] = useState(false);
		const closeModal = useCallback(() => setIsOpen(false), []);

		const confirm = useCallback(() => {
			onConfirm?.();
			closeModal();
		}, [onConfirm, closeModal]);

		useImperativeHandle(ref, () => {
			return () => setIsOpen(true);
		}, []);

		return !shouldMount ? null : (
			<ModalTransition>
				{isOpen && (
					<Modal onClose={closeModal} testId="mediaAbuseModal">
						<ModalHeader>
							<Grid gap="space.200" templateAreas={['title close']} xcss={gridStyles}>
								<Flex xcss={closeContainerStyles} justifyContent="end">
									<IconButton
										appearance="subtle"
										icon={CrossIcon}
										label="Close Modal"
										onClick={closeModal}
									/>
								</Flex>
								<Flex xcss={titleContainerStyles} justifyContent="start">
									<ModalTitle appearance="warning">Warning</ModalTitle>
								</Flex>
							</Grid>
						</ModalHeader>
						<ModalBody>
							This file has been labelled as abusive. Please proceed with caution.
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle" onClick={closeModal}>
								Cancel
							</Button>
							<Button appearance="warning" onClick={confirm}>
								Proceed with download
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		);
	},
);
