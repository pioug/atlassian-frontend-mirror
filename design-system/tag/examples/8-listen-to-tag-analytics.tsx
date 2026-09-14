import React from 'react';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import Tag from '@atlaskit/tag/removable-tag';

const sendAnalytics = (analytic: UIAnalyticsEvent) => console.log('analytic: ', analytic);

export default (): React.JSX.Element => (
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
