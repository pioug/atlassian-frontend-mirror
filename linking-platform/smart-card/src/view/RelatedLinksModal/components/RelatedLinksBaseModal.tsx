/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useRef } from 'react';

import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';

import { useAnalyticsEvents } from '../../../common/analytics/generated/use-analytics-events';
import { messages } from '../../../messages';

import { type RelatedLinksBaseModalProps } from './types';

const styles = cssMap({
	box: {
		height: '396px',
	},
});

const fixedWidth = 'small'; // pre-defined 400px by Atlaskit

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
					height={fg('platform-linking-visual-refresh-v2') ? '504px' : undefined}
				>
					<ModalHeader>
						<ModalTitle>
							<FormattedMessage
								{...(fg('platform-linking-visual-refresh-v2')
									? messages.related_links_modal_title_v2
									: messages.related_links_modal_title)}
							/>
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						{fg('platform-linking-visual-refresh-v2') ? (
							children
						) : (
							<Box xcss={styles.box}>{children}</Box>
						)}
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

export default RelatedLinksBaseModal;
