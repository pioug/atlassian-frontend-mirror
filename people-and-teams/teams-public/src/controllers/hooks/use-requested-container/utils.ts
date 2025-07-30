import { useCallback, useRef, useState } from 'react';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import { useInterval } from '@atlaskit/frontend-utilities';
import { ContainerType } from '@atlaskit/teams-client/types';

import { type ContainerTypes } from '../../../common/types';

const CONTAINER_MAP: Record<ContainerType, ContainerTypes> = {
	[ContainerType.CONFLUENCE_SPACE]: 'ConfluenceSpace',
	[ContainerType.JIRA_PROJECT]: 'JiraProject',
	[ContainerType.LOOM_SPACE]: 'LoomSpace',
};

const CONTAINER_HUMAN_NAMES: Record<string, string> = {
	ConfluenceSpace: 'Confluence space',
	JiraProject: 'Jira project',
	LoomSpace: 'Loom space',
};

function containersEqual<T>(arr1: T[], arr2: T[]) {
	return JSON.stringify([...arr1].sort()) === JSON.stringify([...arr2].sort());
}

function getRequestedContainersFromUrl() {
	const searchParams = new URLSearchParams(window.location.search);
	const values = searchParams.get('requestedContainers')?.split(',').filter(Boolean) || [];
	const containers = values
		.filter((value): value is ContainerType =>
			Object.values(ContainerType).includes(value as ContainerType),
		)
		.map((value) => CONTAINER_MAP[value as ContainerType]);

	if (containers.length === 0) {
		return [];
	}
	return userCanAccessFeature() ? containers : [];
}

function containerDisplayName(container: ContainerTypes) {
	return CONTAINER_HUMAN_NAMES[container];
}

function convertContainerToType(container: ContainerTypes) {
	switch (container) {
		case 'ConfluenceSpace':
			return ContainerType.CONFLUENCE_SPACE;
		case 'JiraProject':
			return ContainerType.JIRA_PROJECT;
		case 'LoomSpace':
			return ContainerType.LOOM_SPACE;
		default:
			return null;
	}
}

function userCanAccessFeature() {
	if (FeatureGates.initializeCalled()) {
		const value: string = FeatureGates.getExperimentValue(
			'teams_app_auto_container_creation',
			'cohort',
			'control',
		);
		return value === 'universal_create' || value === 'profile_page';
	}
	return false;
}

//@todo: PTC-12250 update these to P90 value
let POLLING_INTERVAL = 1000;
let POLLING_DURATION = 10000;

/**
 * Hook for polling an async callback at a fixed interval, with timeout and pending state management.
 *
 * Starts polling the provided callback and stops after a set duration or when stopped manually.
 * Ensures only one callback is pending at a time.
 *
 * @param callback - The async function to poll.
 * @param onTimeout - Optional callback to execute when polling times out.
 * @returns An object with polling controls and state: startPolling, stopPolling, isPolling, hasTimedOut.
 */
function useAsyncPolling(
	callback: () => Promise<void> | void,
	{
		onTimeout,
	}: {
		onTimeout?: ({
			startPolling,
			stopPolling,
			reset,
		}: {
			startPolling: () => void;
			stopPolling: () => void;
			reset: () => void;
		}) => void;
	} = {},
) {
	const [hasTimedOut, setHasTimedOut] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [isPolling, setIsPolling] = useState(false);
	const [isPending, setIsPending] = useState(false);

	const stopPolling = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setIsPolling(false);
		setHasTimedOut(false);
		setIsPending(false);
	}, []);

	const reset = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setHasTimedOut(false);
		setIsPolling(false);
		setIsPending(false);
	}, []);

	const startPolling = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		setHasTimedOut(false);
		setIsPolling(true);
		setIsPending(false);

		timeoutRef.current = setTimeout(() => {
			stopPolling();
			setHasTimedOut(true);
			if (onTimeout) {
				onTimeout({ startPolling, stopPolling, reset });
			}
		}, POLLING_DURATION);
	}, [stopPolling, onTimeout, reset]);

	const wrappedCallback = useCallback(async () => {
		if (isPending) {
			return;
		}
		setIsPending(true);
		try {
			await callback();
		} finally {
			setIsPending(false);
		}
	}, [callback, isPending]);

	useInterval(isPolling ? wrappedCallback : () => {}, isPolling ? POLLING_INTERVAL : null);

	return {
		reset,
		startPolling,
		stopPolling,
		isPolling,
		hasTimedOut,
	};
}

export {
	useAsyncPolling,
	POLLING_INTERVAL,
	POLLING_DURATION,
	containersEqual,
	getRequestedContainersFromUrl,
	containerDisplayName,
	CONTAINER_MAP,
	userCanAccessFeature,
	convertContainerToType,
};
