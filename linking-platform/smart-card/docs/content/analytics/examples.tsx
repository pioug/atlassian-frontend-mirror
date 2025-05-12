import React from 'react';

import { Example } from '@atlaskit/docs';

import customMd from '../../utils/custom-md';

export default customMd`

# Listening to Analytics Events

This section will describe how to listen to analytics events. This may be useful in debugging and creating unit tests.

## Using AnalyticsListener from @atlaskit/analytics-next

You can use \`AnalyticsListener\` from [@atlaskit/analytics-next](https://atlaskit.atlassian.com/packages/analytics/analytics-next) to listen to analytics events being fired from the Smart Card component.

The example below showcases events being fired when interacting with the Smart Card component and when it resolves.

${(
	<Example
		Component={require('../../../examples/content/analytics').default}
		source={require('!!raw-loader!../../../examples/content/analytics')}
	/>
)}

The usage of this method does not provide all of the attributes and context values that are available when an event is fired. To see all attributes and values, use the \`FabricAnalyticsListeners\`.

## Using FabricAnalyticsListeners from @atlaskit/analytics-listeners

The \`FabricAnalyticsListeners\` is a JSX component from \`@atlaskit/analytics-listeners\` that can be used to listen to all events being fired from the Smart Card component.

${(
	<Example
		Component={require('../../../examples/content/analytics-fabric-listener').default}
		source={require('!!raw-loader!../../../examples/content/analytics-fabric-listener')}
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
