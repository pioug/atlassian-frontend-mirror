import React from 'react';
import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

### Default

A default title block displays the link icon and title.

${(
  <CustomExample
    Component={require('../../../examples/content/title-block-default').default}
    source={require('!!raw-loader!../../../examples/content/title-block-default')}
  />
)}

### Metadata

Use \`metadata\` to display metadata elements after link title, to the right of the block.
See [ElementItem](./element-item) for available elements.

${(
  <CustomExample
    Component={
      require('../../../examples/content/title-block-metadata').default
    }
    source={require('!!raw-loader!../../../examples/content/title-block-metadata')}
  />
)}

### Subtitle metadata

Use \`subtitle\` to display metadata elements below the link title.
See [ElementItem](./element-item) for available elements.

${(
  <CustomExample
    Component={
      require('../../../examples/content/title-block-subtitle').default
    }
    source={require('!!raw-loader!../../../examples/content/title-block-subtitle')}
  />
)}


### Actions

Use an \`actions\` to display action buttons on the right of the block.
See [ActionItem](./action-item) for actions configurations.

${(
  <CustomExample
    Component={require('../../../examples/content/title-block-actions').default}
    source={require('!!raw-loader!../../../examples/content/title-block-actions')}
  />
)}

Adding three actions or more will result in the actions being hidden inside of a dropdown.

${(
  <CustomExample
    Component={
      require('../../../examples/content/title-block-actions-more').default
    }
    source={require('!!raw-loader!../../../examples/content/title-block-actions-more')}
  />
)}

### Show action on hover

Use an \`showActionOnHover\` to hide actions until the user hovers over the link.

${(
  <CustomExample
    Component={
      require('../../../examples/content/title-block-actions-on-hover').default
    }
    source={require('!!raw-loader!../../../examples/content/title-block-actions-on-hover')}
  />
)}

### Sizing

Use \`size\` to override the size from block's parent (\`<Card />\`) ui options.

By default, a block inherits the size from its parent and applies the size to
the elements and actions inside.
Override the size on block level will set the new default size for its children.
See element item and action item for element sizing and action sizing respectively,
and how to override block sizing.

#### Small

${(
  <CustomExample
    Component={
      require('../../../examples/content/title-block-size-small').default
    }
    source={require('!!raw-loader!../../../examples/content/title-block-size-small')}
  />
)}

#### Medium

${(
  <CustomExample
    Component={
      require('../../../examples/content/title-block-size-medium').default
    }
    source={require('!!raw-loader!../../../examples/content/title-block-size-medium')}
  />
)}

#### Large

${(
  <CustomExample
    Component={
      require('../../../examples/content/title-block-size-large').default
    }
    source={require('!!raw-loader!../../../examples/content/title-block-size-large')}
  />
)}

#### X-Large

${(
  <CustomExample
    Component={
      require('../../../examples/content/title-block-size-xlarge').default
    }
    source={require('!!raw-loader!../../../examples/content/title-block-size-xlarge')}
  />
)}

### Direction [Experiment]

Use an \`direction\` to set the flow of the block.
By default, all block is displayed in horizontal.
An example below show the block in vertical.

${(
  <CustomExample
    Component={
      require('../../../examples/content/title-block-direction').default
    }
    source={require('!!raw-loader!../../../examples/content/title-block-direction')}
  />
)}

### Position

Use an \`position\` to set the position of the icon.
It can either be \`center\` or placed on \`top\`.
Default is \`top\`.

${(
  <CustomExample
    Component={
      require('../../../examples/content/title-block-position').default
    }
    source={require('!!raw-loader!../../../examples/content/title-block-position')}
  />
)}

### Override link title

Use an \`text\` to override link title.

${(
  <CustomExample
    Component={
      require('../../../examples/content/title-block-override-title').default
    }
    source={require('!!raw-loader!../../../examples/content/title-block-override-title')}
  />
)}

### Override link target

Use an \`anchorTarget\` to override link target. Default is \`_blank\`.

${(
  <CustomExample
    Component={
      require('../../../examples/content/title-block-override-target').default
    }
    source={require('!!raw-loader!../../../examples/content/title-block-override-target')}
  />
)}

### Override CSS

Use \`overrideCss\` to override the styles of the block.
Although let us know what we’re missing in the spirit of improving platform
components for everyone!

${(
  <CustomExample
    Component={
      require('../../../examples/content/title-block-override-css').default
    }
    source={require('!!raw-loader!../../../examples/content/title-block-override-css')}
  />
)}

### Unresolved views

When a link fails to resolved, the TitleBlock will show unresolved views with the url of the link
and any additional information about the error.
If \`text\` is defined, the url will be override with its value.

#### Default error view

${(
  <CustomExample
    Component={
      require('../../../examples/content/title-block-unresolved-error').default
    }
    sourceVisible={false}
  />
)}

#### Not found view

${(
  <CustomExample
    Component={
      require('../../../examples/content/title-block-unresolved-not-found')
        .default
    }
    sourceVisible={false}
  />
)}

#### Forbidden view

${(
  <CustomExample
    Component={
      require('../../../examples/content/title-block-unresolved-forbidden')
        .default
    }
    sourceVisible={false}
  />
)}

A forbidden view may render the provider icon given that link resolver providing the icon url.

#### Unauthorized view

${(
  <CustomExample
    Component={
      require('../../../examples/content/title-block-unresolved-unauth').default
    }
    sourceVisible={false}
  />
)}

An unauthorized view may render the provider icon given that link resolver providing the icon url.

`;
