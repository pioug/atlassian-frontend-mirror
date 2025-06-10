import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { useMediaClient } from '@atlaskit/media-client-react';
import { MediaClient, type FileIdentifier } from '@atlaskit/media-client';
import { parseError } from './artifactUploader/captions/util';
import ApiFeedback, { type NotificationTypes } from './apiFeedback';
import { type WrappedComponentProps, injectIntl } from 'react-intl-next';
import { messages } from '../../../messages';

export interface CaptionDeleteConfirmationModalProps {
	identifier: FileIdentifier;
	artifactName?: string;
	onClose: () => void;
	onStart?: (artifactName: string) => void;
	onEnd?: () => void;
	onError?: (error: Error) => void;
}

const CaptionDeleteConfirmationModal = ({
	identifier,
	artifactName,
	onClose,
	onStart,
	onEnd,
	onError,
	intl,
}: CaptionDeleteConfirmationModalProps & WrappedComponentProps) => {
	const mediaClient = useMediaClient();
	const [notificationType, setNotificationType] = useState<NotificationTypes>(null);
	const _onError = (error: any) => {
		setNotificationType('error');
		onError?.(error);
	};
	const _onEnd = () => {
		setNotificationType('success');
		onEnd?.();
	};

	return (
		<>
			<ModalTransition>
				{artifactName && (
					<Modal onClose={onClose}>
						<ModalHeader hasCloseButton>
							<ModalTitle appearance="danger">
								{intl.formatMessage(messages.video_captions_delete_captions_confirmation_header)}
							</ModalTitle>
						</ModalHeader>
						<ModalBody>
							{intl.formatMessage(messages.video_captions_delete_captions_confirmation_description)}
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle" onClick={onClose}>
								{intl.formatMessage(messages.cancel)}
							</Button>
							<Button
								appearance="danger"
								onClick={() => {
									deleteCaption(mediaClient, identifier, artifactName!, onStart, _onEnd, _onError);
									onClose();
								}}
							>
								{intl.formatMessage(messages.delete)}
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
			<ApiFeedback
				notificationType={notificationType}
				onDismissed={() => setNotificationType(null)}
				successDescription={intl.formatMessage(messages.video_captions_delete_success_description)}
				errorDescription={intl.formatMessage(messages.video_captions_delete_error_description)}
			/>
		</>
	);
};

export default injectIntl(CaptionDeleteConfirmationModal);

const deleteCaption = async (
	mediaClient: MediaClient,
	identifier: FileIdentifier,
	artifactName: string,
	onStart?: (artifactName: string) => void,
	onEnd?: () => void,
	onError?: (error: Error) => void,
) => {
	onStart?.(artifactName);
	try {
		await mediaClient.file.deleteArtifact(
			identifier.id,
			{ artifactName },
			identifier.collectionName,
		);
		onEnd?.();
	} catch (error) {
		onError?.(parseError(error));
	}
};
