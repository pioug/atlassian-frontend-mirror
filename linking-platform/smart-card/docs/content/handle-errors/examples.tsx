import React from 'react';

import { Example } from '@atlaskit/docs';

import customMd from '../../utils/custom-md';

export default customMd`
### Unexpected and Unhandled Errors

Unexpected and unhandled error when attempting to render a **SmartCard** component.
\`onError\` callback function is invoked with an \`err\` property which is the instance of the unhandled error.

${(
	<Example
		Component={require('../../../examples/content/handle-errors-fallback-component').default}
		title="Unexpected error handling with Fallback Component"
		source={require('!!raw-loader!../../../examples/content/handle-errors-fallback-component')}
	/>
)}

### Card status is one of the \`ErrorCardType\`

When a card status is one of the \`ErrorCardType\`, **SmartCard** will handle the errors itself but the client will still be able to
perform additional actions by providing an \`onError\` callback function if needed. The \`err\` property will be \`undefined\`.

${(
	<Example
		Component={require('../../../examples/content/handle-errors-errors-card-type').default}
		title="Unexpected error handling with Fallback Component"
		source={require('!!raw-loader!../../../examples/content/handle-errors-errors-card-type')}
	/>
)}
`;
