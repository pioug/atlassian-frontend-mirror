import React from 'react';
import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

### Default
The default hover card will appear when hovering on children and disappear upon exiting the card boundary.
The \`url\` prop must be included with a hover card in order to be rendered.
The hover card must also be wrapped by a card provider and react intl.


${(
	<CustomExample
		Component={require('../../../examples/content/hover-card').default}
		source={require('!!raw-loader!../../../examples/content/hover-card')}
	/>
)}

### Actions

By default, the hover preview displays all the available Smart Links actions.
\`actionOptions\` can be utilized to configure the Smart Link behaviour.

* To conceal all actions, set the \`hide\` value to \`true\`.
* To hide all actions except for a specific action, set \`hide\` to \`false\` and specify the actions to be excluded using \`exclude\`.

For further details on each action, please see the [card actions](./card-actions).

${(
	<CustomExample
		Component={require('../../../examples/content/hover-card-actions').default}
		source={require('!!raw-loader!../../../examples/content/hover-card-actions')}
	/>
)}

### Fade in delay

Delay (in milliseconds) between hovering over the trigger element and the hover card opening.
Defaults to 500ms.

${(
	<CustomExample
		Component={require('../../../examples/content/hover-card-delay').default}
		source={require('!!raw-loader!../../../examples/content/hover-card-delay')}
	/>
)}


### Can open

Use the \`canOpen\` prop to block the hover card from opening when hovering on its children. If set to false while the hover card is open,
the hoverCard will be closed and blocked from opening again. This prop will default to \`true\`.

${(
	<CustomExample
		Component={require('../../../examples/content/hover-card-can-open').default}
		source={require('!!raw-loader!../../../examples/content/hover-card-can-open')}
	/>
)}

### Close when children are clicked

Use the \`closeOnChildClick\` prop to cause the hover card to close when a user clicks anywhere on the children/trigger element of the hover card.

This prop will default to \`false\`, i.e. the hover card will not close upon clicking children.

${(
	<CustomExample
		Component={require('../../../examples/content/hover-card-close-on-child-click').default}
		source={require('!!raw-loader!../../../examples/content/hover-card-close-on-child-click')}
	/>
)}
`;
