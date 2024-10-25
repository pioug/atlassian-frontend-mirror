import React from 'react';

import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

${(
	<CustomExample
		Component={require('../../../examples/content/link-url').default}
		source={require('!!raw-loader!../../../examples/content/link-url')}
	/>
)}
`;
