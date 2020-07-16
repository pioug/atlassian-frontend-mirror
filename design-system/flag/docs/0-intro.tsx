import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Flags are designed to place a message above the regular page content.

  The flag group will animate flags entering and leaving the DOM,
  as well as rendering them in a Portal.

  ## Usage

  ${code`import Flag, { AutoDismissFlag, FlagGroup } from '@atlaskit/flag';`}

  ${(
    <Example
      packageName="@atlaskit/flag"
      Component={require('../examples/01-flag-without-flagGroup').default}
      title="Flag without group"
      source={require('!!raw-loader!../examples/01-flag-without-flagGroup')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/flag"
      Component={require('../examples/11-bold-flag-component').default}
      title="Flag using bold"
      source={require('!!raw-loader!../examples/11-bold-flag-component')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/flag"
      Component={require('../examples/12-flag-group').default}
      title="Flag group"
      source={require('!!raw-loader!../examples/12-flag-group')}
    />
  )}

  ${(
    <Props
      heading="Flag Props"
      props={require('!!extract-react-types-loader!../src/flag')}
    />
  )}

  ${(
    <Props
      heading="Auto Dismiss Flag Props"
      props={require('!!extract-react-types-loader!../src/auto-dismiss-flag')}
    />
  )}

  ${(
    <Props
      heading="Flag Group Props"
      props={require('!!extract-react-types-loader!../src/flag-group')}
    />
  )}

`;
