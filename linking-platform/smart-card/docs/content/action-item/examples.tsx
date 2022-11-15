import React from 'react';
import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

These are the different variants of \`ActionItem\`.
To create a custom action, see [CustomAction](#custom-action).

${(
  <CustomExample
    Component={require('../../../examples/content/action-variants').default}
    sourceVisible={false}
  />
)}

### Default

As it happens, an action has two defaults.

* On [TitleBlock](./title-block), an action has white background that turns grey on hover.
* On [FooterBlock](./footer-block), an action has gray background that turns darker shade on hover.

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

### Override CSS

Use \`overrideCss\` to override the styles of the block.
Although let us know what we’re missing in the spirit of improving platform components for everyone!

${(
  <CustomExample
    Component={require('../../../examples/content/action-override-css').default}
    highlight="9"
    source={require('!!raw-loader!../../../examples/content/action-override-css')}
  />
)}

<a name="custom-action"></a>
### Custom action

Create a unique action for your application with CustomAction by defining its icon and content.

* \`icon\` is the icon for an action.
* \`content\` is the label of an action.

There are also a few constraints.

* If \`hideContent\` is \`true\`, \`icon\` must be specified.
* If \`hideIcon\` is \`true\`, \`content\` must be specified.

${(
  <CustomExample
    Component={require('../../../examples/content/action-custom').default}
    highlight="9"
    source={require('!!raw-loader!../../../examples/content/action-custom')}
  />
)}
`;
