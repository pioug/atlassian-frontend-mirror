import React from 'react';
import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

### Actions

Smart Links support various actions on specific links. For instance, a Confluence page link offers a preview action.
These actions can be customized using the \`actionOptions\` prop.
By default, Smart Links displays all available actions for the link, based on the view component.

* To disable all card actions, set the \`hide\` prop to \`true\`.
* To enable specific actions, set the \`hide\` prop to \`false\` and set \`exclude\` prop with action names.

For further information on specific actions, refer to the [card actions](./card-actions).

${(
	<CustomExample
		Component={require('../../../examples/content/block-card-action-options').default}
		source={require('!!raw-loader!../../../examples/content/block-card-action-options')}
	/>
)}

`;
