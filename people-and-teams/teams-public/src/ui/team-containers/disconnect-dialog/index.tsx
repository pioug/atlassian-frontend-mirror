import React from 'react';

import { defineMessages, FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '@atlaskit/modal-dialog';
import { Box, Stack } from '@atlaskit/primitives/compiled';

import { type ContainerTypes } from '../../../common/types';
import { getContainerProperties } from '../../../common/utils/get-container-properties';

export const messages = defineMessages({
	disconnectDialogTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.disconnect-dialog.title.non-final',
		defaultMessage: 'Disconnect place',
		description: 'Title of the disconnect dialog for team containers',
	},
	disconnectDialogDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.disconnect-dialog.description.non-final',
		defaultMessage: 'This team will no longer be connected to the {containerName} {containerType}.',
		description: 'Description of the disconnect dialog for team containers',
	},
	disconnectDialogDisclaimer: {
		id: 'ptc-directory.team-profile-page.team-containers.disconnect-dialog.disclaimer.non-final',
		defaultMessage:
			'Disconnecting the team from the {containerType} will not affect any work connected to the team within the {containerType}.',
		description: 'Disclaimer of the disconnect dialog for team containers',
	},
	disconnectDialogCancelButton: {
		id: 'ptc-directory.team-profile-page.team-containers.disconnect-dialog.cancel-button.non-final',
		defaultMessage: 'Cancel',
		description: 'Button to cancel the dialog',
	},
	disconnectDialogRemoveButton: {
		id: 'ptc-directory.team-profile-page.team-containers.disconnect-dialog.remove-button.non-final',
		defaultMessage: 'Remove',
		description: 'Button to disconnect the team from the container',
	},
});

export interface DisconnectDialogProps {
	containerName: string;
	containerType: ContainerTypes;
	onDisconnect: () => Promise<void>;
	onClose: () => void;
}

export const DisconnectDialog = ({
	containerName,
	containerType,
	onDisconnect,
	onClose,
}: DisconnectDialogProps) => {
	const [isDisconnecting, setIsDisconnecting] = React.useState<boolean>(false);
	const handleDisconnect = async () => {
		setIsDisconnecting(true);
		await onDisconnect();
		setIsDisconnecting(false);
	};
	const { containerTypeText, description } = getContainerProperties(containerType);

	return (
		<ModalDialog
			onClose={onClose}
			width="small"
			testId="team-containers-disconnect-dialog"
			shouldScrollInViewport
		>
			<ModalHeader>
				<ModalTitle appearance="warning">
					<FormattedMessage {...messages.disconnectDialogTitle} />
				</ModalTitle>
			</ModalHeader>
			<ModalBody>
				<Stack space="space.150">
					<Box>
						<FormattedMessage
							{...messages.disconnectDialogDescription}
							values={{ containerName: <b>{containerName}</b>, containerType: description }}
						/>
					</Box>
					<FormattedMessage
						{...messages.disconnectDialogDisclaimer}
						values={{ containerType: containerTypeText }}
					/>
				</Stack>
			</ModalBody>
			<ModalFooter>
				<Button appearance="subtle" onClick={onClose}>
					<FormattedMessage {...messages.disconnectDialogCancelButton} />
				</Button>
				<Button appearance="warning" onClick={handleDisconnect} isLoading={isDisconnecting}>
					<FormattedMessage {...messages.disconnectDialogRemoveButton} />
				</Button>
			</ModalFooter>
		</ModalDialog>
	);
};
