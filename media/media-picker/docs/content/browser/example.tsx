import React from 'react';
import { md, Example } from '@atlaskit/docs';
export default md`

${(
	<Example
		Component={require('./browser-minimal-example').default}
		title="Browser Example"
		source={require('!!raw-loader!./browser-minimal-example')}
	/>
)}


`;
