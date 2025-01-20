import React from 'react';
import { type WrappedComponentProps, injectIntl } from 'react-intl-next';

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
import { messages } from '../messages';

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
	isOpen: boolean;
	onConfirm: () => void;
	onClose: () => void;
};

export const AbuseModal = injectIntl<'intl', AbuseModalProps & WrappedComponentProps>(
	({ isOpen, onConfirm, onClose, intl: { formatMessage } }) => {
		return (
			<ModalTransition>
				{isOpen && (
					<Modal onClose={onClose} testId="mediaAbuseModal">
						<ModalHeader>
							<Grid gap="space.200" templateAreas={['title close']} xcss={gridStyles}>
								<Flex xcss={closeContainerStyles} justifyContent="end">
									<IconButton
										appearance="subtle"
										icon={CrossIcon}
										label="Close Modal"
										onClick={onClose}
									/>
								</Flex>
								<Flex xcss={titleContainerStyles} justifyContent="start">
									<ModalTitle appearance="warning">
										{formatMessage(messages.abuse_modal_title)}
									</ModalTitle>
								</Flex>
							</Grid>
						</ModalHeader>
						<ModalBody>{formatMessage(messages.abuse_modal_body)}</ModalBody>
						<ModalFooter>
							<Button appearance="subtle" onClick={onClose}>
								{formatMessage(messages.cancel)}
							</Button>
							<Button appearance="warning" onClick={onConfirm}>
								{formatMessage(messages.abuse_modal_submit)}
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		);
	},
);
