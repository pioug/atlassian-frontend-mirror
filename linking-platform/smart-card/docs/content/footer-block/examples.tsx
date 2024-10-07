import React from 'react';
import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

### Default

A default footer block contains \`Provider\` element, which is the source of the link.

${(
	<CustomExample
		Component={require('../../../examples/content/footer-block-default').default}
		source={require('!!raw-loader!../../../examples/content/footer-block-default')}
	/>
)}

### Actions

Use an \`actions\` to display action buttons on the right of the block.
See ActionItem for actions configurations.

${(
	<CustomExample
		Component={require('../../../examples/content/footer-block-actions').default}
		source={require('!!raw-loader!../../../examples/content/footer-block-actions')}
	/>
)}

Adding three actions or more will result in the actions being hidden inside of a dropdown.

${(
	<CustomExample
		Component={require('../../../examples/content/footer-block-actions-more').default}
		source={require('!!raw-loader!../../../examples/content/footer-block-actions-more')}
	/>
)}

### Sizing

Use \`size\` to override the size from block's parent (\`<Card />\`) ui options.

By default, a block inherits the size from its parent and applies the size to
the elements and actions inside.
Override the size on block level will set the new default size for its children.

For footer block, sizing has little to no effect to the block itself
as its main element, \`Provider\`, has only one size.
It, however, can affect actions inside the block.
See action item for action sizing and how to override block sizing.

${(
	<CustomExample
		Component={require('../../../examples/content/footer-block-size').default}
		source={require('!!raw-loader!../../../examples/content/footer-block-size')}
	/>
)}

### Override CSS

Use \`overrideCss\` to override the styles of the block.
Although let us know what we’re missing in the spirit of improving platform
components for everyone!

${(
	<CustomExample
		Component={require('../../../examples/content/footer-block-override-css').default}
		source={require('!!raw-loader!../../../examples/content/footer-block-override-css')}
	/>
)}

`;
