import React from 'react';
import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

### Default

A default title block displays the link's icon and title.

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-default').default}
		source={require('!!raw-loader!../../../examples/content/title-block-default')}
	/>
)}

### Metadata

Use \`metadata\` to display metadata elements after link title, to the right of the block.
See ElementItem for available elements.

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-metadata').default}
		source={require('!!raw-loader!../../../examples/content/title-block-metadata')}
	/>
)}

### Subtitle metadata

Use \`subtitle\` to display metadata elements below the link title.
See ElementItem for available elements.

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-subtitle').default}
		source={require('!!raw-loader!../../../examples/content/title-block-subtitle')}
	/>
)}


### Actions

Use \`actions\` to display action buttons on the right of the block.
See ActionItem for actions configurations.

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-actions').default}
		source={require('!!raw-loader!../../../examples/content/title-block-actions')}
	/>
)}

Adding three actions or more will result in the actions being hidden inside of a dropdown.

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-actions-more').default}
		source={require('!!raw-loader!../../../examples/content/title-block-actions-more')}
	/>
)}

### Show action on hover

Use an \`showActionOnHover\` to hide actions until the user hovers over the link.

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-actions-on-hover').default}
		source={require('!!raw-loader!../../../examples/content/title-block-actions-on-hover')}
	/>
)}

### Sizing

Use \`size\` to override the size from block's parent (\`<Card />\`) ui options.

By default, a block inherits the size from its parent and applies the size to
the elements and actions inside.
Overriding the size on block level will set the new default size for its children.
See ElementItem and ActionItem for element sizing and action sizing respectively,
and how to override block sizing.

#### Small

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-size-small').default}
		source={require('!!raw-loader!../../../examples/content/title-block-size-small')}
	/>
)}

#### Medium

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-size-medium').default}
		source={require('!!raw-loader!../../../examples/content/title-block-size-medium')}
	/>
)}

#### Large

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-size-large').default}
		source={require('!!raw-loader!../../../examples/content/title-block-size-large')}
	/>
)}

#### X-Large

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-size-xlarge').default}
		source={require('!!raw-loader!../../../examples/content/title-block-size-xlarge')}
	/>
)}

### Direction [In development]

Use \`direction\` to set the flow of the block.
By default, all title block content is displayed horizontally.
The example below shows the block in vertical layout.

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-direction').default}
		source={require('!!raw-loader!../../../examples/content/title-block-direction')}
	/>
)}

### Position

Use \`position\` to set the position of the icon.
It can either be \`center\` or placed on \`top\`.
Default is \`top\`.

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-position').default}
		source={require('!!raw-loader!../../../examples/content/title-block-position')}
	/>
)}

### Override link title

Use an \`text\` to override link title.

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-override-title').default}
		source={require('!!raw-loader!../../../examples/content/title-block-override-title')}
	/>
)}

### Override link target

Use an \`anchorTarget\` to override link target. Default is \`_blank\`.

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-override-target').default}
		source={require('!!raw-loader!../../../examples/content/title-block-override-target')}
	/>
)}

### Hide Link Icon

Use \`hideIcon\` to hide the Link Icon.

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-hide-icon').default}
		source={require('!!raw-loader!../../../examples/content/title-block-hide-icon')}
	/>
)}

### Hide link title tooltip [Experiment]

Use \`hideTitleTooltip\` to hide the tooltip on link title.

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-hide-title-tooltip').default}
		source={require('!!raw-loader!../../../examples/content/title-block-hide-title-tooltip')}
	/>
)}

### Override CSS

Use \`overrideCss\` to override the styles of the block.
Although let us know what we’re missing in the spirit of improving platform
components for everyone!

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-override-css').default}
		source={require('!!raw-loader!../../../examples/content/title-block-override-css')}
	/>
)}

### Resolving views
When a link is loading, the TitleBlock will show resolving views.
 If \`hideIcon\` is true, the icon will be hidden.

#### Default loading view
${(
	<CustomExample
		Component={require('../../../examples/content/title-block-resolving').default}
		sourceVisible={false}
	/>
)}

#### Default loading view with hidden icon
${(
	<CustomExample
		Component={require('../../../examples/content/title-block-resolving-hide-icon').default}
		sourceVisible={false}
	/>
)}


### Unresolved views

When a link fails to resolved, the TitleBlock will show unresolved views with the url of the link
and any additional information about the error.
If \`text\` is defined, the url will be override with its value.
If \`hideIcon\` is true, the icon will be hidden.

#### Default error view

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-unresolved-error').default}
		sourceVisible={false}
	/>
)}

#### Default error view with hidden icon

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-unresolved-error-hide-icon').default}
		sourceVisible={false}
	/>
)}

#### Not found view

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-unresolved-not-found').default}
		sourceVisible={false}
	/>
)}

#### Forbidden view

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-unresolved-forbidden').default}
		sourceVisible={false}
	/>
)}

A forbidden view may render the provider icon given that link resolver providing the icon url.

#### Unauthorized view

${(
	<CustomExample
		Component={require('../../../examples/content/title-block-unresolved-unauth').default}
		sourceVisible={false}
	/>
)}

An unauthorized view may render the provider icon given that link resolver providing the icon url.

`;
