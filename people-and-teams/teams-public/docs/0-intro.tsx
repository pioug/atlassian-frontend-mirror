import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

export default md`

  A component to show linked containers to the team

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/team-containers"
			Component={require('../examples/basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/basic')}
		/>
	)}

  ${(
		<Props heading="TeamContainers Props" props={require('!!extract-react-types-loader!../src')} />
	)}
`;
