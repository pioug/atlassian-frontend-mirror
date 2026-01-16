import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`

  Experimental code to track Editor Full Page performance on some particular scenarios

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/editor-performance-metrics"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			Component={require('../examples/01-vc-observer-next').default}
			title="Basic example"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			source={require('!!raw-loader!../examples/01-vc-observer-next')}
		/>
	)}

  ${(
		<Props
			heading="EditorPerformanceMetrics Props"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			props={require('!!extract-react-types-loader!../src')}
		/>
	)}
`;
export default _default_1;
