import React from 'react';
import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

### Default

A default snippet block display a link description up to 3 lines.

${(
  <CustomExample
    Component={
      require('../../../examples/content/snippet-block-default').default
    }
    source={require('!!raw-loader!../../../examples/content/snippet-block-default')}
  />
)}

### Max lines

Use \`maxLines\` to configure the maximum number of lines to show at one time,
wrapping if necessary. The maximum and default number is 3.

The example below limit a snippet block to maximum of 1 line.

${(
  <CustomExample
    Component={
      require('../../../examples/content/snippet-block-max-lines').default
    }
    source={require('!!raw-loader!../../../examples/content/snippet-block-max-lines')}
  />
)}

### Sizing

As a Flexible Smart Links block, a snippet block inherits and allow sizing override.
However, this has **no impact** as a snippet block has no elements
or actions that support sizing.


### Override CSS

Use \`overrideCss\` to override the styles of the block.
Although let us know what we’re missing in the spirit of improving platform
components for everyone!

${(
  <CustomExample
    Component={
      require('../../../examples/content/snippet-block-override-css').default
    }
    source={require('!!raw-loader!../../../examples/content/snippet-block-override-css')}
  />
)}
`;
