import React from 'react';

import { AtlassianInternalWarning, Example, md } from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

  If not using the link picker directly in a popup and instead fitting it in a composition with a width
  that doesn't match our default you'll likely find the need to want to disable the default width and override
  the provided paddings.

  ## Disabling default width

  By enabling the \`disableWidth\` prop the link picker will instead have a width of 100% to fill the available space.

  ${(
		<Example
			packageName="@atlaskit/link-picker"
			Component={require('../examples/03-disable-width').default}
			title="Disable Width"
			source={require('!!raw-loader!../examples/03-disable-width')}
		/>
	)}

  ## Customising the built-in padding

  The left and right paddings can be controlled by providing \`paddingLeft\` and \`paddingRight\` props.
  The value provided should be a string that can be used in a CSS \`calc()\` (does not expect values such as \`unset\`).
  This allows for the list results to be able to bleed into the padding and should support most use-cases.

  ${(
		<Example
			packageName="@atlaskit/link-picker"
			Component={require('../examples/04-custom-padding').default}
			title="Custom Padding"
			source={require('!!raw-loader!../examples/04-custom-padding')}
		/>
	)}

  For consistency the top and bottom paddings can also be controlled/overridden via \`paddingTop\` and \`paddingBottom\` props respectively.
  If you find however that you want to customise these its more likely you'd be better off using these props to disable the padding altogether by providing values of \`'0'\`,
  and then supplying your own padding/margins in a container component.
`;
