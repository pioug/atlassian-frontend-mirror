import React, { type PropsWithChildren } from 'react';

import { AnalyticsContext } from '@atlaskit/analytics-next';

import { ScreenViewedEvent } from '../../..//common/utils/analytics/components';
import type { AnalyticsEventAttributes } from '../../../common/utils/analytics/analytics.codegen';

type InlineAnalyticsProps = {
	screen: keyof {
		[Key in keyof AnalyticsEventAttributes as Key extends `screen.${infer ScreenName}.viewed`
			? ScreenName
			: never]: any;
	};
};

export const InlineAnalytics = ({ screen, children }: PropsWithChildren<InlineAnalyticsProps>) => (
	<AnalyticsContext data={{ source: screen, component: 'inline-create' }}>
		<ScreenViewedEvent screen={screen} />

		{children}
	</AnalyticsContext>
);
