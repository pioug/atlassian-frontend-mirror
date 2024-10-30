import { code } from '@atlaskit/docs';

import customMd from '../../utils/custom-md';

export default customMd`
To avoid an entire application page crashing, the **SmartCard** component doesn't throw an error in case of failure rendering.
An optional hook \`onError\` callback function can be provided to handle errors.

### How to handle an error on the client side with SmartCard

When an error occurs while rendering the **SmartCard** component, it calls the optional \`onError\` prop as a  callback function.
The \`onError\` callback function is typed as follows:

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

For these statuses, **SmartCard** will handle the errors internally. However, the client will still be able
to perform additional actions by providing an \`onError\` callback function. The \`err\` property will always be \`undefined\`.
The invocation of the \`onError\` callback function in this case does not mean that the **SmartCard** failed to render.

2. When an unexpected and unhandled error occurs, \`onError\` is invoked with a defined \`err\` property which is the instance of the unhandled error.
   The presence of a defined \`err\` in the data indicates that the client should either render their own fallback
   or pass a \`React.ComponentType\` as a \`fallbackComponent\` prop which will be rendered instead of a failed **SmartCard**.
   \`fallbackComponent\` is optional and if not provided, the **SmartCard** renders \`null\` in case of an unhandled error.

Refer to [Card](./card) documentation for general props.
`;
