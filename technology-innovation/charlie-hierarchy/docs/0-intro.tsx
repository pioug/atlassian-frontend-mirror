import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

export default md`

  Add a description here.

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/charlie-hierarchy"
			Component={require('../examples/01-basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/01-basic')}
		/>
	)}

  ${(
		<Props
			heading="CharlieHierarchy Props"
			props={require('!!extract-react-types-loader!../src')}
		/>
	)}
`;
