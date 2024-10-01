import React from 'react';
import customMd from './utils/custom-md';
import { code, Example } from '@atlaskit/docs';

export default customMd`

In order to avoid an entire application page crashing, the **SmartCard** component
doesn't throw an error in case of failure rendering.

### How to handle an unexpected error on a client side

When a failed rendering happens the **SmartCard** component calls an optional \`onError\` prop as a callback function.

${code`
type OnErrorCallback = (data: {
  status: Extract<CardType, ErrorCardType>;
  url: string;
  err?: Error;
}) => void;
`}

 The \`onError\` callback function is currently invoked in two cases:

 1. When a card status is one of the \`ErrorCardType\`.

 ${code`
 type ErrorCardType =
 | 'errored'
 | 'fallback'
 | 'forbidden'
 | 'not_found'
 | 'unauthorized';
 `}

 In these cases **SmartCard** handle errors itself but a client is still able to perform any additional actions
 by using \`onError\` callback function if needed. Please note that the  \`err\` property will be  \`undefined\`.


 2. When an unhandled error happens  \`onError\` evokes with an \`err\` property which is the instance of the unhandled error \`type Error\`.
    The presence of an \`err\` in the data indicates that the client should either render their own fallback
    or pass a \`React.ComponentType\`  as a  \`fallbackComponent\` prop which will be rendered instead of a failed **Smart Card**.
    \`fallbackComponent\` is optional and if not provided, the **Smart Card** renders \`null\` in case of an unhandled error.

${(
	<Example
		Component={require('../examples/content/handle-errors').default}
		title="An example"
		source={require('!!raw-loader!../examples/content/handle-errors')}
	/>
)}
`;
