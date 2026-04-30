import React, { useCallback, useState } from 'react';

import { useIntl } from 'react-intl';
import { useMutation, graphql } from 'react-relay';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { SyncBlockProduct } from '@atlaskit/editor-synced-block-provider';
import { requestJiraSpaceAccess } from '@atlaskit/editor-synced-block-provider/requestJiraIssueAccess';
import Heading from '@atlaskit/heading';
import StatusSuccessIcon from '@atlaskit/icon/core/status-success';
import Image from '@atlaskit/image';
import { fg } from '@atlaskit/platform-feature-flags';
import { Text, Flex, Stack, Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { SyncedBlockPermissionDeniedRequestAccessMutation } from './__generated__/SyncedBlockPermissionDeniedRequestAccessMutation.graphql';
import PermissionDenied from './assets/PermissionDenied.svg';
import { SyncedBlockGenericError } from './SyncedBlockGenericError';

const styles = cssMap({
	wrapper: {
		paddingTop: token('space.250'),
		paddingBottom: token('space.250'),
		paddingLeft: token('space.250'),
		paddingRight: token('space.250'),
		display: 'flex',
		justifyContent: 'start',
		alignItems: 'center',
		gap: token('space.200'),
	},
});

enum RequestAccessState {
	default = 'default',
	errored = 'errored',
	loading = 'loading',
	pending = 'pending',
}

export interface SyncedBlockPermissionDeniedProps {
	accountId: string | null;
	sourceContentId: string;
	sourceProduct: SyncBlockProduct;
}

const SyncedBlockPermissionDeniedConfluencePage = ({
	sourceContentId,
}: {
	sourceContentId: string;
}) => {
	const { formatMessage } = useIntl();
	const [requestAccessState, setRequestAccessState] = useState<RequestAccessState>(
		RequestAccessState.default,
	);

	const handleRequestComplete = () => {
		setRequestAccessState(RequestAccessState.pending);
	};

	const handleRequestError = () => {
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
					pageId: sourceContentId,
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
			<Stack space="space.100">
				<Heading size="xsmall">{formatMessage(messages.permissionDeniedHeading)}</Heading>
				<Text color="color.text.subtle">{formatMessage(messages.permissionDeniedDescription)}</Text>
				{requestAccessState === RequestAccessState.pending ? (
					<Flex columnGap="space.050" alignItems="center">
						<StatusSuccessIcon
							size="small"
							color={token('color.icon.subtle')}
							label={formatMessage(messages.accessRequested)}
						/>
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

/**
 * For Jira we deliberately collapse "success" and "failure" into a single
 * `pending` state — matching the behaviour of `useRequestAccessSubmit` in
 * `jira/src/packages/issue/request-access-modal`. The endpoint returns no
 * distinguishable error information for security reasons.
 */
type JiraRequestAccessState =
	| RequestAccessState.default
	| RequestAccessState.loading
	| RequestAccessState.pending;

const SyncedBlockPermissionDeniedJiraWorkItem = ({
	sourceContentId,
	accountId,
}: {
	accountId: string | null;
	sourceContentId: string;
}) => {
	const { formatMessage } = useIntl();
	const [requestAccessState, setRequestAccessState] = useState<JiraRequestAccessState>(
		RequestAccessState.default,
	);

	const onClick = useCallback(async () => {
		setRequestAccessState(RequestAccessState.loading);
		// Fire and forget. Per the Jira backend contract the response is
		// intentionally opaque (empty 204 on success, generic on failure) to
		// prevent issue-existence enumeration. We always end in `pending`.
		try {
			await requestJiraSpaceAccess({
				accountId,
				issueId: Number(sourceContentId) || null,
				projectKey: null,
			});
		} catch (_e) {
			// Swallow — see comment above.
		}
		setRequestAccessState(RequestAccessState.pending);
	}, [accountId, sourceContentId]);

	return (
		<Box xcss={styles.wrapper}>
			<Image
				src={PermissionDenied}
				alt={formatMessage(messages.permissionDeniedAltText)}
				width="48"
				height="48"
			/>
			<Stack space="space.100">
				<Heading size="xsmall">{formatMessage(messages.permissionDeniedHeading)}</Heading>
				<Text color="color.text.subtle">{formatMessage(messages.permissionDeniedDescription)}</Text>
				{requestAccessState === RequestAccessState.pending ? (
					<Flex columnGap="space.050" alignItems="center">
						<StatusSuccessIcon
							size="small"
							color={token('color.icon.subtle')}
							label={formatMessage(messages.accessRequested)}
						/>
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
					</Flex>
				)}
			</Stack>
		</Box>
	);
};

export const SyncedBlockPermissionDenied = ({
	sourceContentId,
	sourceProduct,
	accountId,
}: SyncedBlockPermissionDeniedProps): React.JSX.Element => {
	switch (sourceProduct) {
		case 'confluence-page':
			return <SyncedBlockPermissionDeniedConfluencePage sourceContentId={sourceContentId} />;
		case 'jira-work-item':
			return fg('platform_synced_block_patch_10') ? (
				<SyncedBlockPermissionDeniedJiraWorkItem
					sourceContentId={sourceContentId}
					accountId={accountId}
				/>
			) : (
				<SyncedBlockGenericError />
			);
		default:
			return <SyncedBlockGenericError />;
	}
};
