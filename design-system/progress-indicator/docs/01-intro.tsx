import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  The progress dots are visual indicators used when stepping a user through
  a journey, to allow them to keep track of their progress.

  They are typically accompanied by a carousel or other such UI device.

  ## Usage

  ${code`import { ProgressIndicator } from '@atlaskit/progress-indicator';`}

  ${(
    <Example
      packageName="@atlaskit/progress-indicator"
      Component={require('../examples/progressIndicatorDefault').default}
      title="Basic"
      source={require('!!raw-loader!../examples/progressIndicatorDefault')}
    />
  )}

  ${(
    <Props
      heading="ProgressIndicator Props"
      props={require('!!extract-react-types-loader!../src/components/Dots')}
    />
  )}
`;
