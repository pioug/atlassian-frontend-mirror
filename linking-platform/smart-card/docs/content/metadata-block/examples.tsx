import React from 'react';

import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

A metadata block is an empty block that can host metadata elements on the left
side of the block, on the right side of the block, or both.

${(
	<CustomExample
		Component={require('../../../examples/content/metadata-block-primary-secondary').default}
		source={require('!!raw-loader!../../../examples/content/metadata-block-primary-secondary')}
	/>
)}

### Default

A default metadata block is an empty container. If either primary or secondary
metadata elements are specified, it will not be displayed.

### Primary metadata

Use \`primary\` to display metadata elements on the left of the block.
See ElementItem for available elements.

${(
	<CustomExample
		Component={require('../../../examples/content/metadata-block-primary').default}
		source={require('!!raw-loader!../../../examples/content/metadata-block-primary')}
	/>
)}

### Secondary metadata

Use \`secondary\` to display metadata elements on the left of the block.
See ElementItem for available elements.

${(
	<CustomExample
		Component={require('../../../examples/content/metadata-block-secondary').default}
		source={require('!!raw-loader!../../../examples/content/metadata-block-secondary')}
	/>
)}

### Max lines

Use \`maxLines\` to configure the maximum number of lines to show at one time,
wrapping if necessary. The maximum and default number is 2.

${(
	<CustomExample
		Component={require('../../../examples/content/metadata-block-max-lines').default}
		source={require('!!raw-loader!../../../examples/content/metadata-block-max-lines')}
	/>
)}

The example below shows maximum number of lines limit to 1, while having the
same number of metadata elements specified as above example.

${(
	<CustomExample
		Component={require('../../../examples/content/metadata-block-single-line').default}
		source={require('!!raw-loader!../../../examples/content/metadata-block-single-line')}
	/>
)}

### Sizing

Use \`size\` to override the size from block's parent (\`<Card />\`) ui options.

By default, a block inherits the size from its parent and applies the size to
the elements and actions inside.
Override the size on block level will set the new default size for its children.

See element item for element sizing and how to override block sizing.

${(
	<CustomExample
		Component={require('../../../examples/content/metadata-block-size').default}
		source={require('!!raw-loader!../../../examples/content/metadata-block-size')}
	/>
)}

`;
