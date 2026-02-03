import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { defineMessages, useIntl } from 'react-intl-next';

import { useAnalyticsEvents as useAnalyticsEventsDEPRECATED } from '@atlaskit/analytics-next';
import { type FlagProps } from '@atlaskit/flag';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import { fg } from '@atlaskit/platform-feature-flags';
import { Flex } from '@atlaskit/primitives/compiled';
import { useAnalyticsEvents } from '@atlaskit/teams-app-internal-analytics';
import { HttpError, teamsClient } from '@atlaskit/teams-client';
import { type ApiTeamContainerCreationPayload } from '@atlaskit/teams-client/types';

import { type ContainerTypes } from '../../../common/types';
import { usePeopleAndTeamAnalytics } from '../../../common/utils/analytics';
import { useTeamContainers } from '../use-team-containers';

import {
	containerDisplayName,
	containersEqual,
	convertContainerToType,
	getRequestedContainersFromUrl,
	POLLING_INTERVAL,
	removeRequestedContainersFromUrl,
	useAsyncPolling,
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
	cloudId,
	onRequestedContainerTimeout,
}: {
	teamId: string;
	cloudId: string;
	onRequestedContainerTimeout?: OnRequestedContainerTimeout;
}) {
	const { formatMessage } = useIntl();
	const { refetchTeamContainers, teamContainers } = useTeamContainers(teamId);
	const [isTryingAgain, setIsTryingAgain] = useState(false);
	const tryAgainCountRef = useRef(0);
	const [refetchErrorCount, setRefetchErrorCount] = useState(0);
	const { fireTrackEvent } = usePeopleAndTeamAnalytics();
	const { createAnalyticsEvent } = useAnalyticsEventsDEPRECATED();
	const { fireEvent } = useAnalyticsEvents();

	const [requestedContainers, setRequestedContainers] = useState<ContainerTypes[]>([]);
	const requestedContainersRef = useRef<ContainerTypes[]>([]);

	const checkContainers = useCallback(async () => {
		try {
			await refetchTeamContainers();
		} catch (error) {
			setRefetchErrorCount((prev) => prev + 1);
		}
	}, [refetchTeamContainers]);

	const onTimeout = useCallback(
		({ startPolling, reset }: { startPolling: () => void; reset: () => void }) => {
			if (!onRequestedContainerTimeout) {
				return;
			}

			const reqContainers = requestedContainersRef.current;

			const flagId = `requested-container-timeout-${reqContainers.join('-')}-${tryAgainCountRef.current}`;

			const createTryAgainFlag = ({ onAction }: { onAction: (flagId: string) => void }) => ({
				id: flagId,
				title:
					reqContainers.length === 1
						? formatMessage(messages.timeoutTitle, {
								container: containerDisplayName(reqContainers[0]),
							})
						: formatMessage(messages.timeoutTitleMultiple),
				description: formatMessage(messages.timeoutDescription),
				appearance: 'error' as const,
				type: 'error',
				actions: [
					{
						content: formatMessage(messages.timeoutAction),
						onClick: () => {
							onAction(flagId);
							tryAgainAction();
						},
					},
				],
			});
			const createContactSupportFlag = ({ onAction }: { onAction: (flagId: string) => void }) => ({
				id: flagId,
				title: formatMessage(messages.noConnectionTitle),
				description: formatMessage(messages.noConnectionDescription),
				appearance: 'error' as const,
				type: 'error',
				actions: [
					{
						content: (
							<Flex alignItems="center" columnGap="space.100">
								{formatMessage(messages.noConnectionAction)}
								<LinkExternalIcon label="" />
							</Flex>
						),
						onClick: () => {
							onAction(flagId);
						},
						href: 'https://support.atlassian.com/contact/#/&support_type=customer',
					},
				],
			});

			const tryAgainAction = async () => {
				setIsTryingAgain(true);
				tryAgainCountRef.current = tryAgainCountRef.current + 1;

				const containers = reqContainers
					.map((container) => {
						return { type: convertContainerToType(container), containerSiteId: cloudId };
					})
					.filter(({ type }) => Boolean(type)) as ApiTeamContainerCreationPayload['containers'];

				if (fg('ptc-missed-analytics-migration-events')) {
					fireEvent('track.requestedContainers.tryAgain', {
						containers: reqContainers,
						teamId,
					});
				} else {
					fireTrackEvent(createAnalyticsEvent, {
						action: 'tryAgain',
						actionSubject: 'requestedContainers',
						// @ts-ignore
						attributes: { containers: reqContainers, teamId },
					});
				}

				try {
					const response = await teamsClient.createTeamContainers({ teamId, containers });
					const containersNotCreated = reqContainers.filter(
						(containerType) =>
							!response.containersCreated?.some(
								(container) => container.containerType === convertContainerToType(containerType),
							),
					);

					//containers are still being created
					if (containersNotCreated.length > 0) {
						startPolling();
					} else {
						//all containers created so reset and update state
						reset();
						await refetchTeamContainers();
					}
				} catch (error) {
					if (error instanceof HttpError) {
						if (error.status === 500) {
							//only allow for 2 retries
							if (tryAgainCountRef.current <= 2) {
								return setTimeout(() => {
									//bug: this can cause two flags to be shown
									tryAgainAction();
								}, POLLING_INTERVAL);
							}
						}
					}

					onRequestedContainerTimeout(createContactSupportFlag);
				} finally {
					setIsTryingAgain(false);
				}
			};

			if (fg('ptc-missed-analytics-migration-events')) {
				fireEvent('track.requestedContainers.failed', {
					containers: reqContainers,
					teamId,
					tryAgainCount: tryAgainCountRef.current,
				});
			} else {
				fireTrackEvent(createAnalyticsEvent, {
					action: 'failed',
					actionSubject: 'requestedContainers',
					attributes: {
						// @ts-ignore
						containers: reqContainers,
						teamId,
						tryAgainCount: tryAgainCountRef.current,
					},
				});
			}

			removeRequestedContainersFromUrl();
			onRequestedContainerTimeout(
				tryAgainCountRef.current === 0 ? createTryAgainFlag : createContactSupportFlag,
			);
		},
		[
			cloudId,
			formatMessage,
			onRequestedContainerTimeout,
			refetchTeamContainers,
			teamId,
			createAnalyticsEvent,
			fireTrackEvent,
			fireEvent,
		],
	);

	const { startPolling, stopPolling, isPolling, hasTimedOut } = useAsyncPolling(checkContainers, {
		onTimeout,
	});

	useEffect(() => {
		const containers = getRequestedContainersFromUrl();
		if (containers.length > 0 && isPolling === false) {
			setRequestedContainers(containers);
			startPolling();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		requestedContainersRef.current = requestedContainers;
	}, [requestedContainers]);

	useEffect(() => {
		//stop gap to prevent sending too many failed errors
		if (refetchErrorCount > 3) {
			stopPolling();
			if (fg('ptc-missed-analytics-migration-events')) {
				fireEvent('track.requestedContainers.failed', {
					containers: requestedContainers,
					teamId,
					tryAgainCount: null,
				});
			} else {
				fireTrackEvent(createAnalyticsEvent, {
					action: 'failed',
					actionSubject: 'requestedContainers',
					attributes: {
						// @ts-ignore
						containers: requestedContainers,
						teamId,
					},
				});
			}

			return;
		}

		if (hasTimedOut || isTryingAgain) {
			return;
		}

		const containerCount = requestedContainers.length;

		if (isPolling && containerCount === 0) {
			removeRequestedContainersFromUrl();
			stopPolling();
			return;
		}
	}, [
		isPolling,
		refetchErrorCount,
		requestedContainers,
		hasTimedOut,
		startPolling,
		stopPolling,
		isTryingAgain,
		teamId,
		createAnalyticsEvent,
		fireTrackEvent,
		fireEvent,
	]);

	useEffect(() => {
		const containersNotFound = requestedContainers.filter(
			(containerType) =>
				!teamContainers.some((teamContainer) => teamContainer.type === containerType),
		);

		if (!containersEqual(containersNotFound, requestedContainers)) {
			setRequestedContainers(containersNotFound);
		}
	}, [requestedContainers, checkContainers, teamContainers, isPolling]);

	const containersLoading = useMemo(
		() => ((hasTimedOut && !isTryingAgain) || refetchErrorCount > 3 ? [] : requestedContainers),
		[hasTimedOut, requestedContainers, isTryingAgain, refetchErrorCount],
	);

	return { requestedContainers: containersLoading };
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
		id: 'teams-public.team-containers.timeout-description',
		defaultMessage: 'Something went wrong. Verify your connection and retry.',
		description: 'Description for the timeout flag',
	},
	timeoutAction: {
		id: 'teams-public.team-containers.timeout-action',
		defaultMessage: 'Try again',
		description: 'Action text for the timeout flag',
	},
	noConnectionTitle: {
		id: 'teams-public.team-containers.timeout-no-connection-title',
		defaultMessage: 'Connection failed',
		description: 'Title for the no connection flag',
	},
	noConnectionDescription: {
		id: 'teams-public.team-containers.timeout-no-connection-description',
		defaultMessage: 'Try manually creating the space yourself.',
		description: 'Description for the no connection flag',
	},
	noConnectionAction: {
		id: 'teams-public.team-containers.timeout-no-connection-action',
		defaultMessage: 'Contact support',
		description: 'Action text for the no connection flag',
	},
});

export { useRequestedContainers, type OnRequestedContainerTimeout };
