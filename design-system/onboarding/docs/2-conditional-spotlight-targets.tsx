import React from 'react';

import { code, Example, md } from '@atlaskit/docs';

export default md`
  You can use \`useSpotlight\` hook to check if spotlight target is rendered or not.

${code`
  const { isTargetRendered } = useSpotlight();

  isTargetRendered('target'); // true/false
`}

  ${(
    <Example
      packageName="@atlaskit/onboarding"
      Component={
        require('../examples/102-spotlight-with-conditional-targets').default
      }
      title=""
      source={require('!!raw-loader!../examples/102-spotlight-with-conditional-targets')}
    />
  )}
`;
