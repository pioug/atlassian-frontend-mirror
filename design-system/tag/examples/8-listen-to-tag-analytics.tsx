import React from 'react';

import { AnalyticsListener, type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { RemovableTag as Tag } from '@atlaskit/tag';

const sendAnalytics = (analytic: UIAnalyticsEvent) => console.log('analytic: ', analytic);

export default () => (
	<div>
		<AnalyticsListener onEvent={sendAnalytics}>
			<Tag
				text="Log tag remove analytics"
				removeButtonLabel="Remove"
				onBeforeRemoveAction={() => {
					console.log('Before removal');
					return true;
				}}
				onAfterRemoveAction={(e) => console.log('After removal', e)}
			/>
		</AnalyticsListener>
	</div>
);
