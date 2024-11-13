import React from 'react';

import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

### Default

The preview block context box is fixed to aspect ratio of 16:9.
The replaced content is sized to maintain its aspect ratio while filling the
element's entire content box.
If the object's aspect ratio does not match the aspect ratio of its box,
then the object will be clipped to fit.
Center alignment of the selected replaced element's contents within the element's box.


${(
	<CustomExample
		Component={require('../../../examples/content/preview-block-default').default}
		source={require('!!raw-loader!../../../examples/content/preview-block-default')}
	/>
)}

### Left and Right Placement

You can also define whether you'd like your Preview Block to sit
left or right of the Flexible Smart Link content. This will scale to 30% of the
width of the card.

${(
	<CustomExample
		Component={require('../../../examples/content/preview-block-placement').default}
		source={require('!!raw-loader!../../../examples/content/preview-block-placement')}
	/>
)}

### Ignore Container Padding
In addition to defining the left or right placement of the Preview Block, you can
also define whether you'd like to remove the padding for the block. This can help
in situations where there is a focus on the content of the Preview Block.
This works regardless of placement (normal, left and right) of the card.

${(
	<CustomExample
		Component={require('../../../examples/content/preview-block-ignore-padding').default}
		source={require('!!raw-loader!../../../examples/content/preview-block-ignore-padding')}
	/>
)}


${(
	<CustomExample
		Component={require('../../../examples/content/preview-block-placement').default}
		source={require('!!raw-loader!../../../examples/content/preview-block-placement')}
	/>
)}

### Sizing

As a Flexible Smart Links block, a preview block inherits and allow sizing override.
However, this has **no impact** as a preview block has no elements
or actions that support sizing.

`;
