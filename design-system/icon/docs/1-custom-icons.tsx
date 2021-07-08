import React from 'react';
import { md, code, Props, Example } from '@atlaskit/docs';

export default md`
  Use the \`Icon\` component when needing an icon outside of our icon set _([do you, though?](https://hello.atlassian.net/wiki/spaces/DST/pages/782337741/Contribution+4.0+Contribution+documentation))_.

  ${code`
import Icon from '@atlaskit/icon/base';
  `}

  ${(
    <Example
      packageName="@atlaskit/icon"
      Component={require('../examples/custom-icon').default}
      title=""
      source={require('!!raw-loader!../examples/custom-icon')}
    />
  )}

  ## Constraints

  Your custom icon needs to adhere to the following constraints.

  - The root svg should be on a \`0 0 24 24\` view box
  - The first child element should set \`fill\` to \`currentColor\` to inherit the \`primaryColor\` prop
  - For icons with secondary colors set \`fill\` to \`inherit\` on the appropriate elements to inherit the \`secondaryColor\` prop

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/icon')}
    />
  )}
`;
