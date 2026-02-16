import React, { useCallback } from 'react';

import { useIntl } from 'react-intl-next';
import { graphql, useFragment, useMutation } from 'react-relay';

import { DropdownItem } from '@atlaskit/dropdown-menu';
import { useFlags } from '@atlaskit/flag';
import ErrorIcon from '@atlaskit/icon/core/status-error';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import { AgentCommonActions, useRovoAgentActionAnalytics } from '@atlaskit/rovo-agent-analytics/actions';

import type { agentVerificationDropdownItem_AtlaskitRovoAgentComponents_agentRef$key } from './__generated__/agentVerificationDropdownItem_AtlaskitRovoAgentComponents_agentRef.graphql';
import type { agentVerificationDropdownItem_AtlaskitRovoAgentComponents_updateAgentVerificationMutation } from './__generated__/agentVerificationDropdownItem_AtlaskitRovoAgentComponents_updateAgentVerificationMutation.graphql';
import type { agentVerificationDropdownItem_AtlaskitRovoAgentComponents_userPermissionsRef$key } from './__generated__/agentVerificationDropdownItem_AtlaskitRovoAgentComponents_userPermissionsRef.graphql';
import messages from './messages';

export type AgentVerificationDropdownItemProps = {
	agentRef: agentVerificationDropdownItem_AtlaskitRovoAgentComponents_agentRef$key | null;
	userPermissionsRef: agentVerificationDropdownItem_AtlaskitRovoAgentComponents_userPermissionsRef$key | null;
	/**
	 * Optional callback fired when the dropdown item is clicked, before the mutation is executed.
	 */
	onClick?: () => void;
	/**
	 * Optional callback fired when verification mutation succeeds.
	 * Called with the new verified state.
	 */
	onVerificationSuccess?: (verified: boolean) => void;
	/**
	 * Test ID for the dropdown item.
	 */
	testId?: string;
	/**
	 * Render function for custom dropdown component.
	 * If not provided, defaults to DropdownItem.
	 */
	renderItem?: (props: {
		isPending: boolean;
		isVerified: boolean;
		labelText: string;
		onClick: () => void;
	}) => React.ReactNode;
};

/**
 * A dropdown item for verifying or unverifying an agent.
 * Renders "Verify agent" if the agent is not verified, or "Remove verification" if it is.
 * Returns null if the user doesn't have permission to govern agents or the feature flag is off.
 */
export const AgentVerificationDropdownItem = ({
	agentRef,
	userPermissionsRef,
	onClick,
	onVerificationSuccess,
	testId,
	renderItem,
}: AgentVerificationDropdownItemProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const { showFlag } = useFlags();

	const agentData = useFragment(
		graphql`
			fragment agentVerificationDropdownItem_AtlaskitRovoAgentComponents_agentRef on AgentStudioAssistant {
				id
				isVerified
			}
		`,
		agentRef,
	);

	const userPermissions = useFragment(
		graphql`
			fragment agentVerificationDropdownItem_AtlaskitRovoAgentComponents_userPermissionsRef on AtlassianStudioUserProductPermissions {
				isAbleToGovernAgents
			}
		`,
		userPermissionsRef,
	);

	const isAbleToGovernAgents = userPermissions?.isAbleToGovernAgents ?? false;
	const isVerified = agentData?.isVerified ?? false;
	const agentId = agentData?.id;

	const { trackAgentAction, trackAgentActionError } = useRovoAgentActionAnalytics({
		touchPoint: 'agent-verification-dropdown-item',
		agentId,
		isAbleToGovernAgents,
	});

	const [commitUpdateVerification, isPending] =
		useMutation<agentVerificationDropdownItem_AtlaskitRovoAgentComponents_updateAgentVerificationMutation>(
			graphql`
				mutation agentVerificationDropdownItem_AtlaskitRovoAgentComponents_updateAgentVerificationMutation(
					$id: ID!
					$verified: Boolean!
				) {
					agentStudio_updateAgentVerification(id: $id, verified: $verified)
						@optIn(to: "AgentStudio") {
						success
						errors {
							message
						}
						agent {
							... on AgentStudioAssistant {
								id
								isVerified
							}
						}
					}
				}
			`,
		);

	const handleError = useCallback(
		(verified: boolean, errorMessage: string) => {
			showFlag({
				title: formatMessage(verified ? messages.verifyErrorTitle : messages.unverifyErrorTitle),
				description: formatMessage(messages.errorDescription, { errorMessage }),
				appearance: 'error',
				icon: <ErrorIcon spacing="spacious" label="" />,
			});
		},
		[formatMessage, showFlag],
	);

	const handleUpdateVerification = useCallback(
		(verified: boolean) => {
			if (!agentId) {
				return;
			}
			onClick?.();
			commitUpdateVerification({
				variables: {
					id: agentId,
					verified,
				},
				onCompleted: (response) => {
					const payload = response?.agentStudio_updateAgentVerification;
					if (payload?.success) {
						onVerificationSuccess?.(verified);
						trackAgentAction(verified ? AgentCommonActions.VERIFY : AgentCommonActions.UNVERIFY, {});
						showFlag({
							title: formatMessage(
								verified ? messages.verifySuccessTitle : messages.unverifySuccessTitle,
							),
							appearance: 'success',
							isAutoDismiss: true,
							icon: <SuccessIcon spacing="spacious" label="" />,
						});
					} else {
						const errorMessage = payload?.errors?.[0]?.message;
						if (errorMessage) {
							trackAgentActionError(
								verified ? AgentCommonActions.VERIFY : AgentCommonActions.UNVERIFY,
								new Error(errorMessage),
								{ agentId },
							);
							handleError(verified, errorMessage);
						}
					}
				},
				onError: (error) => {
					trackAgentActionError(verified ? AgentCommonActions.VERIFY : AgentCommonActions.UNVERIFY, error, {
						agentId,
					});
					handleError(verified, error.message);
				},
			});
		},
		[
			agentId,
			commitUpdateVerification,
			formatMessage,
			handleError,
			onClick,
			onVerificationSuccess,
			showFlag,
			trackAgentAction,
			trackAgentActionError,
		],
	);

	const labelText = formatMessage(
		isVerified ? messages.unverifyAgentLabel : messages.verifyAgentLabel,
	);

	const handleOnClick = () => handleUpdateVerification(!isVerified);

	if (
		// Don't render if agent ID is not available
		!agentId ||
		// Don't render if user doesn't have permission
		!isAbleToGovernAgents
	) {
		return null;
	}

	// Use custom render or default to DropdownItem
	if (renderItem) {
		return (
			<>
				{renderItem({
					isPending,
					isVerified,
					labelText,
					onClick: handleOnClick,
				})}
			</>
		);
	}

	return (
		<DropdownItem testId={testId} onClick={handleOnClick}>
			{labelText}
		</DropdownItem>
	);
};
