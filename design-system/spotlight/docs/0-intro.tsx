import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

export default md`

  A spotlight introduces users to various points of interest across Atlassian through focused messages or multi-step tours.

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/spotlight"
			Component={require('../examples/basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/basic')}
		/>
	)}

  ${(<Props heading="Spotlight Props" props={require('!!extract-react-types-loader!../src')} />)}
`;
