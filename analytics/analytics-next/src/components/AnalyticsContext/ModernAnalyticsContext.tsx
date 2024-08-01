import React, { useCallback, useMemo } from 'react';

import { default as AnalyticsReactContext } from '@atlaskit/analytics-next-stable-react-context';

import { useAnalyticsContext } from '../../hooks/useAnalyticsContext';
import { useTrackedRef } from '../../hooks/useTrackedRef';

import type { AnalyticsContextFunction } from './types';

const AnalyticsContext: AnalyticsContextFunction = ({ data, children }) => {
	const dataRef = useTrackedRef(data);
	const {
		getAtlaskitAnalyticsEventHandlers,
		getAtlaskitAnalyticsContext: getOriginalAnalyticsContext,
	} = useAnalyticsContext();

	const getAtlaskitAnalyticsContext = useCallback(() => {
		return [...getOriginalAnalyticsContext(), dataRef.current];
	}, [getOriginalAnalyticsContext, dataRef]);

	const value = useMemo(
		() => ({
			getAtlaskitAnalyticsContext,
			getAtlaskitAnalyticsEventHandlers,
		}),
		[getAtlaskitAnalyticsContext, getAtlaskitAnalyticsEventHandlers],
	);

	return <AnalyticsReactContext.Provider value={value}>{children}</AnalyticsReactContext.Provider>;
};

export default AnalyticsContext;
