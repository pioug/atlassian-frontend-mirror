import React from 'react';

import { Example, md } from '@atlaskit/docs';

export default md`

  This package host public components related to rovo agents, the components here are needed for other public atlaskit packages

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/rovo-agent-components"
			Component={require('../examples/basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/basic')}
		/>
	)}
`;
