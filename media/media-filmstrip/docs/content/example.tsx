import React from 'react';
import { md, Example } from '@atlaskit/docs';
export default md`

${(
	<Example
		Component={require('./flimstrip-minimal-example').default}
		title="FilmStrip Example"
		source={require('!!raw-loader!./flimstrip-minimal-example')}
	/>
)}
`;
