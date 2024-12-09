import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

export default md`

  Experimental code to track Editor Full Page performance on some particular scenarios

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/editor-performance-metrics"
			Component={require('../examples/01-vc-observer-next').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/01-vc-observer-next')}
		/>
	)}

  ${(
		<Props
			heading="EditorPerformanceMetrics Props"
			props={require('!!extract-react-types-loader!../src')}
		/>
	)}
`;
