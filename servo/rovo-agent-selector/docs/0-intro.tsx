import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

const _default_1: any = md`

  rovo agent selector

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/rovo-agent-selector"
			Component={require('../examples/basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/basic')}
		/>
	)}

  ${(
		<Props
			heading="RovoAgentSelector Props"
			props={require('!!extract-react-types-loader!../src')}
		/>
	)}
`;
export default _default_1;
