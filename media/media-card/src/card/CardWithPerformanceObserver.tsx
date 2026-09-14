import React, { useEffect } from 'react';

import { type WrappedComponentProps } from 'react-intl';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';

import { setAnalyticsContext } from '../utils/mediaPerformanceObserver/setAnalyticsContext';
import { startResourceObserver } from '../utils/mediaPerformanceObserver/startResourceObserver';
import type { CardBaseProps } from './CardBase';
import { CardBase } from './CardBase';

export const CardWithPerformanceObserver = (
	props: CardBaseProps & WrappedComponentProps,
): React.JSX.Element => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	useEffect(() => {
		startResourceObserver();
	}, []);

	useEffect(() => {
		setAnalyticsContext(createAnalyticsEvent);
	}, [createAnalyticsEvent]);

	return <CardBase {...props} />;
};
