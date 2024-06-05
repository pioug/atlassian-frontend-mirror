/** @jsx jsx */

import { useCallback } from 'react';
import { jsx } from '@emotion/react';

import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';

import { messages } from '../../../messages';
import { type RelatedLinksBaseModalProps } from './types';
import { Box, xcss } from '@atlaskit/primitives';

const fixedWidth = 'small'; // pre-defined 400px by Atlaskit

const boxStyles = xcss({
	height: '396px', // Specified by the designer as this will display 5 incoming links and 2 outgoing links
});

const RelatedLinksBaseModal = ({ onClose, showModal, children }: RelatedLinksBaseModalProps) => {
	const openCompleteHandler = useCallback((el: HTMLElement) => {
		el.focus();
	}, []);

	return (
		<ModalTransition>
			{showModal && (
				<Modal
					testId="related-links-modal"
					onClose={onClose}
					width={fixedWidth}
					autoFocus={false}
					onOpenComplete={openCompleteHandler}
				>
					<ModalHeader>
						<ModalTitle>
							<FormattedMessage {...messages.related_links_modal_title} />
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<Box xcss={boxStyles}>{children}</Box>
					</ModalBody>
					<ModalFooter>
						<Button appearance="primary" onClick={onClose}>
							<FormattedMessage {...messages.close} />
						</Button>
					</ModalFooter>
				</Modal>
			)}
		</ModalTransition>
	);
};

export default RelatedLinksBaseModal;
