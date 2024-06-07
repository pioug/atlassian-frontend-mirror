import React from 'react';
import { md, Example } from '@atlaskit/docs';
export default md`


${(
	<Example
		Component={require('./clipboard-minimal-example').default}
		title="Copy and Paste example"
		source={require('!!raw-loader!./clipboard-minimal-example')}
	/>
)}


`;
