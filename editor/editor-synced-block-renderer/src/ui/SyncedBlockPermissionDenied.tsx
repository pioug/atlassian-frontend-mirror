import React, { useState } from 'react';

import { useIntl } from 'react-intl-next';
import { useMutation, graphql } from 'react-relay';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import Heading from '@atlaskit/heading';
import StatusSuccessIcon from '@atlaskit/icon/core/status-success';
import Image from '@atlaskit/image';
import { Box, Text, Stack, Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { SyncedBlockPermissionDeniedRequestAccessMutation } from './__generated__/SyncedBlockPermissionDeniedRequestAccessMutation.graphql';
import PermissionDenied from './assets/PermissionDenied.svg';

const styles = cssMap({
	wrapper: {
		paddingTop: token('space.250'),
		paddingBottom: token('space.250'),
		paddingLeft: token('space.400'),
		paddingRight: token('space.250'),
		backgroundColor: token('color.background.disabled'),
		display: 'flex',
		justifyContent: 'start',
		alignItems: 'center',
		borderRadius: token('radius.small'),
		gap: token('space.100'),
	},
	textWrapper: {
		marginLeft: token('space.100'),
	},
});

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
		<Box xcss={styles.wrapper}>
			<Image
				src={PermissionDenied}
				alt={formatMessage(messages.permissionDeniedAltText)}
				width="48"
				height="48"
			/>
			<Stack space="space.100" alignInline="start" xcss={styles.textWrapper}>
				<Heading size="xsmall">{formatMessage(messages.permissionDeniedHeading)}</Heading>
				<Text color="color.text.subtle">{formatMessage(messages.permissionDeniedDescription)}</Text>
				{requestAccessState === RequestAccessState.pending ? (
					<Flex columnGap="space.050" alignItems="center">
						<StatusSuccessIcon size="small" color={token('color.icon.subtle')} label="" />
						<Text
							color="color.text.subtlest"
							weight="bold"
							testId="sync-block-access-requested-msg"
						>
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
			</Stack>
		</Box>
	);
};
