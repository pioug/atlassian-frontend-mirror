import React from 'react';
import { md } from '@atlaskit/docs';
import CustomExample from '../../utils/custom-example';

export default md`

### Sizing

Use \`size\` to set the link size. Sizing on the \`ui\` will be inherited to its
children - blocks, elements and actions.
Blocks, elements and actions can override this sizing.
Default size is medium.

#### Small

${(
  <CustomExample
    background={true}
    Component={
      require('../../../examples/content/ui-options-size-small').default
    }
    source={require('!!raw-loader!../../../examples/content/ui-options-size-small')}
  />
)}

#### Medium

${(
  <CustomExample
    background={true}
    Component={
      require('../../../examples/content/ui-options-size-medium').default
    }
    source={require('!!raw-loader!../../../examples/content/ui-options-size-medium')}
  />
)}

#### Large

${(
  <CustomExample
    background={true}
    Component={
      require('../../../examples/content/ui-options-size-large').default
    }
    source={require('!!raw-loader!../../../examples/content/ui-options-size-large')}
  />
)}

#### X-Large

${(
  <CustomExample
    background={true}
    Component={
      require('../../../examples/content/ui-options-size-xlarge').default
    }
    source={require('!!raw-loader!../../../examples/content/ui-options-size-xlarge')}
  />
)}

### Theme

Use \`theme\` to set Flexible Smart Links link colour. Default theme is link.

#### Link theme

${(
  <CustomExample
    background={true}
    Component={
      require('../../../examples/content/ui-options-theme-link').default
    }
    source={require('!!raw-loader!../../../examples/content/ui-options-theme-link')}
  />
)}

#### Black theme

${(
  <CustomExample
    background={true}
    Component={
      require('../../../examples/content/ui-options-theme-black').default
    }
    source={require('!!raw-loader!../../../examples/content/ui-options-theme-black')}
  />
)}

### Hide background

Use \`hideBackground\` to remove the default white background from the link.

${(
  <CustomExample
    background={true}
    Component={
      require('../../../examples/content/ui-options-hide-background').default
    }
    source={require('!!raw-loader!../../../examples/content/ui-options-hide-background')}
  />
)}

### Hide elevation

Use \`hideElevation\` to remove default elevation of the link.

${(
  <CustomExample
    background={true}
    Component={
      require('../../../examples/content/ui-options-hide-elevation').default
    }
    source={require('!!raw-loader!../../../examples/content/ui-options-hide-elevation')}
  />
)}

### Hide padding

Use \`hidePadding\` to remove default padding of the link.

${(
  <CustomExample
    background={true}
    Component={
      require('../../../examples/content/ui-options-hide-padding').default
    }
    source={require('!!raw-loader!../../../examples/content/ui-options-hide-padding')}
  />
)}

### Clickable container

The link title inside \`TitleBlock\` represents the anchor url of the link.
Use \`clickableContainer\` to make the entire \`<Card />\` component clickable.
Hover over the icon or the empty area in the example below.

${(
  <CustomExample
    background={true}
    Component={
      require('../../../examples/content/ui-options-clickable-container')
        .default
    }
    source={require('!!raw-loader!../../../examples/content/ui-options-clickable-container')}
  />
)}
`;
