import React, { useState } from 'react';

import { useIntl } from 'react-intl-next';
import { useMutation, graphql } from 'react-relay';

import Button from '@atlaskit/button/new';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import StatusSuccessIcon from '@atlaskit/icon/core/status-success';
import { Text, Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { SyncedBlockPermissionDeniedRequestAccessMutation } from './__generated__/SyncedBlockPermissionDeniedRequestAccessMutation.graphql';
import PermissionDenied from './assets/PermissionDenied.svg';
import { SyncedBlockErrorStateCard } from './SyncedBlockErrorStateCard';

enum RequestAccessState {
	default = 'default',
	errored = 'errored',
	loading = 'loading',
	pending = 'pending',
}

interface SyncedBlockPermissionDeniedProps {
	contentId: string;
}

export const SyncedBlockPermissionDenied = ({ contentId }: SyncedBlockPermissionDeniedProps) => {
	const { formatMessage } = useIntl();
	const [requestAccessState, setRequestAccessState] = useState<RequestAccessState>(
		RequestAccessState.default,
	);

	const handleRequestComplete = () => {
		setRequestAccessState(RequestAccessState.pending);
	};

	const handleRequestError = (error: Error) => {
		setRequestAccessState(RequestAccessState.errored);
	};

	const [commitMutation] = useMutation<SyncedBlockPermissionDeniedRequestAccessMutation>(graphql`
		mutation SyncedBlockPermissionDeniedRequestAccessMutation(
			$requestPageAccessInput: RequestPageAccessInput!
		) {
			requestPageAccess(requestPageAccessInput: $requestPageAccessInput) {
				displayName
			}
		}
	`);

	const onClick = () => {
		setRequestAccessState(RequestAccessState.loading);

		commitMutation({
			variables: {
				requestPageAccessInput: {
					pageId: contentId,
					accessType: 'VIEW',
				},
			},
			onCompleted: () => {
				handleRequestComplete();
			},
			onError: handleRequestError,
		});
	};

	return (
		<SyncedBlockErrorStateCard
			imageSrc={PermissionDenied}
			imageAltText={formatMessage(messages.permissionDeniedAltText)}
			primaryMessage={formatMessage(messages.permissionDeniedHeading)}
			secondaryMessage={formatMessage(messages.permissionDeniedDescription)}
		>
			{requestAccessState === RequestAccessState.pending ? (
				<Flex columnGap="space.050" alignItems="center">
					<StatusSuccessIcon size="small" color={token('color.icon.subtle')} label="" />
					<Text color="color.text.subtlest" weight="bold" testId="sync-block-access-requested-msg">
						{formatMessage(messages.accessRequested)}
					</Text>
				</Flex>
			) : (
				<Flex columnGap="space.100" alignItems="center">
					<Button
						appearance="default"
						spacing="compact"
						onClick={onClick}
						isLoading={requestAccessState === RequestAccessState.loading}
						testId="sync-block-request-access-btn"
					>
						{formatMessage(messages.requestAccessButton)}
					</Button>
					{requestAccessState === RequestAccessState.errored && (
						<Text color="color.text.warning" testId="sync-block-access-error-msg">
							{formatMessage(messages.requestAccessError)}
						</Text>
					)}
				</Flex>
			)}
		</SyncedBlockErrorStateCard>
	);
};
