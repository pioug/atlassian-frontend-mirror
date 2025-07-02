import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

export default md`
	CharlieHierarchy is a component for building SVG-rendered trees. It is a wrapper around the
	\`visx/hierarchy\` Tree component that provides a more declarative API and handles common use
	cases, allowing for a quicker entry point to creating trees.
	
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
