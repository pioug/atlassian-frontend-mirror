import React, { forwardRef } from 'react';

import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import AkButton from '@atlaskit/button/default/button';

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

export const Button: React.ForwardRefExoticComponent<
	Omit<ButtonProps, 'ref'> & React.RefAttributes<HTMLButtonElement>
> = forwardRef(({ actionSubjectId, ...props }: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
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
});
