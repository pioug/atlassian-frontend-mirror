import React, { useCallback, useMemo } from 'react';

import { default as AnalyticsReactContext } from '@atlaskit/analytics-next-stable-react-context';

import type { UIAnalyticsEventHandler } from '../../events/UIAnalyticsEvent';
import { useAnalyticsContext } from '../../hooks/useAnalyticsContext';
import { useTrackedRef } from '../../hooks/useTrackedRef';

import type { AnalyticsListenerFunction } from './types';

const AnalyticsListener: AnalyticsListenerFunction = ({ children, channel, onEvent }) => {
	const { getAtlaskitAnalyticsEventHandlers = () => [], getAtlaskitAnalyticsContext } =
		useAnalyticsContext();

	const onEventRef = useTrackedRef(onEvent);
	const channelRef = useTrackedRef(channel);

	const getAnalyticsEventHandlers = useCallback(() => {
		const thisHandler: UIAnalyticsEventHandler = (event, eventChannel) => {
			if (channelRef.current === '*' || channelRef.current === eventChannel) {
				onEventRef.current(event, eventChannel);
			}
		};

		return [thisHandler, ...getAtlaskitAnalyticsEventHandlers()];
	}, [channelRef, onEventRef, getAtlaskitAnalyticsEventHandlers]);

	const value = useMemo(
		() => ({
			getAtlaskitAnalyticsContext,
			getAtlaskitAnalyticsEventHandlers: getAnalyticsEventHandlers,
		}),
		[getAtlaskitAnalyticsContext, getAnalyticsEventHandlers],
	);

	return <AnalyticsReactContext.Provider value={value}>{children}</AnalyticsReactContext.Provider>;
};

export default AnalyticsListener;
