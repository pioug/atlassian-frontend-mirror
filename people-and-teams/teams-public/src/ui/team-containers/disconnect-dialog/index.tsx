import React from 'react';

import { defineMessages, FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '@atlaskit/modal-dialog';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';

import { type ContainerTypes } from '../../../common/types';

export const messages = defineMessages({
	disconnectDialogTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.disconnect-dialog.title',
		defaultMessage: 'Disconnect place',
		description: 'Title of the disconnect dialog for team containers',
	},
	disconnectDialogDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.disconnect-dialog.description',
		defaultMessage: `This team will no longer be connected to the {containerName} {containerType, select,
			JiraProject {Jira project}
			ConfluenceSpace {Confluence space}
			LoomSpace {Loom space}
			other {link}
		}.`,
		description: 'Description of the disconnect dialog for team containers',
	},
	disconnectDialogDisclaimer: {
		id: 'ptc-directory.team-profile-page.team-containers.disconnect-dialog.disclaimer',
		defaultMessage: `Disconnecting the team from the {containerType, select,
			JiraProject {project}
			ConfluenceSpace {space}
			LoomSpace {space}
			other {link}
		} will not affect any work connected to the team within the {containerType, select,
			JiraProject {project}
			ConfluenceSpace {space}
			LoomSpace {space}
			other {link}
		}.`,
		description: 'Disclaimer of the disconnect dialog for team containers',
	},
	disconnectDialogDisclaimerFallback: {
		id: 'ptc-directory.team-profile-page.team-containers.disconnect-dialog.disclaimer-fallback',
		defaultMessage:
			'Disconnecting the team from the link will not affect any work connected to the team.',
		description: 'Disclaimer shown for web links when disconnecting team containers',
	},
	disconnectDialogCancelButton: {
		id: 'ptc-directory.team-profile-page.team-containers.disconnect-dialog.cancel-button',
		defaultMessage: 'Cancel',
		description: 'Button to cancel the dialog',
	},
	disconnectDialogRemoveButton: {
		id: 'ptc-directory.team-profile-page.team-containers.disconnect-dialog.remove-button',
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

	return (
		<ModalDialog
			onClose={onClose}
			width="small"
			testId="team-containers-disconnect-dialog"
			shouldScrollInViewport
		>
			<ModalHeader hasCloseButton>
				<ModalTitle appearance="warning">
					<FormattedMessage {...messages.disconnectDialogTitle} />
				</ModalTitle>
			</ModalHeader>
			<ModalBody>
				<Stack space="space.150">
					<Box>
						<FormattedMessage
							{...messages.disconnectDialogDescription}
							values={{
								containerName: <Text weight="semibold">{containerName}</Text>,
								containerType,
							}}
						/>
					</Box>

					<FormattedMessage {...messages.disconnectDialogDisclaimer} values={{ containerType }} />
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
