import React, { useCallback, useEffect } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { Pulse } from '@atlaskit/linking-common';

import { isLocalStorageKeyDiscovered, markLocalStorageKeyDiscovered } from '../local-storage';

export type PulseDiscoveryMode = 'start' | 'iteration';

export interface PulseProps {
	/**
	 * The component around which the Pulse should be displayed
	 */
	children: JSX.Element;
	/**
	 * Indicates when the feature is considered discovered. If "start" is passed, local storage key will be invalidated
	 * as soon as the animation starts. If "iteration" is passed (the default one), it will be invalidated after the first iteration
	 */
	discoveryMode?: PulseDiscoveryMode;

	/*
	 * Determine if rendering inline
	 */
	isInline?: boolean;

	/**
	 * The key that is used in local storage to identify the descoverability of a feature where the Pulse is used
	 */
	localStorageKey: string;

	/**
	 * The time in ms after which the key in local storage will be considered expired and the Pulse will be shown again
	 */
	localStorageKeyExpirationInMs?: number;

	/*
	 * When defined this property overrides default pulse behaviour, true shows the pulse and false hides the pulse
	 */
	shouldShowPulse?: boolean;

	/*
	 * A custom test id
	 */
	testId?: string;
}

export const DiscoveryPulse = ({
	children,
	localStorageKey,
	localStorageKeyExpirationInMs,
	discoveryMode = 'iteration',
	shouldShowPulse,
	testId,
	isInline,
}: PulseProps) => {
	const discovered = isLocalStorageKeyDiscovered(localStorageKey);
	const showPulse = shouldShowPulse ?? !discovered;

	const { createAnalyticsEvent } = useAnalyticsEvents();

	useEffect(() => {
		if (showPulse) {
			createAnalyticsEvent({
				action: 'viewed',
				actionSubject: 'pulse',
				eventType: 'ui',
				attributes: {
					pulseIdentifier: localStorageKey,
				},
			}).fire('media');
		}
	}, [createAnalyticsEvent, discovered, localStorageKey, showPulse]);

	const onDiscovery = useCallback(() => {
		if (!discovered) {
			markLocalStorageKeyDiscovered(localStorageKey, localStorageKeyExpirationInMs);
		}
	}, [discovered, localStorageKey, localStorageKeyExpirationInMs]);

	return (
		<Pulse
			onAnimationIteration={discoveryMode === 'iteration' ? onDiscovery : undefined}
			onAnimationStart={discoveryMode === 'start' ? onDiscovery : undefined}
			showPulse={showPulse}
			testId={testId}
			isInline={isInline}
		>
			{children}
		</Pulse>
	);
};
