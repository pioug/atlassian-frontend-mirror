import React from 'react';
import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';
import actionOptions from '../../content/action-options';

export default customMd`

### Actions

Smart Links support various actions on specific links. For instance, a Confluence page link offers a preview action.

${actionOptions}

${(
	<CustomExample
		Component={require('../../../examples/content/block-card-action-options').default}
		source={require('!!raw-loader!../../../examples/content/block-card-action-options')}
	/>
)}

`;
