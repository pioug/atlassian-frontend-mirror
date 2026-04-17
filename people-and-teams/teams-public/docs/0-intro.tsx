import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

const _default_1: any = md`

  A component to show linked containers to the team

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/team-containers"
			Component={require('../examples/TeamContainers.example').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/TeamContainers.example')}
		/>
	)}

  ${(
		<Props heading="TeamContainers Props" props={require('!!extract-react-types-loader!../src')} />
	)}
`;
export default _default_1;
