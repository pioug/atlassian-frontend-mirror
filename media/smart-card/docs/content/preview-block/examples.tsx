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
    Component={
      require('../../../examples/content/preview-block-default').default
    }
    source={require('!!raw-loader!../../../examples/content/preview-block-default')}
  />
)}

### Sizing

As a Flexible Smart Links block, a preview block inherits and allow sizing override.
However, this has **no impact** as a preview block has no elements
or actions that support sizing.


### Override CSS

Use \`overrideCss\` to override the styles of the block.
Although let us know what we’re missing in the spirit of improving platform
components for everyone!

The following example shows the preview block styles being override to show in
4:3 aspect ratio.

${(
  <CustomExample
    Component={
      require('../../../examples/content/preview-block-override-css').default
    }
    source={require('!!raw-loader!../../../examples/content/preview-block-override-css')}
  />
)}

`;
