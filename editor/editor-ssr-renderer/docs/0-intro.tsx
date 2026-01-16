import React from 'react';

import { AtlassianInternalWarning, Example, md } from '@atlaskit/docs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`
${(<AtlassianInternalWarning />)}

  ${(
		<Example
			packageName="@atlaskit/editor-ssr-renderer"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			Component={require('../examples/0-all-nodes').default}
			title="SSR renderer based on the Editor"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			source={require('!!raw-loader!../examples/0-all-nodes')}
		/>
	)}
`;
export default _default_1;
