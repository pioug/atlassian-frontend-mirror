import React, { forwardRef } from 'react';

import { UIAnalyticsEvent, useAnalyticsEvents } from '@atlaskit/analytics-next';
import AkButton from '@atlaskit/button';

import { ANALYTICS_CHANNEL } from '../../../common/constants';
import createEventPayload, {
	type AnalyticsEventAttributes,
} from '../../../common/utils/analytics/analytics.codegen';

type ButtonProps = React.ComponentProps<typeof AkButton> & {
	actionSubjectId: keyof {
		[Key in keyof AnalyticsEventAttributes as Key extends `ui.button.clicked.${infer ActionSubjectId}`
			? ActionSubjectId
			: never]: any;
	};
};

export const Button = forwardRef(
	({ actionSubjectId, ...props }: ButtonProps, ref: React.Ref<HTMLElement>) => {
		const { createAnalyticsEvent } = useAnalyticsEvents();

		return (
			<AkButton
				{...props}
				ref={ref}
				onClick={(event) => {
					const payload = createEventPayload(`ui.button.clicked.${actionSubjectId}`, {});
					const analyticEvent = createAnalyticsEvent(payload);
					const cloned = analyticEvent.clone();
					analyticEvent.fire(ANALYTICS_CHANNEL);
					props.onClick?.(event, cloned ?? new UIAnalyticsEvent({ payload }));
				}}
			/>
		);
	},
);
