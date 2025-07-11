import React from 'react';

import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

These are the different variants of \`ActionItem\`.
To create a custom action, see \`CustomAction\`.

${(
	<CustomExample
		Component={require('../../../examples/content/action-variants').default}
		source={require('!!raw-loader!../../../examples/content/action-variants')}
	/>
)}

### Default

As it happens, an action has two defaults.

* On TitleBlock, an action has white background that turns grey on hover.
* On FooterBlock, an action has gray background that turns darker shade on hover.

On both block, a default action shows icon on the left, follows by action text.

${(
	<CustomExample
		Component={require('../../../examples/content/action-default').default}
		highlight="9"
		source={require('!!raw-loader!../../../examples/content/action-default')}
	/>
)}

### Size

Use \`size\` to override block sizing on individual action.

${(
	<CustomExample
		Component={require('../../../examples/content/action-size').default}
		highlight="9"
		source={require('!!raw-loader!../../../examples/content/action-size')}
	/>
)}

### Hide content

Use \`hideContent\` to hide the action button label.

Note: When hiding content, the text will still appear in a tooltip when hovering over the icon.

${(
	<CustomExample
		Component={require('../../../examples/content/action-hide-content').default}
		highlight="9"
		source={require('!!raw-loader!../../../examples/content/action-hide-content')}
	/>
)}

### Hide icon

Use \`hideContent\` to hide the action button icon.

${(
	<CustomExample
		Component={require('../../../examples/content/action-hide-icon').default}
		highlight="9"
		source={require('!!raw-loader!../../../examples/content/action-hide-icon')}
	/>
)}

### Custom action

Create a unique action for your application with CustomAction by defining its icon and content.

* \`icon\` is the icon for an action.
* \`content\` is the label of an action.

There are also a few constraints.

* If \`hideContent\` is \`true\`, \`icon\` must be specified.
* If \`hideIcon\` is \`true\`, \`content\` must be specified.

Note: When hiding content, the text will still appear in a tooltip when hovering over the icon.

${(
	<CustomExample
		Component={require('../../../examples/content/action-custom').default}
		highlight="9"
		source={require('!!raw-loader!../../../examples/content/action-custom')}
	/>
)}
`;
