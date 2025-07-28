import { useCallback, useEffect, useState } from 'react';

import { defineMessages, useIntl } from 'react-intl-next';

import { type FlagProps } from '@atlaskit/flag';

import { type ContainerTypes } from '../../../common/types';
import { useTeamContainers } from '../use-team-containers';

import {
	containerDisplayName,
	containersEqual,
	getRequestedContainersFromUrl,
	useAsyncPolling,
	userCanAccessFeature,
} from './utils';

type OnRequestedContainerTimeout = (
	createFlag: ({ onAction }: { onAction: (flagId: string) => void }) => FlagProps,
) => void;

/**
 * Hook to track and poll for requested product containers (such as a Jira Project).
 * The initial list of requested containers is derived from the URL parameters, however it can be updated based on user interactions.
 *
 * Manages a list of requested containers, polls for updates, and removes found containers from the list.
 *
 * Supported container types: CONFLUENCE_SPACE, JIRA_PROJECT, LOOM_SPACE.
 *
 * @param teamId - The ID of the team whose containers are being tracked.
 * @param onRequestedContainerTimeout - Optional callback to handle timeout events for requested containers.
 * @returns The current list of requested containers and a function to add a container.
 */
function useRequestedContainers({
	teamId,
	onRequestedContainerTimeout,
}: {
	teamId: string;
	onRequestedContainerTimeout?: OnRequestedContainerTimeout;
}) {
	const { formatMessage } = useIntl();
	const { refetchTeamContainers, teamContainers } = useTeamContainers(teamId);
	const [requestedContainers, setRequestedContainers] = useState(() =>
		userCanAccessFeature() ? getRequestedContainersFromUrl() : [],
	);

	const checkContainers = useCallback(async () => {
		await refetchTeamContainers();
	}, [refetchTeamContainers]);

	const { startPolling, stopPolling, isPolling, hasTimedOut } = useAsyncPolling(checkContainers);

	const checkForContainer = (container: ContainerTypes) => {
		if (!requestedContainers.includes(container)) {
			setRequestedContainers((prev) => [...prev, container]);
		}
		startPolling();
	};

	useEffect(() => {
		if (!userCanAccessFeature()) {
			return;
		}

		if (hasTimedOut) {
			return;
		}

		const containerCount = requestedContainers.length;

		if (isPolling && containerCount === 0) {
			stopPolling();
			return;
		}

		if (!isPolling && containerCount > 0) {
			startPolling();
		}
	}, [isPolling, requestedContainers.length, hasTimedOut, startPolling, stopPolling]);

	useEffect(() => {
		const containersNotFound = requestedContainers.filter(
			(containerType) =>
				!teamContainers.some((teamContainer) => teamContainer.type === containerType),
		);

		if (!containersEqual(containersNotFound, requestedContainers)) {
			setRequestedContainers(containersNotFound);
		}
	}, [requestedContainers, checkContainers, teamContainers]);

	useEffect(() => {
		if (hasTimedOut && onRequestedContainerTimeout) {
			const action = () => {
				// @todo: send request to retry creating containers
				// This will be implemented in the next pull request
			};
			const flagId = `requested-container-timeout-${requestedContainers.join('-')}`;
			const createFlag = ({ onAction }: { onAction: (flagId: string) => void }) => ({
				id: flagId,
				title:
					requestedContainers.length === 1
						? formatMessage(messages.timeoutTitle, {
								container: containerDisplayName(requestedContainers[0]),
							})
						: formatMessage(messages.timeoutTitleMultiple),
				description: formatMessage(messages.timeoutDescription),
				actions: [
					{
						content: formatMessage(messages.timeoutAction),
						onClick: () => {
							action();
							onAction(flagId);
						},
					},
				],
			});
			onRequestedContainerTimeout(createFlag);
		}
	}, [hasTimedOut, onRequestedContainerTimeout, requestedContainers, formatMessage]);

	return { requestedContainers, checkForContainer };
}

const messages = defineMessages({
	timeoutTitle: {
		id: 'teams-public.team-containers.timeout-title',
		defaultMessage: 'We’re couldn’t connect your {container}',
		description: 'Title for the timeout flag',
	},
	timeoutTitleMultiple: {
		id: 'teams-public.team-containers.timeout-title',
		defaultMessage: 'We’re couldn’t connect your spaces',
		description: 'Title for the timeout flag',
	},
	timeoutDescription: {
		id: 'teams-public..team-containers.timeout-description',
		defaultMessage: 'Something went wrong. Verify your connection and retry.',
		description: 'Description for the timeout flag',
	},
	timeoutAction: {
		id: 'teams-public.team-containers.timeout-action',
		defaultMessage: 'Try again',
		description: 'Action text for the timeout flag',
	},
});

export { useRequestedContainers, type OnRequestedContainerTimeout };
