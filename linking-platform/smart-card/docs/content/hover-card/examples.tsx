import React from 'react';
import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

### Default
The default hover card will appear when hovering on children and disappear upon exiting the card boundary.
The \`url\` prop must be included with a hover card in order to be rendered. The hover card must also be wrapped by a card provider. 
A hover card will only display content if the card state is \`pending\`, \`unauthorized\` or \`resolved\`. 

In the below example, we are given some info about a YouTube video, an 'Open link in new tab' shortcut, and a 'Full screen view' action. The 'Full screen view'
action will always open the page content as a modal.

${(
	<CustomExample
		Component={require('../../../examples/content/hover-card-atlassian-basic').default}
		source={require('!!raw-loader!../../../examples/content/hover-card-atlassian-basic')}
		background={true}
	/>
)}

### Can open
Use the \`canOpen\` prop to block the hover card from opening when hovering on its children. If set to false while the hover card is open, 
the hoverCard will be closed and blocked from opening again. 

This prop will default to \`true\`.

Use the checkbox below to see \`canOpen\` working.

${(
	<CustomExample
		Component={require('../../../examples/content/hover-card-can-open').default}
		source={require('!!raw-loader!../../../examples/content/hover-card-can-open')}
		background={true}
	/>
)}

### Close when children are clicked

Use the \`closeOnChildClick\` prop to cause the hover card to close when a user clicks anywhere on the children/trigger element of the hover card.

This prop will default to \`false\`, i.e. the hover card will not close upon clicking children.

${(
	<CustomExample
		Component={require('../../../examples/content/hover-card-close-on-child-click').default}
		source={require('!!raw-loader!../../../examples/content/hover-card-close-on-child-click')}
		background={true}
	/>
)}
`;
