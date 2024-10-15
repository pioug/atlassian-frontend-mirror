import React from 'react';
import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

### CardSSR

The inline Smart Link is rendered with \`CardSSR\`. Scroll down to to find a lazily loaded \`Card\`.

${(
	<CustomExample
		Component={require('../../../examples/content/card-ssr').default}
		source={require('!!raw-loader!../../../examples/content/card-ssr')}
	/>
)}

`;
