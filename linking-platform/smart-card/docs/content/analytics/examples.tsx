import React from 'react';

import { Example } from '@atlaskit/docs';

import customMd from '../../utils/custom-md';

export default customMd`

# Listening to Analytics Events

You can use \`AnalyticsListener\` from [@atlaskit/analytics-next](https://atlaskit.atlassian.com/packages/analytics/analytics-next) to listen to analytics events being fired from the Smart Card component.

The example below showcases events being fired when interacting with the Smart Card component and when it resolves.

${(
	<Example
		Component={require('../../../examples/content/analytics').default}
		source={require('!!raw-loader!../../../examples/content/analytics')}
	/>
)}

# Analytics Payload Examples

Below are are samples of what the analytics payload looks like when the Smart Card component resolves and when it fails to
resolve due to an unauthorised state.

${(
	<Example
		Component={require('../../../examples/content/analytics-payload').default}
		source={require('!!raw-loader!../../../examples/content/analytics-payload')}
	/>
)}
`;
