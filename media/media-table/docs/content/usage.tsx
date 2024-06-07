import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  ${(
		<Example
			Component={require('./simple-usage-example').default}
			title="File Card"
			source={require('!!raw-loader!./simple-usage-example')}
		/>
	)}
`;
