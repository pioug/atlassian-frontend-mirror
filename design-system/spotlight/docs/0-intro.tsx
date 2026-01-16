import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

const _default_1: any = md`

  A spotlight introduces users to various points of interest across Atlassian through focused messages or multi-step tours.

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/spotlight"
			Component={require('../examples/card').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/card')}
		/>
	)}

  ${(<Props heading="Spotlight Props" props={require('!!extract-react-types-loader!../src')} />)}
`;
export default _default_1;
