import React, { useCallback, useRef } from 'react';

import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';

import { useAnalyticsEvents } from '../../../common/analytics/generated/use-analytics-events';
import { messages } from '../../../messages';

import RelatedLinksBaseModalOld from './RelatedLinksBaseModalOld';
import { type RelatedLinksBaseModalProps } from './types';

const fixedWidth = 'small'; // pre-defined 400px by Atlaskit

const boxStyles = xcss({
	height: '396px', // Specified by the designer as this will display 5 incoming links and 2 outgoing links
});

const RelatedLinksBaseModal = ({ onClose, showModal, children }: RelatedLinksBaseModalProps) => {
	const { fireEvent } = useAnalyticsEvents();
	const modalOpenTimeRef = useRef<number>(Date.now());

	const openCompleteHandler = useCallback(
		(el: HTMLElement) => {
			el.focus();
			modalOpenTimeRef.current = Date.now();
			fireEvent('ui.modal.opened.relatedLinks', {});
		},
		[fireEvent],
	);

	const closeHandler = useCallback(() => {
		fireEvent('ui.modal.closed.relatedLinks', { dwellTime: Date.now() - modalOpenTimeRef.current });
		onClose?.();
	}, [fireEvent, onClose]);

	return (
		<ModalTransition>
			{showModal && (
				<Modal
					testId="related-links-modal"
					onClose={closeHandler}
					width={fixedWidth}
					autoFocus={false}
					shouldReturnFocus={false}
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
						<Button appearance="primary" onClick={closeHandler}>
							<FormattedMessage {...messages.close} />
						</Button>
					</ModalFooter>
				</Modal>
			)}
		</ModalTransition>
	);
};

const RelatedLinksBaseModalExported = (props: RelatedLinksBaseModalProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <RelatedLinksBaseModal {...props} />;
	} else {
		return <RelatedLinksBaseModalOld {...props} />;
	}
};

export default RelatedLinksBaseModalExported;
