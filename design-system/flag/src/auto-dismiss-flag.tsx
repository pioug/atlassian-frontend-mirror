import React, { useCallback, useEffect, useRef } from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import noop from '@atlaskit/ds-lib/noop';

import Flag from './flag';
import { useFlagGroup } from './flag-group';
import { type AutoDismissFlagProps } from './types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export const AUTO_DISMISS_SECONDS = 8;

/**
 * __Auto dismiss flag__
 *
 * An auto dismiss flag is dismissed automatically after eight seconds.
 *
 * - [Examples](https://atlassian.design/components/flag/auto-dismiss-flag/examples)
 * - [Code](https://atlassian.design/components/flag/auto-dismiss-flag/code)
 */
const AutoDismissFlag = (props: AutoDismissFlagProps): React.JSX.Element => {
	const {
		id,
		analyticsContext,
		onDismissed: onDismissedProp = noop,
		autoDismissSeconds = AUTO_DISMISS_SECONDS,
	} = props;
	const autoDismissTimer = useRef<number | null>(null);

	const { onDismissed: onDismissedFromFlagGroup, isDismissAllowed } = useFlagGroup();

	const onDismissed = useCallback(
		(id: string | number, analyticsEvent: UIAnalyticsEvent) => {
			onDismissedProp(id, analyticsEvent);
			onDismissedFromFlagGroup(id, analyticsEvent);
		},
		[onDismissedProp, onDismissedFromFlagGroup],
	);

	const onDismissedAnalytics = usePlatformLeafEventHandler({
		fn: onDismissed,
		action: 'dismissed',
		analyticsData: analyticsContext,
		componentName: 'flag',
		packageName,
		packageVersion,
	});

	const isAutoDismissAllowed = isDismissAllowed && onDismissed;

	const dismissFlag = useCallback(() => {
		if (isAutoDismissAllowed) {
			onDismissedAnalytics(id);
		}
	}, [id, onDismissedAnalytics, isAutoDismissAllowed]);

	const stopAutoDismissTimer = useCallback(() => {
		if (autoDismissTimer.current) {
			clearTimeout(autoDismissTimer.current);
			autoDismissTimer.current = null;
		}
	}, []);

	const startAutoDismissTimer = useCallback(() => {
		if (!isAutoDismissAllowed) {
			return;
		}

		stopAutoDismissTimer();

		autoDismissTimer.current = window.setTimeout(dismissFlag, autoDismissSeconds * 1000);
	}, [dismissFlag, stopAutoDismissTimer, isAutoDismissAllowed, autoDismissSeconds]);

	useEffect(() => {
		startAutoDismissTimer();
		return stopAutoDismissTimer;
	}, [startAutoDismissTimer, stopAutoDismissTimer]);

	return (
		<Flag
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...props}
			onMouseOver={stopAutoDismissTimer}
			onFocus={stopAutoDismissTimer}
			onMouseOut={startAutoDismissTimer}
			onBlur={startAutoDismissTimer}
		/>
	);
};

export default AutoDismissFlag;
