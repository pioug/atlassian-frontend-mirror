import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  Use the \`SVG\` component when the wrapping positional span used in \`Icon\` is not required and needing an icon outside of our icon set _([do you, though?](https://hello.atlassian.net/wiki/spaces/DST/pages/782337741/Contribution+4.0+Contribution+documentation))_.

  ${code`
import SVG from '@atlaskit/icon/svg';
  `}

  ${(
    <Example
      packageName="@atlaskit/icon"
      Component={require('../examples/14-svg').default}
      title=""
      source={require('!!raw-loader!../examples/14-svg')}
    />
  )}

  ## Constraints

  - \`SVG\` has a 24px by 24px view box which children should adhere to
  - The first child element should set \`fill\` to \`currentColor\` to inherit the \`primaryColor\` prop
  - For icons with secondary colors set \`fill\` to \`inherit\` on the appropriate elements to inherit the \`secondaryColor\` prop

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/svg')}
    />
  )}
  `;
