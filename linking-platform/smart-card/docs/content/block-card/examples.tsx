import React from 'react';
import CardViewExample from '../../../examples/card-view';
import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';
import state_description from '../state-description';

export default customMd`

Smart Links with block appearance presents the link as a card, giving a more detailed view of the linked material.
It really stands out compared to the inline style and comes in handy when you need extra context or a preview of the content.

Within the editor, the block appearance is referred to as the "Card."

${(
	<CustomExample
		Component={require('../../../examples/content/block-card').default}
		source={require('!!raw-loader!../../../examples/content/block-card')}
	/>
)}

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

### States

${state_description}

${(<CardViewExample appearance="block" frameStyle="show" />)}

`;
