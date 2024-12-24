import React from 'react';

import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

### Show hover preview

The hover preview feature offers users a quick view of the content linked by a Smart Link without the need to open it.
When hovering over a Smart Link, a preview card displays, providing sufficient context to facilitate decision-making on whether to click the link.
This preview presents essential information and relevant actions associated with the linked object, including a "Preview" button to access the content in a modal window.

The hover preview functionality is crafted to optimise user interaction by enabling direct engagement with the linked content from the preview,
thereby minimising the necessity to navigate away from the current page.

For standalone hover preview, please see [hover card](./hover-card).

${(
	<CustomExample
		Component={require('../../../examples/content/inline-card-hover-card').default}
		source={require('!!raw-loader!../../../examples/content/inline-card-hover-card')}
	/>
)}

#### Hover preview: Actions

By default, the hover preview displays all the available Smart Links actions.
\`actionOptions\` can be utilized to configure the Smart Link behaviour.

* To conceal all actions, set the \`hide\` value to \`true\`.
* To hide all actions except for a specific action, set \`hide\` to \`false\` and specify the actions to be excluded using \`exclude\`.

For further details on each action, please see the [card actions](./card-actions).

${(
	<CustomExample
		Component={require('../../../examples/content/inline-card-hover-card-actions').default}
		source={require('!!raw-loader!../../../examples/content/inline-card-hover-card-actions')}
	/>
)}

#### Hover preview: Show unresolved states

Some Smart Links provide the capability to show restricted or unauthorized states.
Users have the option to request access, authenticate, or link their account through these views.
By default, by setting showHoverPreview to true, all states including unresolved states can be displayed on the hover card.

For a completed example of hover preview unresolved states, please see States on inline card overview.

${(
	<CustomExample
		Component={require('../../../examples/content/inline-card-hover-card-auth').default}
		source={require('!!raw-loader!../../../examples/content/inline-card-hover-card-auth')}
	/>
)}

#### Hover preview: Fade in delay

Delay (in milliseconds) between hovering over the trigger element and the hover card opening.
Defaults to 500ms.

${(
	<CustomExample
		Component={require('../../../examples/content/inline-card-hover-card-delay').default}
		source={require('!!raw-loader!../../../examples/content/inline-card-hover-card-delay')}
	/>
)}


### Resolving placeholder

Set \`resolvingPlaceholder\` to replace the link title text while the Smart Link is resolving.

${(
	<CustomExample
		Component={require('../../../examples/content/inline-card-resolving-placeholder').default}
		source={require('!!raw-loader!../../../examples/content/inline-card-resolving-placeholder')}
	/>
)}

### Resolving style

By default, inline resolving states display a frame with a spinner inside to the left.
An alternative appearance is to have no frame and the spinner on the right.
This can be achieved by setting the inlinePreloaderStyle to on-right-without-skeleton.
This property is currently dedicated to inline links in the editor.

${(
	<CustomExample
		Component={require('../../../examples/content/inline-card-preloader-style').default}
		source={require('!!raw-loader!../../../examples/content/inline-card-preloader-style')}
	/>
)}

### Show hover state

Set \`isHovered\` to indicate whether a card is in a hover state.
This flag is currently used exclusively for inline links in the editor.

${(
	<CustomExample
		Component={require('../../../examples/content/inline-card-is-hovered').default}
		source={require('!!raw-loader!../../../examples/content/inline-card-is-hovered')}
	/>
)}

### Remove text highlight from title

Remove [text fragment](https://developer.mozilla.org/en-US/docs/Web/URI/Fragment/Text_fragments) from Smart Link title by setting \`removeTextHighlightingFromTitle\` to \`true\`.
This adjustment will not affect the URL.

${(
	<CustomExample
		Component={require('../../../examples/content/inline-card-remove-text-highlight').default}
		source={require('!!raw-loader!../../../examples/content/inline-card-remove-text-highlight')}
	/>
)}

### Truncate

When \`truncateInline\` is set to \`true\`, inline cards will be truncated to one line.

${(
	<CustomExample
		Component={require('../../../examples/content/inline-card-truncate').default}
		source={require('!!raw-loader!../../../examples/content/inline-card-truncate')}
	/>
)}

`;
