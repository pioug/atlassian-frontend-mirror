import React from 'react';

import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

### Default

A default snippet block display a link description up to 3 lines.

${(
	<CustomExample
		Component={require('../../../examples/content/snippet-block-default').default}
		source={require('!!raw-loader!../../../examples/content/snippet-block-default')}
	/>
)}

### Max lines

Use \`maxLines\` to configure the maximum number of lines to show at one time,
wrapping if necessary. The maximum and default number is 3.

The example below limit a snippet block to maximum of 1 line.

${(
	<CustomExample
		Component={require('../../../examples/content/snippet-block-max-lines').default}
		source={require('!!raw-loader!../../../examples/content/snippet-block-max-lines')}
	/>
)}

### Text override

Use \`text\` to override the default link description.

${(
	<CustomExample
		Component={require('../../../examples/content/snippet-block-override-text').default}
		source={require('!!raw-loader!../../../examples/content/snippet-block-override-text')}
	/>
)}

### Non resolved view

This is the default view for a non resolved state.

${(
	<CustomExample
		Component={require('../../../examples/content/snippet-block-non-resolved-view').default}
		source={require('!!raw-loader!../../../examples/content/snippet-block-non-resolved-view')}
	/>
)}

### Non resolved view with text override

Use \`text\` to override the default null description in a non resolved state

${(
	<CustomExample
		Component={
			require('../../../examples/content/snippet-block-non-resolved-view-text-override').default
		}
		source={require('!!raw-loader!../../../examples/content/snippet-block-non-resolved-view-text-override')}
	/>
)}

### Sizing

As a Flexible Smart Links block, a snippet block inherits and allow sizing override.
However, this has **no impact** as a snippet block has no elements
or actions that support sizing.

`;
