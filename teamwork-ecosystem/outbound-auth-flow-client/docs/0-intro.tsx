import { md, code } from '@atlaskit/docs';

const _default_1: any = md`
# @atlaskit/outbound-auth-flow-client

Autenticate with \`outbound-auth-flow\` service in a popup.

## Installation

${code`
yarn add @atlaskit/outbound-auth-flow-client
`}

## Usage

${code`
import { auth } from '@atlaskit/outbound-auth-flow-client';

auth(
  'https://outbound-auth-service-url/outboundAuth/start?containerId=' + containerId + '&serviceKey=' + serviceKey
).then(
  () => console.log('successfully authenticated'),
  error => console.log('failed to authenticated', error),
);
`}
`;
export default _default_1;
