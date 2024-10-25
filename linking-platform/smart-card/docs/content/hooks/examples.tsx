import React from 'react';

import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

### useSmartLinkActions

\`useSmartLinkActions\` can be used to extract actions from a smart link and invoke them outside of the smart card component.

This example hides the preview action from the block smart card and uses the hook to add the preview action to an external button.

${(
	<CustomExample
		Component={require('../../../examples/content/useSmartLinkActions').default}
		source={require('!!raw-loader!../../../examples/content/useSmartLinkActions')}
	/>
)}

`;
